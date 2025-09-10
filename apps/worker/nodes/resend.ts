import prisma from "@w8w/db";
import { Resend } from "resend";
import Mustache from "mustache"

export async function sendEmail(config: any, credentialId: string, context: any) {
    try {
        const creds = await prisma.credentials.findUnique({ where: { id: credentialId } });
        if (!creds) throw new Error("Email credentials not found");

        const data = typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;
        if (!data.apiKey) throw new Error("Email API key missing in credentials");
        
        const resend = new Resend(data.apiKey);

        const to = Mustache.render(config.to, context);
        const subject = Mustache.render(config.subject, context);
        const body = Mustache.render(config.body, context);

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html: body
        })

        return { to, subject, body }
    } catch (error: any) {
        throw new Error("Failed to send Email:", error.message);
    }
}