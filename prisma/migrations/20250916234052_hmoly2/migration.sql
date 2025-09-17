/*
  Warnings:

  - A unique constraint covering the columns `[userId,level,type]` on the table `Gift_x` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gift_x_userId_level_type_key" ON "public"."Gift_x"("userId", "level", "type");
