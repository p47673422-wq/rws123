-- CreateTable
CREATE TABLE "public"."Friend_x" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_x_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Friend_x" ADD CONSTRAINT "Friend_x_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_x"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
