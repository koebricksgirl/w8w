import prisma from "@w8w/db";
import Mustache from "mustache"
import fetch from "node-fetch"

export async function sendTelegramMessage(config: any, credentialId: string, context: any) {
    try {
        const creds = await prisma.credentials.findUnique({ where: { id: credentialId } });
        if (!creds) throw new Error("Telegram credentials not found");

        const data = typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;
        const { botToken, chatId } = data as { botToken: string; chatId: string };
        if (!botToken || !chatId) throw new Error("Telegram credentials invalid");


        const message = Mustache.render(config.message, context);


        const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        console.log("Telegram status: ", resp.status);

        const text = await resp.text();
        console.log("Telegram raw response:", text);

        let result: any = {};
        try {
            result = JSON.parse(text);
        } catch (err) {
            throw new Error(`Telegram returned invalid JSON: ${text}`);
        }

        if (!result.ok) {
            throw new Error(`Telegram API error: ${result.description || JSON.stringify(result)}`);
        }

        return { message };
    } catch (error: any) {
        throw new Error("Failed to send telegram message:", error.message);
    }
}