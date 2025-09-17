/*
  Warnings:

  - A unique constraint covering the columns `[userId,day]` on the table `JapaProgress_x` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JapaProgress_x_userId_day_key" ON "public"."JapaProgress_x"("userId", "day");
