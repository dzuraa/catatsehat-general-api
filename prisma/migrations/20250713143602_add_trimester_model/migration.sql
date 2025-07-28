-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WeekPregnancyMonitoring" ADD COLUMN     "trimesterId" TEXT;

-- CreateTable
CREATE TABLE "Trimester" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trimester_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trimester_id_key" ON "Trimester"("id");

-- AddForeignKey
ALTER TABLE "WeekPregnancyMonitoring" ADD CONSTRAINT "WeekPregnancyMonitoring_trimesterId_fkey" FOREIGN KEY ("trimesterId") REFERENCES "Trimester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
