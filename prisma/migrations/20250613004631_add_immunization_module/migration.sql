/*
  Warnings:

  - A unique constraint covering the columns `[pregnancyMonitoringRecordId,pregnancyMonitoringQuestionId]` on the table `PregnancyMonitoringAnswer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `PregnancyMonitoringAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PregnancyMonitoringAnswer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Vaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccineStage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "suggestedAge" TEXT,
    "order" INTEGER,
    "vaccineId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VaccineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmunizationRecord" (
    "id" TEXT NOT NULL,
    "dateGiven" INTEGER,
    "note" TEXT,
    "upcomingVaccine" TEXT,
    "lastVaccineGiven" TEXT,
    "vaccineStatus" INTEGER,
    "immunizationStatus" INTEGER,
    "childrenId" TEXT,
    "vaccineId" TEXT,
    "vaccineStageId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ImmunizationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildVaccine" (
    "id" TEXT NOT NULL,
    "childrenId" TEXT,
    "vaccineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastVaccineGiven" TEXT,
    "upcomingVaccine" TEXT,
    "immunizationStatus" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ChildVaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildVaccineStage" (
    "id" TEXT NOT NULL,
    "childrenId" TEXT,
    "vaccineStageId" TEXT NOT NULL,
    "childVaccineId" TEXT,
    "name" TEXT NOT NULL,
    "suggestedAge" TEXT NOT NULL,
    "dateGiven" INTEGER,
    "order" INTEGER NOT NULL,
    "vaccineStatus" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ChildVaccineStage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vaccine_id_key" ON "Vaccine"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VaccineStage_id_key" ON "VaccineStage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ImmunizationRecord_id_key" ON "ImmunizationRecord"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChildVaccine_id_key" ON "ChildVaccine"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChildVaccine_childrenId_vaccineId_key" ON "ChildVaccine"("childrenId", "vaccineId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildVaccineStage_id_key" ON "ChildVaccineStage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChildVaccineStage_childrenId_vaccineStageId_key" ON "ChildVaccineStage"("childrenId", "vaccineStageId");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringAnswer_pregnancyMonitoringRecordId_pregn_key" ON "PregnancyMonitoringAnswer"("pregnancyMonitoringRecordId", "pregnancyMonitoringQuestionId");

-- AddForeignKey
ALTER TABLE "VaccineStage" ADD CONSTRAINT "VaccineStage_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmunizationRecord" ADD CONSTRAINT "ImmunizationRecord_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmunizationRecord" ADD CONSTRAINT "ImmunizationRecord_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmunizationRecord" ADD CONSTRAINT "ImmunizationRecord_vaccineStageId_fkey" FOREIGN KEY ("vaccineStageId") REFERENCES "VaccineStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildVaccine" ADD CONSTRAINT "ChildVaccine_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildVaccine" ADD CONSTRAINT "ChildVaccine_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildVaccineStage" ADD CONSTRAINT "ChildVaccineStage_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildVaccineStage" ADD CONSTRAINT "ChildVaccineStage_vaccineStageId_fkey" FOREIGN KEY ("vaccineStageId") REFERENCES "VaccineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildVaccineStage" ADD CONSTRAINT "ChildVaccineStage_childVaccineId_fkey" FOREIGN KEY ("childVaccineId") REFERENCES "ChildVaccine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
