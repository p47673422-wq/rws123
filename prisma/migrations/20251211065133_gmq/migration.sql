-- CreateTable
CREATE TABLE "public"."UserProfileb" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" TEXT,
    "marital" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "UserProfileb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attemptb" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "score" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attemptb_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attemptb_userId_idx" ON "public"."Attemptb"("userId");

-- AddForeignKey
ALTER TABLE "public"."Attemptb" ADD CONSTRAINT "Attemptb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserProfileb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
