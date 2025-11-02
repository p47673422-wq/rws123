-- CreateEnum
CREATE TYPE "public"."UserType_ZEnum" AS ENUM ('VEC_STORE_OWNER', 'STORE_OWNER', 'CAPTAIN', 'DISTRIBUTOR');

-- CreateEnum
CREATE TYPE "public"."StoreType_ZEnum" AS ENUM ('VEC', 'NORMAL');

-- CreateEnum
CREATE TYPE "public"."PreOrderStatus_Z" AS ENUM ('PENDING', 'PACKED', 'COLLECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus_Z" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."NoteType_ZEnum" AS ENUM ('FOLLOWUP', 'FREEFLOW');

-- CreateEnum
CREATE TYPE "public"."ReturnStatus_Z" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."User_Z" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userType" "public"."UserType_ZEnum" NOT NULL,
    "storeType" "public"."StoreType_ZEnum",
    "captainId" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "securityQuestion1" INTEGER,
    "securityAnswer1" TEXT,
    "securityQuestion2" INTEGER,
    "securityAnswer2" TEXT,
    "rememberMeToken" TEXT,
    "rememberMeExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Captain_Z" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Captain_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Book_Z" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "languages" TEXT[],
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreOrder_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "storeOwnerId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "status" "public"."PreOrderStatus_Z" NOT NULL DEFAULT 'PENDING',
    "otp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreOrder_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "receiptImageUrl" TEXT,
    "items" JSONB NOT NULL,
    "status" "public"."PaymentStatus_Z" NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inventory_Z" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification_Z" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notebook_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "noteType" "public"."NoteType_ZEnum" NOT NULL,
    "content" TEXT NOT NULL,
    "followUpPerson" TEXT,
    "followUpDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "reminderSet" BOOLEAN NOT NULL DEFAULT false,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notebook_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VenueBooking_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenueBooking_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReturnRequest_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "storeOwnerId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "status" "public"."ReturnStatus_Z" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnRequest_Z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sale_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "items" JSONB NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_Z_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Z_email_key" ON "public"."User_Z"("email");

-- CreateIndex
CREATE INDEX "User_Z_phone_idx" ON "public"."User_Z"("phone");

-- CreateIndex
CREATE INDEX "PreOrder_Z_distributorId_idx" ON "public"."PreOrder_Z"("distributorId");

-- CreateIndex
CREATE INDEX "PreOrder_Z_storeOwnerId_idx" ON "public"."PreOrder_Z"("storeOwnerId");

-- CreateIndex
CREATE INDEX "PreOrder_Z_status_idx" ON "public"."PreOrder_Z"("status");

-- CreateIndex
CREATE INDEX "Payment_Z_distributorId_idx" ON "public"."Payment_Z"("distributorId");

-- CreateIndex
CREATE INDEX "Payment_Z_verifiedById_idx" ON "public"."Payment_Z"("verifiedById");

-- CreateIndex
CREATE INDEX "Payment_Z_status_idx" ON "public"."Payment_Z"("status");

-- CreateIndex
CREATE INDEX "Inventory_Z_userId_idx" ON "public"."Inventory_Z"("userId");

-- CreateIndex
CREATE INDEX "Inventory_Z_bookId_idx" ON "public"."Inventory_Z"("bookId");

-- CreateIndex
CREATE INDEX "Notification_Z_userId_idx" ON "public"."Notification_Z"("userId");

-- CreateIndex
CREATE INDEX "Notebook_Z_distributorId_idx" ON "public"."Notebook_Z"("distributorId");

-- CreateIndex
CREATE INDEX "Notebook_Z_followUpDate_idx" ON "public"."Notebook_Z"("followUpDate");

-- CreateIndex
CREATE INDEX "Notebook_Z_dueDate_idx" ON "public"."Notebook_Z"("dueDate");

-- CreateIndex
CREATE INDEX "VenueBooking_Z_distributorId_idx" ON "public"."VenueBooking_Z"("distributorId");

-- CreateIndex
CREATE INDEX "VenueBooking_Z_date_idx" ON "public"."VenueBooking_Z"("date");

-- CreateIndex
CREATE INDEX "ReturnRequest_Z_distributorId_idx" ON "public"."ReturnRequest_Z"("distributorId");

-- CreateIndex
CREATE INDEX "ReturnRequest_Z_storeOwnerId_idx" ON "public"."ReturnRequest_Z"("storeOwnerId");

-- CreateIndex
CREATE INDEX "ReturnRequest_Z_status_idx" ON "public"."ReturnRequest_Z"("status");

-- CreateIndex
CREATE INDEX "ReturnRequest_Z_updatedAt_idx" ON "public"."ReturnRequest_Z"("updatedAt");

-- CreateIndex
CREATE INDEX "Sale_Z_distributorId_idx" ON "public"."Sale_Z"("distributorId");

-- CreateIndex
CREATE INDEX "Sale_Z_recordedAt_idx" ON "public"."Sale_Z"("recordedAt");

-- AddForeignKey
ALTER TABLE "public"."User_Z" ADD CONSTRAINT "User_Z_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "public"."Captain_Z"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreOrder_Z" ADD CONSTRAINT "PreOrder_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreOrder_Z" ADD CONSTRAINT "PreOrder_Z_storeOwnerId_fkey" FOREIGN KEY ("storeOwnerId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment_Z" ADD CONSTRAINT "Payment_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory_Z" ADD CONSTRAINT "Inventory_Z_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory_Z" ADD CONSTRAINT "Inventory_Z_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification_Z" ADD CONSTRAINT "Notification_Z_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notebook_Z" ADD CONSTRAINT "Notebook_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VenueBooking_Z" ADD CONSTRAINT "VenueBooking_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnRequest_Z" ADD CONSTRAINT "ReturnRequest_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnRequest_Z" ADD CONSTRAINT "ReturnRequest_Z_storeOwnerId_fkey" FOREIGN KEY ("storeOwnerId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sale_Z" ADD CONSTRAINT "Sale_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;