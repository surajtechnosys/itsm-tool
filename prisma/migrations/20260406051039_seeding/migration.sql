-- CreateTable
CREATE TABLE "EndClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "endClientId" TEXT NOT NULL,
    "frontClientId" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EndClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EndClient_endClientId_key" ON "EndClient"("endClientId");

-- AddForeignKey
ALTER TABLE "EndClient" ADD CONSTRAINT "EndClient_frontClientId_fkey" FOREIGN KEY ("frontClientId") REFERENCES "FrontClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
