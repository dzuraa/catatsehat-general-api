-- AlterTable
ALTER TABLE "BloodRecord" ADD COLUMN     "type" "OwnerType" NOT NULL DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "ImmunizationOptionalRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateGiven" INTEGER NOT NULL,
    "note" TEXT,
    "childrenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ImmunizationOptionalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImmunizationOptionalRecord_id_key" ON "ImmunizationOptionalRecord"("id");

-- AddForeignKey
ALTER TABLE "ImmunizationOptionalRecord" ADD CONSTRAINT "ImmunizationOptionalRecord_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Children"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
