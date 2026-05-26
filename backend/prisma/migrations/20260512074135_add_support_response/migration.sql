/*
  Warnings:

  - You are about to drop the column `responseAt` on the `SupportTicket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SupportTicket" DROP COLUMN "responseAt",
ADD COLUMN     "respondedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'PENDING';
