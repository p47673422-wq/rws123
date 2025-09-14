-- CreateEnum
CREATE TYPE "public"."CoType" AS ENUM ('PREACHER', 'LEADER', 'COUNCILER');

-- CreateEnum
CREATE TYPE "public"."PlaceType" AS ENUM ('SCHOOL', 'COOLLEGE', 'COMPANY', 'PUBLIC_PLACE', 'SHRESHTHA', 'OTHER');

-- CreateTable
CREATE TABLE "public"."cordinatorUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "public"."CoType" NOT NULL,
    "password" TEXT NOT NULL,
    "tempPasswordUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cordinatorUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" TEXT NOT NULL,
    "cordinatorId" TEXT NOT NULL,
    "placeType" "public"."PlaceType" NOT NULL,
    "placeName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "resources" TEXT[],
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RewardProgress" (
    "id" TEXT NOT NULL,
    "cordinatorId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "lastRewardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardProgress_cordinatorId_key" ON "public"."RewardProgress"("cordinatorId");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_cordinatorId_fkey" FOREIGN KEY ("cordinatorId") REFERENCES "public"."cordinatorUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RewardProgress" ADD CONSTRAINT "RewardProgress_cordinatorId_fkey" FOREIGN KEY ("cordinatorId") REFERENCES "public"."cordinatorUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
