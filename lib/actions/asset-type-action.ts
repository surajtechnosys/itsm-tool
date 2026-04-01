"use server";

import { AssetType } from "@/types";
import { prisma } from "../db/prisma-helper";
import { assetTypeSchema } from "../validators";
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

  const route = "/admin/asset-type"; // ✅ UPDATED (MUST MATCH DB + RBAC)

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET
export async function getAssetType() {
  await checkPermission("view");

  return await prisma.assetType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE
export async function createAssetType(data: AssetType) {
  try {
    await checkPermission("create");

    const assetType = assetTypeSchema.parse(data);

    await prisma.assetType.create({
      data: {
        name: assetType.name,
        description: assetType.description,
        status: assetType.status,
      },
    });

    return {
      success: true,
      message: "Asset Type created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getAssetTypeById(id: string) {
  try {
    await checkPermission("view");

    const assetType = await prisma.assetType.findFirst({
      where: { id },
    });

    if (assetType) {
      return {
        success: true,
        data: assetType,
        message: "Asset Type fetched successfully",
      };
    }

    return {
      success: false,
      message: "Asset Type not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateAssetType(data: AssetType, id: string) {
  try {
    await checkPermission("edit");

    const assetType = assetTypeSchema.parse(data);

    await prisma.assetType.update({
      where: { id },
      data: {
        name: assetType.name,
        description: assetType.description,
        status: assetType.status,
      },
    });

    return {
      success: true,
      message: "Asset Type updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteAssetType(id: string) {
  try {
    await checkPermission("delete");

    await prisma.assetType.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Asset Type deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}