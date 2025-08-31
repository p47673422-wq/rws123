-- CreateTable
CREATE TABLE "public"."BhagavadGitaRegistration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "maritalStatus" TEXT,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BhagavadGitaRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BhagavadGitaRegistration_mobile_language_key" ON "public"."BhagavadGitaRegistration"("mobile", "language");
