-- CreateTable
CREATE TABLE "WeekPregnancyMonitoring" (
    "id" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekPregnancyMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PregnancyMonitoringRecord" (
    "id" TEXT NOT NULL,
    "status" "HealthStatus",
    "motherId" TEXT NOT NULL,
    "weekPregnancyMonitoringId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PregnancyMonitoringRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PregnancyMonitoringQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PregnancyMonitoringQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PregnancyMonitoringAnswer" (
    "id" TEXT NOT NULL,
    "answer" "AnswerOption" NOT NULL DEFAULT 'NOT_ANSWERED',
    "pregnancyMonitoringRecordId" TEXT NOT NULL,
    "pregnancyMonitoringQuestionId" TEXT NOT NULL,

    CONSTRAINT "PregnancyMonitoringAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekPregnancyMonitoring_id_key" ON "WeekPregnancyMonitoring"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WeekPregnancyMonitoring_name_key" ON "WeekPregnancyMonitoring"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringRecord_id_key" ON "PregnancyMonitoringRecord"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringRecord_motherId_weekPregnancyMonitoringI_key" ON "PregnancyMonitoringRecord"("motherId", "weekPregnancyMonitoringId");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringQuestion_id_key" ON "PregnancyMonitoringQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringQuestion_questionNumber_key" ON "PregnancyMonitoringQuestion"("questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PregnancyMonitoringAnswer_id_key" ON "PregnancyMonitoringAnswer"("id");

-- AddForeignKey
ALTER TABLE "PregnancyMonitoringRecord" ADD CONSTRAINT "PregnancyMonitoringRecord_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PregnancyMonitoringRecord" ADD CONSTRAINT "PregnancyMonitoringRecord_weekPregnancyMonitoringId_fkey" FOREIGN KEY ("weekPregnancyMonitoringId") REFERENCES "WeekPregnancyMonitoring"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PregnancyMonitoringAnswer" ADD CONSTRAINT "PregnancyMonitoringAnswer_pregnancyMonitoringRecordId_fkey" FOREIGN KEY ("pregnancyMonitoringRecordId") REFERENCES "PregnancyMonitoringRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PregnancyMonitoringAnswer" ADD CONSTRAINT "PregnancyMonitoringAnswer_pregnancyMonitoringQuestionId_fkey" FOREIGN KEY ("pregnancyMonitoringQuestionId") REFERENCES "PregnancyMonitoringQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
