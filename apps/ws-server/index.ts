import { WebSocketServer } from "ws";
import { config, redis } from "@w8w/shared";

const wss = new WebSocketServer({ port: Number(config.wsServer.port) || 8082 });

wss.on("connection", async (ws) => {
  console.log("Client connected");

  let sub: ReturnType<typeof redis.duplicate> | null = null;
  let subscribedChannel: string | null = null;

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type === "subscribe" && data.workflowId) {
        if (sub) {
          await sub.unsubscribe(subscribedChannel!);
          await sub.disconnect();
        }

        subscribedChannel = `workflow:${data.workflowId}:events`;
        sub = redis.duplicate();
        await sub.connect();

        console.log(`Client subscribed to ${subscribedChannel}`);

        await sub.subscribe(subscribedChannel, (message) => {
          if (ws.readyState === ws.OPEN) {
            ws.send(message);
          }
        });
      }
    } catch (err) {
      console.error("Invalid client message:", msg.toString(), err);
    }
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    if (sub && subscribedChannel) {
      await sub.unsubscribe(subscribedChannel);
      console.log(`Unsubscribed from ${subscribedChannel}`);
    }
  });
});

console.log(`WebSocket server started on ws://localhost:${config.wsServer.port}`);
