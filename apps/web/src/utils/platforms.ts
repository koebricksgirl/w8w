import type { Platform } from "../types/platform";

 export const PLATFORM_OPTIONS: Platform[] = ["Telegram", "Gemini", "ResendEmail", "Slack"] as Platform[];

 export const PLATFORM_FIELDS: Record<Platform, { key: string; label: string; type?: string; required?: boolean; pattern?: RegExp; placeholder?: string }[]> = {
  Telegram: [
    { key: "botToken", label: "Bot Token", required: true, placeholder: "Enter Telegram Bot Token" },
    { key: "chatId", label: "Chat ID", required: true, placeholder: "Enter Telegram Chat ID" },
  ],
  Gemini: [
    { key: "geminiApiKey", label: "Gemini API Key", required: true, placeholder: "Enter Gemini API Key" },
  ],
  ResendEmail: [
    { key: "apiKey", label: "Resend API Key", required: true, placeholder: "Enter Resend API Key" },
    { key: "resendDomainMail", label: "Resend Domain Email", required: false, placeholder: "Enter Domain Email (optional)", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  ],
  Form: [],
  Slack: [
    { key: "botToken", label: "Slack Bot Token", required: true, placeholder: "Enter Slack User OAuth Token"}
  ]
};
