/*
  Warnings:

  - The values [ADMIN] on the enum `AdminType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expiredAt` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminType_new" AS ENUM ('SUPER_ADMIN', 'KADER');
ALTER TABLE "Admin" ALTER COLUMN "type" TYPE "AdminType_new" USING ("type"::text::"AdminType_new");
ALTER TYPE "AdminType" RENAME TO "AdminType_old";
ALTER TYPE "AdminType_new" RENAME TO "AdminType";
DROP TYPE "AdminType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "expiredAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "placeOfBirth" DROP NOT NULL;
