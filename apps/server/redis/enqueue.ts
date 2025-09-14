import { redis } from "@w8w/shared";

await redis.connect();

export async function enqueueExecution(executionId: string, workflowId: string, payload: any) {
    try {
        await redis.xAdd("workflow:executions", '*', {
            executionId,
            workflowId,
            payload: JSON.stringify(payload)
        }, {
            TRIM: {
                strategy: 'MAXLEN',
                strategyModifier: '~',
                threshold: 10000
            }
        })

        console.log("Execution queued:", executionId);
    } catch (error:any) {
        throw new Error("Failed to enqueue:",error.message);
    }
}