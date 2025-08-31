-- CreateTable
CREATE TABLE "public"."SelfieSubmission" (
    "id" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfieSubmission_pkey" PRIMARY KEY ("id")
);
