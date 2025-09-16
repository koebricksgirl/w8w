import { useEffect, useState } from "react";
import type { WorkflowEvent } from "../types/workflow";
import type { NodeStatus } from "../types/node";

export function useWorkflowEvents(workflowId: string) {
    const [events, setEvents] = useState<WorkflowEvent[]>([]);
    const [nodeStatuses, setNodeStatuses] = useState<Record<string, NodeStatus>>({});

    useEffect(() => {
        if (!workflowId) return;

        const ws = new WebSocket(import.meta.env.VITE_WS_URL);

        ws.onopen = () => {
            console.log("WS Connected");

            ws.send(JSON.stringify({ type: "subscribe", workflowId }));
        };

        ws.onmessage = (msg) => {
            try {
                const event = JSON.parse(msg.data);
                if (event.workflowId === workflowId) {
                    setEvents((prev) => [...prev, event]);

                    if (event.type === "node_started") {
                        setNodeStatuses((prev) => ({ ...prev, [event.nodeId]: "running" }));
                    }
                    if (event.type === "node_succeeded") {
                        setNodeStatuses((prev) => ({ ...prev, [event.nodeId]: "success" }));
                    }
                    if (event.type === "node_failed") {
                        setNodeStatuses((prev) => ({ ...prev, [event.nodeId]: "failed" }));
                    }

                }
            } catch (error) {
                console.error("Invalid WS message:", msg.data);
            }
        };

        ws.onclose = () => {
            console.log("WS disconnected");
        };


        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "unsubscribe", workflowId }));
            }
            ws.close();
        };

    }, [workflowId])

    return { events, nodeStatuses }
}