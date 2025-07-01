/*
  Warnings:

  - You are about to drop the column `value` on the `LungsConclution` table. All the data in the column will be lost.
  - Added the required column `from` to the `LungsConclution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `LungsConclution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LungsConclution" DROP COLUMN "value",
ADD COLUMN     "from" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "to" DOUBLE PRECISION NOT NULL;
