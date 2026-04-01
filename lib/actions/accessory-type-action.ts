"use server";

import { AccessoryType } from "@/types";
import { prisma } from "../db/prisma-helper";
import { accessoryTypeSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// ✅ COMMON PERMISSION CHECK (UNCHANGED STRUCTURE)
async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/accessory-type"; // ✅ UPDATED (MUST MATCH DB + RBAC)

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET
// ✅ GET ALL ACCESSORY TYPES
export async function getAccessoryType() {
  await checkPermission("view");

  return await prisma.accessoryType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE
export async function createAccessoryType(data: AccessoryType) {
  try {
    await checkPermission("create");

    const accessoryType = accessoryTypeSchema.parse(data);

    await prisma.accessoryType.create({
      data: {
        name: accessoryType.name,
        description: accessoryType.description,
        status: accessoryType.status,
      },
    });

    return {
      success: true,
      message: "Accessory Type created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getAccessoryTypeById(id: string) {
  try {
    await checkPermission("view");

    const accessoryType = await prisma.accessoryType.findFirst({
      where: { id },
    });

    if (accessoryType) {
      return {
        success: true,
        data: accessoryType,
        message: "Accessory Type fetched successfully",
      };
    }

    return {
      success: false,
      message: "Accessory Type not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateAccessoryType(data: AccessoryType, id: string) {
  try {
    await checkPermission("edit");

    const accessoryType = accessoryTypeSchema.parse(data);

    await prisma.accessoryType.update({
      where: { id },
      data: {
        name: accessoryType.name,
        description: accessoryType.description,
        status: accessoryType.status,
      },
    });

    return {
      success: true,
      message: "Accessory Type updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteAccessoryType(id: string) {
  try {
    await checkPermission("delete");

    await prisma.accessoryType.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Accessory Type deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
