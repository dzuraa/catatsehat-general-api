/*
  Warnings:

  - You are about to drop the column `filePictureId` on the `Article` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_filePictureId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "filePictureId",
ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
