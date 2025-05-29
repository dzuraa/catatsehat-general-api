-- CreateEnum
CREATE TYPE "AnswerOption" AS ENUM ('YES', 'NO', 'NOT_ANSWERED');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'UNHEALTHY');

-- CreateTable
CREATE TABLE "DayPostPartum" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayPostPartum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostPartumRecord" (
    "id" TEXT NOT NULL,
    "status" "HealthStatus",
    "motherId" TEXT NOT NULL,
    "dayPostPartumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostPartumRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostPartumQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostPartumQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostPartumAnswer" (
    "id" TEXT NOT NULL,
    "answer" "AnswerOption" NOT NULL DEFAULT 'NOT_ANSWERED',
    "postPartumRecordId" TEXT NOT NULL,
    "postPartumQuestionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostPartumAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayPostPartum_id_key" ON "DayPostPartum"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DayPostPartum_name_key" ON "DayPostPartum"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumRecord_id_key" ON "PostPartumRecord"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumRecord_motherId_dayPostPartumId_key" ON "PostPartumRecord"("motherId", "dayPostPartumId");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumQuestion_id_key" ON "PostPartumQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumQuestion_questionNumber_key" ON "PostPartumQuestion"("questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumAnswer_id_key" ON "PostPartumAnswer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostPartumAnswer_postPartumRecordId_postPartumQuestionId_key" ON "PostPartumAnswer"("postPartumRecordId", "postPartumQuestionId");

-- AddForeignKey
ALTER TABLE "PostPartumRecord" ADD CONSTRAINT "PostPartumRecord_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Mother"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPartumRecord" ADD CONSTRAINT "PostPartumRecord_dayPostPartumId_fkey" FOREIGN KEY ("dayPostPartumId") REFERENCES "DayPostPartum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPartumAnswer" ADD CONSTRAINT "PostPartumAnswer_postPartumRecordId_fkey" FOREIGN KEY ("postPartumRecordId") REFERENCES "PostPartumRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPartumAnswer" ADD CONSTRAINT "PostPartumAnswer_postPartumQuestionId_fkey" FOREIGN KEY ("postPartumQuestionId") REFERENCES "PostPartumQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
