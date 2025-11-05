-- CreateTable
CREATE TABLE "public"."DailySales_Z" (
    "id" TEXT NOT NULL,
    "distributorId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailySales_Z_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailySales_Z_distributorId_idx" ON "public"."DailySales_Z"("distributorId");

-- CreateIndex
CREATE INDEX "DailySales_Z_bookId_idx" ON "public"."DailySales_Z"("bookId");

-- CreateIndex
CREATE INDEX "DailySales_Z_date_idx" ON "public"."DailySales_Z"("date");

-- AddForeignKey
ALTER TABLE "public"."DailySales_Z" ADD CONSTRAINT "DailySales_Z_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "public"."User_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailySales_Z" ADD CONSTRAINT "DailySales_Z_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book_Z"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
