-- CreateTable
CREATE TABLE "POAsset" (
    "id" TEXT NOT NULL,
    "endClientId" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "sla" TEXT,
    "pincode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "POAsset" ADD CONSTRAINT "POAsset_endClientId_fkey" FOREIGN KEY ("endClientId") REFERENCES "EndClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POAsset" ADD CONSTRAINT "POAsset_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
