-- CreateTable
CREATE TABLE "BMICategory" (
    "id" TEXT NOT NULL,
    "minAge" DOUBLE PRECISION NOT NULL,
    "maxAge" DOUBLE PRECISION NOT NULL,
    "minBMI" DOUBLE PRECISION NOT NULL,
    "maxBMI" DOUBLE PRECISION NOT NULL,
    "status" "BMIStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BMICategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BMICategory_id_key" ON "BMICategory"("id");
