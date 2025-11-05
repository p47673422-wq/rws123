-- CreateTable
CREATE TABLE "public"."PaymentRequest_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "dates" TIMESTAMP(3)[],
    "items" JSONB NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "paymentImageUrl" TEXT,
    "status" "public"."PaymentStatus_Z" NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT,

    CONSTRAINT "PaymentRequest_Z_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRequest_Z_paymentId_key" ON "public"."PaymentRequest_Z"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentRequest_Z_distributorId_idx" ON "public"."PaymentRequest_Z"("distributorId");

-- CreateIndex
CREATE INDEX "PaymentRequest_Z_verifiedById_idx" ON "public"."PaymentRequest_Z"("verifiedById");

-- CreateIndex
CREATE INDEX "PaymentRequest_Z_status_idx" ON "public"."PaymentRequest_Z"("status");

-- AddForeignKey
ALTER TABLE "public"."PaymentRequest_Z" ADD CONSTRAINT "PaymentRequest_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentRequest_Z" ADD CONSTRAINT "PaymentRequest_Z_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment_Z"("id") ON DELETE SET NULL ON UPDATE CASCADE;
