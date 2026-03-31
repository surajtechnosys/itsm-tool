/*
  Warnings:

  - You are about to drop the column `locationId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_locationId_fkey";

-- DropIndex
DROP INDEX "Employee_locationId_idx";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "locationId",
DROP COLUMN "salary";
