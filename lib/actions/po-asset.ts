"use server";

import { prisma } from "../db/prisma-helper";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import { formatError } from "../utils";

import { z } from "zod";
import { poAssetSchema } from "../validators";
// import { poAsset } from "@prisma/client";
import { POAsset } from "@/types";


/* ================= GET ALL ================= */
export async function getPOAssets() {
  const data = await prisma.POAsset.findMany({
    include: {
      endClient: true,
      purchaseOrder: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}


/* ================= CREATE ================= */
export async function createPOAsset(data: any) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/po-asset", "create")) {
    throw new Error("No permission");
  }

  try {
    const asset = poAssetSchema.parse(data);

    await prisma.pOAsset.create({
      data: {
        endClientId: asset.endClientId,
        purchaseOrderId: asset.purchaseOrderId,

        make: asset.make,
        model: asset.model,
        serialNumber: asset.serialNumber,

        startDate: new Date(asset.startDate),
        endDate: new Date(asset.endDate),

        sla: asset.sla,

        pincode: asset.pincode,
        city: asset.city,
        state: asset.state,
        address: asset.address,
      },
    });

    return {
      success: true,
      message: "PO Asset created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


/* ================= GET BY ID ================= */
export async function getPOAssetById(id: string) {
  try {
    const data = await prisma.pOAsset.findUnique({
      where: { id },
      include: {
        endClient: true,
        purchaseOrder: true,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "PO Asset not found",
      };
    }

    return {
      success: true,
      data,
      message: "PO Asset fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


/* ================= UPDATE ================= */
export async function updatePOAsset(data: any, id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/po-asset", "edit")) {
    throw new Error("No permission");
  }

  try {
    const asset = poAssetSchema.parse(data);

    await prisma.pOAsset.update({
      where: { id },
      data: {
        endClientId: asset.endClientId,
        purchaseOrderId: asset.purchaseOrderId,

        make: asset.make,
        model: asset.model,
        serialNumber: asset.serialNumber,

        startDate: new Date(asset.startDate),
        endDate: new Date(asset.endDate),

        sla: asset.sla,

        pincode: asset.pincode,
        city: asset.city,
        state: asset.state,
        address: asset.address,
      },
    });

    return {
      success: true,
      message: "PO Asset updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


/* ================= DELETE ================= */
export async function deletePOAsset(id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/po-asset", "delete")) {
    throw new Error("No permission");
  }

  try {
    await prisma.pOAsset.delete({
      where: { id },
    });

    return {
      success: true,
      message: "PO Asset deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}