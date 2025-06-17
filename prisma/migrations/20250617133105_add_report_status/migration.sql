/*
  Warnings:

  - You are about to drop the column `lungsConclutionId` on the `CheckupElderly` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `CheckupElderly` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ValueLungs" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "filePictureId" TEXT;

-- AlterTable
ALTER TABLE "CheckupElderly" DROP COLUMN "lungsConclutionId",
DROP COLUMN "month",
ADD COLUMN     "lungs" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Lungs" (
    "id" TEXT NOT NULL,
    "value" "ValueLungs" NOT NULL DEFAULT 'UNVERIFIED',
    "elderlyId" TEXT,
    "lungsConclutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterDataLungs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterDataLungs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LungsConclution" (
    "id" TEXT NOT NULL,
    "conclution" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LungsConclution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LungsPivot" (
    "id" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "lungsId" TEXT,
    "masterDataLungsId" TEXT,

    CONSTRAINT "LungsPivot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lungs" ADD CONSTRAINT "Lungs_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "Elderly"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lungs" ADD CONSTRAINT "Lungs_lungsConclutionId_fkey" FOREIGN KEY ("lungsConclutionId") REFERENCES "LungsConclution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LungsPivot" ADD CONSTRAINT "LungsPivot_lungsId_fkey" FOREIGN KEY ("lungsId") REFERENCES "Lungs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LungsPivot" ADD CONSTRAINT "LungsPivot_masterDataLungsId_fkey" FOREIGN KEY ("masterDataLungsId") REFERENCES "MasterDataLungs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_filePictureId_fkey" FOREIGN KEY ("filePictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
