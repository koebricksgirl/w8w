import { WebClient } from "@slack/web-api";
import prisma from "@w8w/db";
import Mustache from "mustache"

export async function sendSlack(
 config: { channel: string, message: string },
 credentialId: string,
 context: any
) {
     const creds = await prisma.credentials.findUnique({
    where: { id: credentialId }
  });
  if (!creds) {
    throw new Error("Slack credentials not found");
  }

  const data = typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;

  const botToken = data.botToken;
  if(!botToken) {
    throw new Error("Slack bot token missing");
  }

  const client = new WebClient(botToken);

  const channel = Mustache.render(config.channel, context);
  const textMessage = Mustache.render(config.message,context);

  try {
    const res = await client.chat.postMessage({
        channel,
        text: textMessage
    });

    return { channel, text: textMessage, slackRes: res }
  } catch (error:any) {
    throw new Error(`Slack send failed: ${error.message}`);
  }
}