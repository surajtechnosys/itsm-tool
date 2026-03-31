-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "designationId" UUID;

-- CreateTable
CREATE TABLE "Designation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "designation_name_idx" ON "Designation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "designation_code_idx" ON "Designation"("code");

-- CreateIndex
CREATE INDEX "Designation_status_idx" ON "Designation"("status");

-- CreateIndex
CREATE INDEX "Designation_code_idx" ON "Designation"("code");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
