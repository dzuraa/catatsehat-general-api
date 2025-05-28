/*
  Warnings:

  - Added the required column `motherId` to the `Children` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusBlood" AS ENUM ('DONE', 'NOT_DONE');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('ADMIN', 'PUBLIC');

-- AlterTable
ALTER TABLE "Children" ADD COLUMN     "motherId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CheckupChildren" (
    "id" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "headCircumference" DOUBLE PRECISION NOT NULL,
    "gender" "Gender" NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "bmiStatus" "BMIStatus" NOT NULL,
    "status" "CheckupStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "childrenId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "healthPostId" TEXT NOT NULL,
    "fileDiagnosedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CheckupChildren_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mother" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "code" TEXT,
    "userId" TEXT NOT NULL,
    "subDistrictId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Mother_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthBlood" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MonthBlood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "staffName" TEXT,
    "staffJob" TEXT,
    "note" TEXT,
    "adminId" TEXT,
    "motherId" TEXT NOT NULL,
    "monthId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BloodRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodSupplement" (
    "id" TEXT NOT NULL,
    "statusBlood" "StatusBlood",
    "totalConsume" INTEGER NOT NULL,
    "motherId" TEXT,
    "adminId" TEXT,
    "monthId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BloodSupplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodStep" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "motherId" TEXT,
    "bloodSupplementId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BloodStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckupMother" (
    "id" TEXT NOT NULL,
    "type" "OwnerType" NOT NULL,
    "month" INTEGER NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "upperArmCircumference" DOUBLE PRECISION NOT NULL,
    "fundusMeasurement" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "bmiStatus" "BMIStatus" NOT NULL,
    "status" "CheckupStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "location" TEXT,
    "publicStaff" TEXT,
    "motherId" TEXT NOT NULL,
    "healthPostId" TEXT,
    "adminId" TEXT,
    "fileDiagnosedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CheckupMother_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckupChildren_id_key" ON "CheckupChildren"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Mother_id_key" ON "Mother"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Mother_code_key" ON "Mother"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MonthBlood_id_key" ON "MonthBlood"("id");

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupChildren" ADD CONSTRAINT "CheckupChildren_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupChildren" ADD CONSTRAINT "CheckupChildren_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupChildren" ADD CONSTRAINT "CheckupChildren_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "HealthPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupChildren" ADD CONSTRAINT "CheckupChildren_fileDiagnosedId_fkey" FOREIGN KEY ("fileDiagnosedId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mother" ADD CONSTRAINT "Mother_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mother" ADD CONSTRAINT "Mother_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRecord" ADD CONSTRAINT "BloodRecord_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRecord" ADD CONSTRAINT "BloodRecord_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRecord" ADD CONSTRAINT "BloodRecord_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "MonthBlood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodSupplement" ADD CONSTRAINT "BloodSupplement_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodSupplement" ADD CONSTRAINT "BloodSupplement_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodSupplement" ADD CONSTRAINT "BloodSupplement_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "MonthBlood"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodStep" ADD CONSTRAINT "BloodStep_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodStep" ADD CONSTRAINT "BloodStep_bloodSupplementId_fkey" FOREIGN KEY ("bloodSupplementId") REFERENCES "BloodSupplement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupMother" ADD CONSTRAINT "CheckupMother_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupMother" ADD CONSTRAINT "CheckupMother_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "HealthPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupMother" ADD CONSTRAINT "CheckupMother_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupMother" ADD CONSTRAINT "CheckupMother_fileDiagnosedId_fkey" FOREIGN KEY ("fileDiagnosedId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
