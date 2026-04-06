/*
  Warnings:

  - The primary key for the `PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `requirementId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the `Procurement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quotation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employeeId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endClientId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poReceiveDate` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poType` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poValue` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `PurchaseOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_requirementId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_vendorId_fkey";

-- DropIndex
DROP INDEX "PurchaseOrder_poNumber_key";

-- DropIndex
DROP INDEX "PurchaseOrder_requirementId_idx";

-- DropIndex
DROP INDEX "PurchaseOrder_status_idx";

-- DropIndex
DROP INDEX "PurchaseOrder_vendorId_idx";

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey",
DROP COLUMN "requirementId",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
DROP COLUMN "vendorId",
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "endClientId" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "poReceiveDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "poType" TEXT NOT NULL,
ADD COLUMN     "poValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Procurement";

-- DropTable
DROP TABLE "PurchaseOrderItem";

-- DropTable
DROP TABLE "Quotation";

-- DropTable
DROP TABLE "Requirement";

-- DropTable
DROP TABLE "Vendor";

-- DropEnum
DROP TYPE "PurchaseOrderStatus";

-- DropEnum
DROP TYPE "QuotationStatus";

-- DropEnum
DROP TYPE "VendorStatus";

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_endClientId_fkey" FOREIGN KEY ("endClientId") REFERENCES "EndClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
