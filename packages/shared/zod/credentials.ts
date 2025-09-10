import { Platform } from '@w8w/db';
import * as z from 'zod';

export const credentialsPostSchema = z.object({
  title: z.string().min(1,"Platform title needed"),
  platform: z.enum([Platform.ResendEmail, Platform.Telegram]),
  data: z.record(z.string(), z.any()) 
});

export const credentialsUpdateSchema = z.object({
  title: z.string().min(1,"Platform title needed").optional(),
  platform: z.enum([Platform.ResendEmail, Platform.Telegram]).optional(),
  data: z.record(z.string(), z.any()).optional() 
})