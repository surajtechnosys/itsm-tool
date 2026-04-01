/*
  Warnings:

  - You are about to drop the column `type` on the `Accessory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accessory" DROP COLUMN "type",
ADD COLUMN     "accessoryTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "Accessory" ADD CONSTRAINT "Accessory_accessoryTypeId_fkey" FOREIGN KEY ("accessoryTypeId") REFERENCES "AccessoryType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
