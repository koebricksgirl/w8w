import type { Response } from "express";
import { type AuthRequest } from "../middleware/auth";
import { createWorkFlowSchema, updateWorkFlowSchema } from "@w8w/shared";
import prisma from "@w8w/db";
import { enqueueExecution } from "../redis/enqueue";

export const createWorkFlow = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const result = createWorkFlowSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Wrong inputs,zod validation failed",
        errors: result.error.issues
      })
      return
    }

    const newWorkflow = result.data;

    let webhookRecord = null;

    if (newWorkflow.triggerType === 'Webhook' && newWorkflow.webhook) {
      webhookRecord = await prisma.webhook.create({
        data: {
          title: newWorkflow.webhook.title,
          method: newWorkflow.webhook.method,
          secret: newWorkflow.webhook.secret
        }
      })
    }

    if (!newWorkflow) {
      res.status(404).json({
        message: "Details are not enough"
      })
      return
    }

    const workflow = await prisma.workflow.create({
      data: {
        title: newWorkflow.title,
        nodes: newWorkflow.nodes,
        connections: newWorkflow.connections,
        userId,
        triggerType: newWorkflow.triggerType,
        webhookId: webhookRecord?.id ?? null
      }
    })

    const totalTasks = Object.keys(newWorkflow.nodes).length;


    const execution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        totalTasks
      }
    })

    res.status(200).json({
      message: "Workflow Posted successfully",
      workflow,
      execution
    })
    return
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
    return
  }
}

export const updateWorkFlow = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { workflowId } = req.params;

    const result = updateWorkFlowSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Wrong inputs, zod validation failed",
        errors: result.error.issues
      });
    }

    const updateWorkFlowData = result.data;

    const existingWorkflow = await prisma.workflow.findFirst({
      where: { id: workflowId, userId },
      include: { webhook: true }
    });

    if (!existingWorkflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    if (existingWorkflow.userId !== userId) {
      return res.status(403).json({ message: "Not allowed to update this workflow" });
    }

    let webhookId: string | null = existingWorkflow.webhookId;

    if (updateWorkFlowData.webhook && webhookId) {
      await prisma.webhook.update({
        where: { id: webhookId },
        data: updateWorkFlowData.webhook
      });
    }

    if (updateWorkFlowData.webhook && !webhookId) {
      const newWebhook = await prisma.webhook.create({
        data: updateWorkFlowData.webhook
      });
      webhookId = newWebhook.id;
    }

    if (updateWorkFlowData.triggerType === "Manual" && webhookId) {
      await prisma.webhook.delete({ where: { id: webhookId } });
      webhookId = null;
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId, userId },
      data: {
        title: updateWorkFlowData.title ?? existingWorkflow.title,
        enabled: updateWorkFlowData.enabled ?? existingWorkflow.enabled,
        nodes: updateWorkFlowData.nodes ?? existingWorkflow.nodes ?? {},
        connections: updateWorkFlowData.connections ?? existingWorkflow.connections ?? {},
        triggerType: updateWorkFlowData.triggerType ?? existingWorkflow.triggerType,
        webhookId
      }
    });

    res.status(200).json({
      message: "Workflow updated successfully",
      workflow: updatedWorkflow
    });
    return;
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
    return
  }
}

export const deleteWorkFlow = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const { workflowId } = req.params;

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId }
    });

    if (!workflow || workflow.userId !== userId) {
      return res.status(403).json({ message: "Not allowed to delete this workflow" });
    }

    const deleted = await prisma.workflow.delete({
      where: {
        id: workflowId,
        userId
      },
      include: {
        executions: true
      }
    });

    res.status(200).json({
      message: "Workflow deleted successfully",
      workflow: deleted
    });
    return
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
    return
  }
}

export const getWorkflows = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const workflows = await prisma.workflow.findMany({
      where: { userId },
      include: { webhook: true, executions: true }
    })

    res.status(200).json({
      message: "Workflows fetched successfully",
      total: workflows.length,
      workflows
    });
    return
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
    return;
  }
}

export const getWorkflowById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { workflowId } = req.params;

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId
      }
    })


    if(!workflow) {
      res.status(404).json({
          message: "Workflow not found"
      })
      return
  }


    if(workflow?.userId !== userId) {
      res.status(404).json({
        message: "You don't have access to this workflow"
    })
    return
    }

    res.status(200).json({
      message: "Workflows fetched successfully",
      workflow
    });
    return
  } catch (error: any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
    return;
  }
}

export const runManualWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { workflowId } = req.params;

    if (!workflowId) {
      return res.status(400).json({ message: "workflowId is required" });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow.userId !== userId) {
      return res.status(403).json({ message: "Not allowed to run this workflow" });
    }

    if (workflow.triggerType !== "Manual") {
      return res.status(400).json({ message: "This workflow is not manual" });
    }

    const totalTasks = Object.keys(workflow.nodes as object).length;

    const execution = await prisma.execution.create({
      data: {
        workflowId,
        totalTasks,
       output: { triggerPayload: {} },
      },
    });

    await enqueueExecution(execution.id, workflowId, req.body ?? {});

    res.status(200).json({
      message: "Manual workflow triggered",
      executionId: execution.id,
    });
    return
  } catch (error: any) {
    console.error("Error running manual workflow:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    return
  }
};
