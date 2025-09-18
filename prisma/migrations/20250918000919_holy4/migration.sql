/*
  Warnings:

  - A unique constraint covering the columns `[userId,level,questionKey]` on the table `QuizAnswer_x` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizAnswer_x_userId_level_questionKey_key" ON "public"."QuizAnswer_x"("userId", "level", "questionKey");
