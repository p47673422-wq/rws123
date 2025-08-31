-- CreateTable
CREATE TABLE "public"."JapaChant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chantCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JapaChant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JapaChant_userId_key" ON "public"."JapaChant"("userId");

-- AddForeignKey
ALTER TABLE "public"."JapaChant" ADD CONSTRAINT "JapaChant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
