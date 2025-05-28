/*
  Warnings:

  - You are about to drop the column `age` on the `Elderly` table. All the data in the column will be lost.
  - You are about to drop the column `childOrder` on the `Elderly` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Elderly" DROP COLUMN "age",
DROP COLUMN "childOrder";
