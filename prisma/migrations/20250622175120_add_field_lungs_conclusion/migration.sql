/*
  Warnings:

  - You are about to drop the column `conclution` on the `LungsConclution` table. All the data in the column will be lost.
  - Added the required column `conclusion` to the `LungsConclution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LungsConclution" DROP COLUMN "conclution",
ADD COLUMN     "conclusion" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;
