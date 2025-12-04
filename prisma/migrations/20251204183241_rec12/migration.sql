-- CreateTable
CREATE TABLE "public"."User_a" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tempPasswordUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_a_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseCode")
);

-- CreateTable
CREATE TABLE "public"."CourseDriveMap" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "driveFolderId" TEXT NOT NULL,

    CONSTRAINT "CourseDriveMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCourse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_a_mobile_key" ON "public"."User_a"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "CourseDriveMap_courseCode_key" ON "public"."CourseDriveMap"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_userId_courseCode_key" ON "public"."UserCourse"("userId", "courseCode");

-- AddForeignKey
ALTER TABLE "public"."CourseDriveMap" ADD CONSTRAINT "CourseDriveMap_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "public"."Course"("courseCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCourse" ADD CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User_a"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCourse" ADD CONSTRAINT "UserCourse_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "public"."Course"("courseCode") ON DELETE RESTRICT ON UPDATE CASCADE;
