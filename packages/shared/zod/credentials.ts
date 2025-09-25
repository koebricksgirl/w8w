import { Platform } from '@w8w/db';
import * as z from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.ResendEmail),
  data: z.object({
    apiKey: z.string().min(1, "Resend Api Key required"),
    resendDomainMail: z
      .string()
      .regex(emailRegex, "Invalid email format")
      .optional(),
  }),
});

const telegramSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.Telegram),
  data: z.object({
    botToken: z.string().min(1, "Telegram botToken required"),
    chatId: z.string().min(1, "Telegram chatId required"),
  }),
});

const geminiSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.Gemini),
  data: z.object({
    geminiApiKey: z.string().min(1, "Gemini API key required"),
  }),
});

const slackSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.Slack),
  data: z.object({
    botToken: z.string().min(1, "Slack bot token is required"),
  }),
});



export const credentialsPostSchema = z.discriminatedUnion("platform", [
  resendSchema,
  telegramSchema,
  geminiSchema,
  slackSchema,
]);

export const credentialsUpdateSchema = z.discriminatedUnion("platform", [
  resendSchema,
  telegramSchema,
  geminiSchema,
  slackSchema,
]);


export type CredentialsPostInput = z.infer<typeof credentialsPostSchema>;
export type CredentialsUpdateInput = z.infer<typeof credentialsUpdateSchema>;
