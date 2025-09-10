/*
  Warnings:

  - You are about to drop the column `header` on the `Webhook` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Webhook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Webhook" DROP COLUMN "header",
DROP COLUMN "path";
