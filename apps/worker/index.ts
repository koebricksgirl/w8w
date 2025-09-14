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

const GROUP = "workflowGroup";
const CONSUMER = `worker-${process.pid}`;

async function main() {
    await redis.connect();

    console.log("Worker started, waiting for jobs...");

    await redis.xGroupCreate("workflow:executions", GROUP, "0", { MKSTREAM: true }).catch(() => { });

    while (true) {
        try {
            const resp = (await redis.xReadGroup(
                GROUP,
                CONSUMER,
                { key: "workflow:executions", id: ">" },
                { BLOCK: 1000, COUNT: 1 }
            )) as XReadStream[] | null;

            if (!resp) continue;

            if (resp && Array.isArray(resp)) {
                for (const stream of resp) {
                    for (const message of stream?.messages) {
                        const { executionId, workflowId } = message.message;
                        console.log("Picked execution:", executionId);

                        try {
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

                            const indegree: Record<string, number> = {};
                            Object.keys(nodes).forEach((n) => (indegree[n] = 0));
                            Object.values(connections).forEach((targets) => {
                                targets.forEach(
                                    (t) => (indegree[t] = (indegree[t] || 0) + 1)
                                );
                            });


                            const queue: string[] = Object.keys(indegree).filter(
                                (n) => indegree[n] === 0
                            );

                            while (queue.length > 0) {
                                const nodeId = queue.shift()!;
                                const node = nodes[nodeId];

                                console.log(`Executing node ${nodeId} (${node.type})`);

                                try {
                                    const result = await runNode(node, context, workflowId);
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
                                        if (indegree[n] !== undefined) {
                                            indegree[n]--;
                                            if (indegree[n] === 0) queue.push(n)
                                        }
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

                            await redis.xAck("workflow:executions", GROUP, message.id);
                        } catch (err) {
                            console.error("Failed execution:", err);
                        }
                    }
                }
            }
        } catch (err: any) {
            console.error("Worker loop error:", err.message);
        }
    }
}

main();
