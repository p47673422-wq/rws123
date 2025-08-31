-- CreateTable
CREATE TABLE "public"."OrderDeliveryStatus" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDeliveryStatus_pkey" PRIMARY KEY ("id")
);
