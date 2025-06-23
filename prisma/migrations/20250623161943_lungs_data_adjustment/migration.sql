/*
  Warnings:

  - You are about to drop the column `value` on the `Lungs` table. All the data in the column will be lost.
  - The `value` column on the `LungsPivot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lungs" DROP COLUMN "value",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LungsPivot" DROP COLUMN "value",
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 0;
