-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_webhookId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public"."Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
