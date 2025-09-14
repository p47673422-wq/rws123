/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `cordinatorUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."RewardProgress" ADD COLUMN     "totalBookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStrength" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "cordinatorUser_email_key" ON "public"."cordinatorUser"("email");
