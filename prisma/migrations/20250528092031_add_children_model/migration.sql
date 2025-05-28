-- CreateTable
CREATE TABLE "Children" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "childOrder" INTEGER NOT NULL,
    "bloodType" TEXT,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "code" TEXT,
    "userId" TEXT NOT NULL,
    "childPictureId" TEXT,
    "birthCertificateId" TEXT,
    "kiaCardId" TEXT,
    "familyCardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Children_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Children_id_key" ON "Children"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Children_code_key" ON "Children"("code");

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_childPictureId_fkey" FOREIGN KEY ("childPictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_birthCertificateId_fkey" FOREIGN KEY ("birthCertificateId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_kiaCardId_fkey" FOREIGN KEY ("kiaCardId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Children" ADD CONSTRAINT "Children_familyCardId_fkey" FOREIGN KEY ("familyCardId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
