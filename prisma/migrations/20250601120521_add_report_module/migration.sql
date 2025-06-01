-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporter" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childAddress" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "userId" TEXT NOT NULL,
    "fileChildPictureId" TEXT,
    "fileHousePictureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_fileChildPictureId_fkey" FOREIGN KEY ("fileChildPictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_fileHousePictureId_fkey" FOREIGN KEY ("fileHousePictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
