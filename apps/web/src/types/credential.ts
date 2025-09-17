import type { Platform } from "../types/platform";

export interface Credential {
  id?: string;
  title: string;
  platform: Platform;
  data: Record<string, any>;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}