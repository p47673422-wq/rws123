-- CreateEnum
CREATE TYPE "public"."GiftType_x" AS ENUM ('QUIZ', 'JAPA');

-- CreateTable
CREATE TABLE "public"."User_x" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuizAnswer_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "questionKey" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAnswer_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Commitment_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roundsPerDay" INTEGER NOT NULL,
    "friendsToInspire" INTEGER NOT NULL,
    "joinJapa" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commitment_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JapaProgress_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "rounds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JapaProgress_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gift_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "type" "public"."GiftType_x" NOT NULL,
    "name" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gift_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Badge_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_x_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_x_mobile_key" ON "public"."User_x"("mobile");

-- AddForeignKey
ALTER TABLE "public"."QuizAnswer_x" ADD CONSTRAINT "QuizAnswer_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Commitment_x" ADD CONSTRAINT "Commitment_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JapaProgress_x" ADD CONSTRAINT "JapaProgress_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gift_x" ADD CONSTRAINT "Gift_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Badge_x" ADD CONSTRAINT "Badge_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
