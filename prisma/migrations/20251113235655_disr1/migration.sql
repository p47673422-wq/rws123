/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User_Z` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_Z_email_key";

-- DropIndex
DROP INDEX "public"."User_Z_phone_idx";

-- AlterTable
ALTER TABLE "public"."User_Z" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_Z_phone_key" ON "public"."User_Z"("phone");

-- CreateIndex
CREATE INDEX "User_Z_email_idx" ON "public"."User_Z"("email");
