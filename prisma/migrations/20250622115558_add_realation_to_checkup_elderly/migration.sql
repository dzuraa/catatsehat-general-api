-- AlterTable
ALTER TABLE "CheckupElderly" ADD COLUMN     "fileDiagnosedId" TEXT;

-- AddForeignKey
ALTER TABLE "CheckupElderly" ADD CONSTRAINT "CheckupElderly_fileDiagnosedId_fkey" FOREIGN KEY ("fileDiagnosedId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
