/*
  Warnings:

  - Added the required column `triggerType` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TriggerType" AS ENUM ('Webhook', 'Manual', 'Cron');

-- AlterTable
ALTER TABLE "public"."Workflow" ADD COLUMN     "triggerType" "public"."TriggerType" NOT NULL;
