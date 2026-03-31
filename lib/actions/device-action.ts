"use server";

import { Device } from "@/types";
import { prisma } from "../db/prisma-helper";
import { deviceCateorySchema, deviceSchema } from "../validators";
import { formatError } from "../utils";
import { createNotification } from "@/lib/actions/notification-action";
import { checkWarrantyExpiry } from "@/lib/cron/warranty-check";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// get device categories

export async function getDevice(): Promise<Device[]> {
  const devices = await prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return devices as unknown as Device[];
}

// create device
export async function createDevice(data: Device) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/device", "create")) {
    throw new Error("No permission");
  }

  try {
    const deviceData = deviceSchema.parse(data);

    const device = await prisma.$transaction(async (tx) => {
      const createdDevice = await tx.device.create({
        data: {
          name: deviceData.name,
          type: deviceData.type,
          serialNumber: deviceData.serialNumber,
          brand: deviceData.brand,
          model: deviceData.model,
          configuration: deviceData.configuration,
          purchaseDate: deviceData.purchaseDate,
          purchaseValue: deviceData.purchaseValue,
          invoiceNumber: deviceData.invoiceNumber,
          vendor: deviceData.vendor,
          condition: deviceData.condition,
          remarks: deviceData.remarks,
          status: deviceData.status || "ACTIVE",
        },
      });

      await tx.deviceHistory.create({
        data: {
          actionType: "CREATED",
          notes: "Device added to inventory",
          device: {
            connect: { id: createdDevice.id },
          },
        },
      });

      return createdDevice;
    });

    // ✅ AFTER transaction (correct place)

    await createNotification({
      title: "New Device Added",
      message: `${device.name} has been added`,
      type: "DEVICE_CREATE",
      deviceId: device.id,
    });

    // ✅ Warranty trigger
    await checkWarrantyExpiry();

    return {
      success: true,
      message: "Device created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get device  by id

export async function getDeviceById(
  id: string,
): Promise<{ success: boolean; data?: Device; message: string }> {
  try {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        category: true,
        histories: true,
      },
    });

    if (device) {
      return {
        success: true,
        data: device as unknown as Device,
        message: "Device fetched successfully",
      };
    }

    return {
      success: false,
      message: "Device not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update  device
export async function updateDevice(data: Device, id: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/device", "edit")) {
    throw new Error("No permission");
  }

  try {
    const device = deviceCateorySchema.parse(data);

    await prisma.$transaction(async (tx) => {
      await tx.device.update({
        where: { id },
        data: {
          name: device.name,
          type: device.type,
          serialNumber: device.serialNumber,
          brand: device.brand,
          model: device.model,
          configuration: device.configuration,
          purchaseDate: device.purchaseDate,
          purchaseValue: device.purchaseValue,
          invoiceNumber: device.invoiceNumber,
          vendor: device.vendor,
          condition: device.condition,
          remarks: device.remarks,
        },
      });

      await tx.device.update({
        where: { id },
        data: {
          name: device.name,
          description: device.description,
          status: device.status,
        },
      });

      await tx.deviceHistory.create({
        data: {
          actionType: "UPDATED",
          notes: "Device details updated",
          device: {
            connect: { id },
          },
        },
      });
    });

    return {
      success: true,
      message: "Device  updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// delete  device
export async function deleteDevice(id: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/device", "delete")) {
    throw new Error("No permission");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.deviceHistory.deleteMany({
        where: { deviceId: id },
      });

      await tx.deviceAssigned.deleteMany({
        where: { deviceId: id },
      });

      await tx.device.delete({
        where: { id },
      });
    });

    return {
      success: true,
      message: "Device deleted permanently",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function retireDevice(id: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/device", "delete")) {
    throw new Error("No permission");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.device.update({
        where: { id },
        data: {
          deviceState: "RETIRED",
        },
      });

      await tx.deviceHistory.create({
        data: {
          deviceId: id,
          actionType: "RETIRED",
          notes: "Device retired from system",
        },
      });
    });

    return {
      success: true,
      message: "Device retired successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
