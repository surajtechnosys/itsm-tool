"use server";

import { prisma } from "../db/prisma-helper";
import { formatError } from "../utils";

export async function sendDeviceToRepair(data: {
  deviceId: string;
  vendor: string;
  cost: number;
  notes?: string;
  repairDate?: string;
}) {
  try {

    await prisma.$transaction(async (tx) => {

      await tx.deviceRepair.create({
        data: {
          deviceId: data.deviceId,
          vendor: data.vendor,
          cost: data.cost,
          notes: data.notes,
          repairDate: data.repairDate ? new Date(data.repairDate) : new Date(),
        }
      })

      await tx.device.update({
        where: { id: data.deviceId },
        data: {
          deviceState: "REPAIR"
        }
      })

      await tx.deviceHistory.create({
        data: {
          deviceId: data.deviceId,
          actionType: "REPAIR_SENT",
          notes: `Device sent to repair at ${data.vendor}`
        }
      })

    })

    return {
      success: true,
      message: "Device sent to repair"
    }

  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

export async function completeDeviceRepair(repairId: string, deviceId: string) {

  try {

    await prisma.$transaction(async (tx) => {

      await tx.deviceRepair.update({
        where: { id: repairId },
        data: {
          status: "COMPLETED",
          completedAt: new Date()
        }
      });

      await tx.device.update({
        where: { id: deviceId },
        data: {
          deviceState: "AVAILABLE"
        }
      });

      await tx.deviceHistory.create({
        data: {
          deviceId,
          actionType: "REPAIR_COMPLETED",
          notes: "Device repair completed"
        }
      });

    });

    return {
      success: true,
      message: "Repair completed successfully"
    };

  } catch (error) {
    return {
      success: false,
      message: "Repair completion failed"
    };
  }
}