-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_healthPostId_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "healthPostId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_healthPostId_fkey" FOREIGN KEY ("healthPostId") REFERENCES "HealthPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
