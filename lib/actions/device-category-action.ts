"use server";

import { DeviceCategory } from "@/types";
import { prisma } from "../db/prisma-helper";
import { deviceCateorySchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// ✅ COMMON PERMISSION CHECK
async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-category"; // 🔥 MUST match DB

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET
export async function getDeviceCategory() {
  await checkPermission("view");

  return await prisma.deviceCategory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE
export async function createDeviceCategory(data: DeviceCategory) {
  try {
    await checkPermission("create");

    const deviceCategory = deviceCateorySchema.parse(data);

    await prisma.deviceCategory.create({
      data: {
        name: deviceCategory.name,
        description: deviceCategory.description,
        status: deviceCategory.status,
      },
    });

    return {
      success: true,
      message: "Device Category created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getDeviceCategoryById(id: string) {
  try {
    await checkPermission("view");

    const deviceCategory = await prisma.deviceCategory.findFirst({
      where: { id },
    });

    if (deviceCategory) {
      return {
        success: true,
        data: deviceCategory,
        message: "Device Category fetched successfully",
      };
    }

    return {
      success: false,
      message: "Device Category not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateCategoryDevice(data: DeviceCategory, id: string) {
  try {
    await checkPermission("edit");

    const deviceCategory = deviceCateorySchema.parse(data);

    await prisma.deviceCategory.update({
      where: { id },
      data: {
        name: deviceCategory.name,
        description: deviceCategory.description,
        status: deviceCategory.status,
      },
    });

    return {
      success: true,
      message: "Device Category updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteCategoryDevice(id: string) {
  try {
    await checkPermission("delete");

    await prisma.deviceCategory.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Device Category deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}