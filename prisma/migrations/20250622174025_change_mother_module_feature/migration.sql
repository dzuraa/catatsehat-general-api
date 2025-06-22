/*
  Warnings:

  - You are about to drop the `BloodStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BloodSupplement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostPartumAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PregnancyMonitoringAnswer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question1` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question10` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question11` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question12` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question13` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question14` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question15` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question16` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question17` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question18` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question2` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question3` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question4` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question5` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question6` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question7` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question8` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question9` to the `PostPartumRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `PostPartumRecord` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `question1` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question10` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question11` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question12` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question13` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question2` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question3` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question4` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question5` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question6` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question7` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question8` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question9` to the `PregnancyMonitoringRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `PregnancyMonitoringRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BloodStep" DROP CONSTRAINT "BloodStep_bloodSupplementId_fkey";

-- DropForeignKey
ALTER TABLE "BloodStep" DROP CONSTRAINT "BloodStep_motherId_fkey";

-- DropForeignKey
ALTER TABLE "BloodSupplement" DROP CONSTRAINT "BloodSupplement_adminId_fkey";

-- DropForeignKey
ALTER TABLE "BloodSupplement" DROP CONSTRAINT "BloodSupplement_monthId_fkey";

-- DropForeignKey
ALTER TABLE "BloodSupplement" DROP CONSTRAINT "BloodSupplement_motherId_fkey";

-- DropForeignKey
ALTER TABLE "PostPartumAnswer" DROP CONSTRAINT "PostPartumAnswer_postPartumQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "PostPartumAnswer" DROP CONSTRAINT "PostPartumAnswer_postPartumRecordId_fkey";

-- DropForeignKey
ALTER TABLE "PregnancyMonitoringAnswer" DROP CONSTRAINT "PregnancyMonitoringAnswer_pregnancyMonitoringQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "PregnancyMonitoringAnswer" DROP CONSTRAINT "PregnancyMonitoringAnswer_pregnancyMonitoringRecordId_fkey";

-- DropIndex
DROP INDEX "PostPartumRecord_motherId_dayPostPartumId_key";

-- DropIndex
DROP INDEX "PregnancyMonitoringRecord_motherId_weekPregnancyMonitoringI_key";

-- AlterTable
ALTER TABLE "PostPartumRecord" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "question1" BOOLEAN NOT NULL,
ADD COLUMN     "question10" BOOLEAN NOT NULL,
ADD COLUMN     "question11" BOOLEAN NOT NULL,
ADD COLUMN     "question12" BOOLEAN NOT NULL,
ADD COLUMN     "question13" BOOLEAN NOT NULL,
ADD COLUMN     "question14" BOOLEAN NOT NULL,
ADD COLUMN     "question15" BOOLEAN NOT NULL,
ADD COLUMN     "question16" BOOLEAN NOT NULL,
ADD COLUMN     "question17" BOOLEAN NOT NULL,
ADD COLUMN     "question18" BOOLEAN NOT NULL,
ADD COLUMN     "question2" BOOLEAN NOT NULL,
ADD COLUMN     "question3" BOOLEAN NOT NULL,
ADD COLUMN     "question4" BOOLEAN NOT NULL,
ADD COLUMN     "question5" BOOLEAN NOT NULL,
ADD COLUMN     "question6" BOOLEAN NOT NULL,
ADD COLUMN     "question7" BOOLEAN NOT NULL,
ADD COLUMN     "question8" BOOLEAN NOT NULL,
ADD COLUMN     "question9" BOOLEAN NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "PregnancyMonitoringRecord" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "question1" BOOLEAN NOT NULL,
ADD COLUMN     "question10" BOOLEAN NOT NULL,
ADD COLUMN     "question11" BOOLEAN NOT NULL,
ADD COLUMN     "question12" BOOLEAN NOT NULL,
ADD COLUMN     "question13" BOOLEAN NOT NULL,
ADD COLUMN     "question2" BOOLEAN NOT NULL,
ADD COLUMN     "question3" BOOLEAN NOT NULL,
ADD COLUMN     "question4" BOOLEAN NOT NULL,
ADD COLUMN     "question5" BOOLEAN NOT NULL,
ADD COLUMN     "question6" BOOLEAN NOT NULL,
ADD COLUMN     "question7" BOOLEAN NOT NULL,
ADD COLUMN     "question8" BOOLEAN NOT NULL,
ADD COLUMN     "question9" BOOLEAN NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- DropTable
DROP TABLE "BloodStep";

-- DropTable
DROP TABLE "BloodSupplement";

-- DropTable
DROP TABLE "PostPartumAnswer";

-- DropTable
DROP TABLE "PregnancyMonitoringAnswer";

-- DropEnum
DROP TYPE "StatusBlood";
