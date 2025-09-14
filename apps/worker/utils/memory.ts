import { redis } from "@w8w/shared";

const MEMORY_LIMIT = 25;

export async function getMemory(workflowId: string) {
    const key = `workflow:${workflowId}:memory`;
    const history = await redis.lRange(key, 0 , -1);
    return history.map((h) => JSON.parse(h));
}

export async function addMemory(
 workflowId: string,
 role: "user" | "assistant",
 content: string
) {
  const key = `workflow:${workflowId}:memory`;

  await redis.lPush(key, JSON.stringify({ role, content, ts: Date.now() }));

  await redis.lTrim(key, -MEMORY_LIMIT, -1);
}