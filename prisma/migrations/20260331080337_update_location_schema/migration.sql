/*
  Warnings:

  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `streetAddress` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "postalCode",
DROP COLUMN "streetAddress",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "hasMultipleFloors" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pincode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "location_code_idx" ON "Location"("code");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_code_idx" ON "Location"("code");
