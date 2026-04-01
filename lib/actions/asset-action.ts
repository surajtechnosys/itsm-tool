"use server";

import { AssetType } from "@/types";
import { prisma } from "../db/prisma-helper";
import { assetSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// ✅ GET ALL ASSETS
export async function getAsset(): Promise<AssetType[]> {
  const assets = await prisma.asset.findMany({
    include: {
      accessories: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return assets as unknown as AssetType[];
}

// ✅ CREATE ASSET
export async function createAsset(data: AssetType) {
  
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/asset", "create")) {
    throw new Error("No permission");
  }

  try {
    const assetData = assetSchema.parse(data);

    await prisma.asset.create({
      data: {
        name: assetData.name,
        assetTypeId: assetData.assetTypeId, 
        serialNumber: assetData.serialNumber,
        brand: assetData.brand,
        model: assetData.model,
        configuration: assetData.configuration,
        purchaseDate: assetData.purchaseDate,
        purchaseValue: assetData.purchaseValue,
        invoiceNumber: assetData.invoiceNumber,
        vendor: assetData.vendor,
        condition: assetData.condition,
        hasWarranty: assetData.hasWarranty,
        remarks: assetData.remarks,
        warrantyStartDate: assetData.warrantyStartDate,
        warrantyEndDate: assetData.warrantyEndDate,
        warrantyDuration: assetData.warrantyDuration,
        warrantyProvider: assetData.warrantyProvider,
        warrantyType: assetData.warrantyType,

        // ✅ ACCESSORIES
        accessories: {
          create:
            assetData.accessories?.map((a) => ({
              type: a.type,
              make: a.make,
              model: a.model,
              serialNo: a.serialNo,
              condition: a.condition,
            })) || [],
        },
      },
    });

    return {
      success: true,
      message: "Asset created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getAssetById(
  id: string,
): Promise<{ success: boolean; data?: AssetType; message: string }> {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        accessories: true,
      },
    });

    if (!asset) {
      return { success: false, message: "Asset not found" };
    }

    return {
      success: true,
      data: asset as unknown as AssetType,
      message: "Asset fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE ASSET
export async function updateAsset(data: AssetType, id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/asset", "edit")) {
    throw new Error("No permission");
  }

  try {
    const asset = assetSchema.parse(data);

    await prisma.asset.update({
      where: { id },
      data: {
        name: asset.name,
        assetTypeId: asset.assetTypeId,
        serialNumber: asset.serialNumber,
        brand: asset.brand,
        model: asset.model,
        configuration: asset.configuration,
        purchaseDate: asset.purchaseDate,
        purchaseValue: asset.purchaseValue,
        invoiceNumber: asset.invoiceNumber,
        vendor: asset.vendor,
        condition: asset.condition,
        hasWarranty: asset.hasWarranty,
        remarks: asset.remarks,

        // ✅ RESET + RECREATE ACCESSORIES
        accessories: {
          deleteMany: {},
          create:
            asset.accessories?.map((a) => ({
              type: a.type,
              make: a.make,
              model: a.model,
              serialNo: a.serialNo,
              condition: a.condition,
            })) || [],
        },
      },
    });

    return {
      success: true,
      message: "Asset updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE ASSET
export async function deleteAsset(id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/asset", "delete")) {
    throw new Error("No permission");
  }

  try {
    await prisma.asset.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Asset deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
