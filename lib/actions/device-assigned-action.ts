"use server";

import { prisma } from "../db/prisma-helper";
import { deviceAssignedSchema } from "../validators";
import { formatError } from "../utils";
import { DeviceAssigned } from "@/types";
import { createNotification } from "@/lib/actions/notification-action";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-assigned";

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}



// get device categories
export async function getAssignedDevices() {
  await checkPermission("view");
  return await prisma.deviceAssigned.findMany({
    where: {
      status: "ASSIGNED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// create device category
export async function createAssignedDevice(data: DeviceAssigned) {
  try {
    await checkPermission("create");
    const deviceAssigned = deviceAssignedSchema.parse(data);

    // ✅ FETCH DATA BEFORE TRANSACTION
    const device = await prisma.device.findUnique({
      where: { id: deviceAssigned.deviceId },
    });

    const employee = await prisma.employee.findUnique({
      where: { id: deviceAssigned.employeeId },
    });

    if (!device) {
      throw new Error("Device not found");
    }

    if (device.deviceState !== "AVAILABLE") {
      throw new Error("Device is not available for assignment");
    }

    // ✅ TRANSACTION (DB ONLY)
    await prisma.$transaction(async (tx) => {
      await tx.deviceAssigned.create({
        data: {
          deviceId: deviceAssigned.deviceId,
          employeeId: deviceAssigned.employeeId,
          remarks: deviceAssigned.remarks,
          status: "ASSIGNED",
          assignedDate: deviceAssigned.assignedDate,
        },
      });

      await tx.device.update({
        where: { id: deviceAssigned.deviceId },
        data: {
          deviceState: "ASSIGNED",
        },
      });

      await tx.deviceHistory.create({
        data: {
          deviceId: deviceAssigned.deviceId,
          employeeId: deviceAssigned.employeeId,
          actionType: "ASSIGNED",
          notes: `Device assigned to ${
            employee
              ? `${employee.first_name} ${employee.last_name}`
              : "employee"
          }`,
        },
      });
    });

    await createNotification({
      title: "Device Assigned",
      message: `${device.name} assigned to ${
        employee ? `${employee.first_name} ${employee.last_name}` : "employee"
      }`,
      type: "DEVICE_ASSIGN",
      deviceId: deviceAssigned.deviceId,
    });

    return {
      success: true,
      message: "Device assigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get device category by id
export async function getDeviceAssignedById(id: string) {
  try {
    await checkPermission("edit"); // ✅ already fixed

    const deviceAssigned = await prisma.deviceAssigned.findUnique({
      where: { id },
    });

    if (!deviceAssigned) {
      return {
        success: false,
        message: "Device Assigned not found",
      };
    }

    return {
      success: true,
      data: deviceAssigned,
      message: "Device Assigned fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update category device
export async function updateAssingedDevice(data: DeviceAssigned, id: string) {
  try {
    await checkPermission("edit");
    const deviceAssigned = deviceAssignedSchema.parse(data);

    await prisma.deviceAssigned.update({
      where: { id },
      data: {
        deviceId: deviceAssigned.deviceId,
        employeeId: deviceAssigned.employeeId,
        remarks: deviceAssigned.remarks,
        status: "ASSIGNED",
        assignedDate: deviceAssigned.assignedDate,
        returnedDate: deviceAssigned.returnedDate,
      },
    });

    return {
      success: true,
      message: "Device Assigned updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// delete category device
export async function deleteDeviceAssigned(id: string) {
  try {
    await checkPermission("delete");
    const assignment = await prisma.deviceAssigned.findUnique({
      where: { id },
    });

    if (assignment?.status === "RETURNED") {
      throw new Error("Cannot delete a returned assignment");
    }

    await prisma.$transaction(async (tx) => {
      await tx.deviceAssigned.delete({
        where: { id },
      });

      if (assignment) {
        await tx.device.update({
          where: { id: assignment.deviceId },
          data: { deviceState: "AVAILABLE" },
        });
      }
    });

    return {
      success: true,
      message: "Device assigned deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function returnDeviceAction({
  assignedId,
  deviceId,
  damage,
  remarks,
}: any) {
  await checkPermission("edit");
  const assignment = await prisma.deviceAssigned.findUnique({
    where: { id: assignedId },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.status === "RETURNED") {
    throw new Error("Device already returned");
  }

  if (assignment.deviceId !== deviceId) {
    throw new Error("Assignment does not match device");
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  await prisma.$transaction(async (tx) => {
    await tx.deviceAssigned.update({
      where: { id: assignedId },
      data: {
        status: "RETURNED",
        returnedDate: new Date(),
        damage: damage || "NO",
        remarks: remarks || null,
      },
    });

    await tx.device.update({
      where: { id: deviceId },
      data: {
        deviceState: "AVAILABLE",
      },
    });

    await tx.deviceHistory.create({
      data: {
        deviceId,
        actionType: "RETURNED",
        notes:
          damage === "YES"
            ? `Returned with damage: ${remarks || "No remarks"}`
            : `Returned safely. ${remarks || ""}`,
      },
    });
  });

  await createNotification({
    title: "Device Returned",
    message:
      damage === "YES"
        ? `${device?.name || "Device"} returned with damage`
        : `${device?.name || "Device"} returned successfully`,
    type: "DEVICE_RETURN",
    deviceId: deviceId,
  });

  return { success: true };
}
