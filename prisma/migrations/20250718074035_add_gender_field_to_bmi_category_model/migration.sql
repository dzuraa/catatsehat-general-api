/*
  Warnings:

  - Added the required column `gender` to the `BMICategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BMICategory" ADD COLUMN     "gender" "Gender" NOT NULL;
