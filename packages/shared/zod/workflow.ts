import { Platform } from '@w8w/db';
import * as z from 'zod';

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum([Platform.ResendEmail,Platform.Telegram,Platform.Gemini]),
  config: z.record(z.string(), z.any()),
  credentialsId: z.string().optional()
});

const webhookSchema = z.object({
  title: z.string(),
  method: z.enum(["GET", "POST"]),
  secret: z.string().optional()
});

export const createWorkFlowSchema = z.object({
  title: z.string().min(1,"Workflow title needed"),
  nodes: z.record(z.string(), nodeSchema),
  connections: z.record(z.string(), z.array(z.string())),
  triggerType: z.enum(["Manual", "Webhook"]),
  webhook: webhookSchema.optional(),
  enabled: z.boolean().optional()
});

export const updateWorkFlowSchema = createWorkFlowSchema.partial();

