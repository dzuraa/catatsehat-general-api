-- CreateEnum
CREATE TYPE "BMIStatus" AS ENUM ('MALNUTRITION', 'UNDERNUTRITION', 'NORMAL', 'OVERWEIGHT', 'OBESITY');

-- CreateEnum
CREATE TYPE "CheckupStatus" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Elderly" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "age" INTEGER,
    "childOrder" INTEGER NOT NULL,
    "bloodType" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Elderly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckupElderly" (
    "id" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "bloodTension" DOUBLE PRECISION NOT NULL,
    "bloodSugar" DOUBLE PRECISION NOT NULL,
    "attend" TIMESTAMP(3) NOT NULL,
    "month" INTEGER,
    "bmiStatus" "BMIStatus",
    "status" "CheckupStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "adminId" TEXT,
    "elderlyId" TEXT,
    "healthPostId" TEXT,
    "lungsConclutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CheckupElderly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Elderly_id_key" ON "Elderly"("id");

-- AddForeignKey
ALTER TABLE "Elderly" ADD CONSTRAINT "Elderly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupElderly" ADD CONSTRAINT "CheckupElderly_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "HealthPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupElderly" ADD CONSTRAINT "CheckupElderly_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckupElderly" ADD CONSTRAINT "CheckupElderly_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "Elderly"("id") ON DELETE SET NULL ON UPDATE CASCADE;
