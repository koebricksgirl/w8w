import prisma from "@w8w/db";
import { redis } from "@w8w/shared";
import { runNode } from "./nodes/runner/runner";

type XReadMessage = {
    id: string;
    message: Record<string, string>;
};

type XReadStream = {
    name: string;
    messages: XReadMessage[];
};

async function main() {
    await redis.connect();

    console.log("Worker started, waiting for jobs...");

    while (true) {
        try {
            const resp = (await redis.xRead(
                { key: "workflow:executions", id: "$" },
                { BLOCK: 3000, COUNT: 1 }
            )) as XReadStream[] | null;

            if (!resp) continue;

            if (resp && Array.isArray(resp)) {
                for (const stream of resp) {
                    for (const message of stream?.messages) {
                        const { executionId, workflowId } = message.message;
                        console.log("Picked execution:", executionId);

                        const workflow = await prisma.workflow.findUnique({
                            where: { id: workflowId },
                        });

                        if (!workflow) {
                            console.error("Workflow not found:", workflowId);
                            continue;
                        }

                        const execution = await prisma.execution.findUnique({
                            where: { id: executionId },
                        });


                        const triggerPayload =
                            (execution?.output as any)?.triggerPayload ?? {};



                        await prisma.execution.update({
                            where: { id: executionId },
                            data: { status: "RUNNING" },
                        });

                        const nodes = workflow.nodes as Record<string, any>;
                        const connections = workflow.connections as Record<string, string[]>;

                        let context: Record<string, any> = {
                            $json: { body: triggerPayload },
                            $node: {},

                        };


                        let tasksDone = 0;

                        for (const nodeId of Object.keys(nodes)) {
                            const node = nodes[nodeId];

                            console.log(`Executing node ${nodeId} (${node.type})`);

                            try {
                                const result = await runNode(node, context);
                                context.$node[nodeId] = result;

                                tasksDone++;

                                await prisma.execution.update({
                                    where: { id: executionId },
                                    data: {
                                        tasksDone,
                                        logs: { ...(execution!.logs as any), [nodeId]: "Success" },
                                    },
                                });

                                const nextNodes = connections[nodeId] || [];
                                nextNodes.forEach((n) => {
                                    console.log(`→ Next: ${n}`);
                                });

                            } catch (err: any) {
                                console.error(`Error in node ${nodeId}:`, err.message);

                                await prisma.execution.update({
                                    where: { id: executionId },
                                    data: {
                                        status: "FAILED",
                                        logs: {
                                            ...(execution!.logs as any),
                                            [nodeId]: `Error: ${err.message}`,
                                        },
                                    },
                                });
                                return;
                            }
                        }

                        await prisma.execution.update({
                            where: { id: executionId },
                            data: { status: "SUCCESS", tasksDone },
                        });

                        console.log("Execution finished:", executionId);
                    }
                }
            }
        } catch (err: any) {
            console.error("Worker loop error:", err.message);
        }
    }
}

main();
