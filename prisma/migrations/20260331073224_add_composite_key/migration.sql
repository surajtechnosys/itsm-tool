/*
  Warnings:

  - A unique constraint covering the columns `[roleId,moduleId]` on the table `RoleModule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoleModule_roleId_moduleId_key" ON "RoleModule"("roleId", "moduleId");
