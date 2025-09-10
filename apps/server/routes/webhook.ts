import express, { type Request, type Response } from "express"
import prisma from "@w8w/db"
import { enqueueExecution } from "../redis/enqueue";

const router = express.Router();

router.all("/webhooks/:webhookId", async (req: Request, res: Response) => {
  const { webhookId } = req.params;

  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
    include: { workflow: true }
  })

  if (!webhook) {
    return res.status(404).json({ message: "Webhook not found" });
  }

  if (webhook.secret) {
    const authHeader = req.headers["authorization"];
    if (authHeader !== webhook.secret) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  const totalTasks = Object.keys(webhook.workflow?.nodes as object).length;

  const execution = await prisma.execution.create({
    data: {
      workflowId: webhook.workflow?.id!,
      totalTasks,
     output: { triggerPayload: req.body ?? {} }
    }
  });

    await enqueueExecution(execution.id, webhook.workflow?.id!, req.body ?? {});
  console.log("Webhook triggered execution:", execution.id);

  return res.status(200).json({
    message: "Workflow triggered",
    executionId: execution.id
  });

})

export default router;