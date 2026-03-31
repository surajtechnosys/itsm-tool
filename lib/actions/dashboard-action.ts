"use server";

import { prisma } from "../db/prisma-helper";

export async function getDashboardStats() {
  try {
    const [
      totalDevices,
      assignedDevices,
      availableDevices,
      totalLocations,
      totalCategories,
      expiredDevices,
      totalPurchaseCost,
      totalEmployees,
    ] = await Promise.all([
      prisma.device.count(),

      prisma.device.count({
        where: { deviceState: "ASSIGNED" },
      }),

      prisma.device.count({
        where: { deviceState: "AVAILABLE" },
      }),

      prisma.location.count(),
      prisma.deviceCategory.count(),

      prisma.device.count({
        where: {
          warrantyEnd: {
            lt: new Date(),
          },
        },
      }),

      prisma.purchaseOrder.aggregate({
        where: {
          status: {
            in: ["APPROVED", "RECEIVED"],
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      prisma.employee.count(),
    ]);

    return {
      totalDevices,
      assignedDevices,
      availableDevices,
      totalLocations,
      totalCategories,
      expiredDevices,
      totalEmployees,
      totalPurchaseCost: totalPurchaseCost._sum.totalAmount || 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch dashboard stats");
  }
}
