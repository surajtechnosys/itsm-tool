-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "warrantyDuration" INTEGER,
ADD COLUMN     "warrantyEndDate" TIMESTAMP(3),
ADD COLUMN     "warrantyProvider" TEXT,
ADD COLUMN     "warrantyStartDate" TIMESTAMP(3),
ADD COLUMN     "warrantyType" TEXT;
