"use server";

import { prisma } from "../db/prisma-helper";
import { assignedAssetSchema } from "../validators";
import { formatError } from "../utils";
import { AssignedAsset } from "@/types";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/assigned-asset";

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET ASSIGNED ASSETS
export async function getAssignedAssets() {
  await checkPermission("view");

  return await prisma.AssignedAsset.findMany({
    where: {
      status: "ASSIGNED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE ASSIGNED ASSET
export async function createAssignedAsset(data: AssignedAsset) {
  try {
    await checkPermission("create");

    const assignedAsset = assignedAssetSchema.parse(data);

    const asset = await prisma.asset.findUnique({
      where: { id: assignedAsset.assetId },
    });

    const employee = await prisma.employee.findUnique({
      where: { id: assignedAsset.employeeId },
    });

    if (!asset) {
      throw new Error("Asset not found");
    }

    if (asset.assetState !== "AVAILABLE") {
      throw new Error("Asset is not available for assignment");
    }

    await prisma.$transaction(async (tx) => {
      await tx.assignedAsset.create({
        data: {
          assetId: assignedAsset.assetId,
          employeeId: assignedAsset.employeeId,
          remarks: assignedAsset.remarks,
          status: "ASSIGNED",
          assignedDate: assignedAsset.assignedDate,
        },
      });

      await tx.asset.update({
        where: { id: assignedAsset.assetId },
        data: {
          assetState: "ASSIGNED",
        },
      });
    });

    return {
      success: true,
      message: "Asset assigned successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getAssignedAssetById(id: string) {
  try {
    await checkPermission("edit");

    const assignedAsset = await prisma.assignedAsset.findUnique({
      where: { id },
    });

    if (!assignedAsset) {
      return {
        success: false,
        message: "Assigned Asset not found",
      };
    }

    return {
      success: true,
      data: assignedAsset,
      message: "Assigned Asset fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateAssignedAsset(data: AssignedAsset, id: string) {
  try {
    await checkPermission("edit");

    const assignedAsset = assignedAssetSchema.parse(data);

    await prisma.assignedAsset.update({
      where: { id },
      data: {
        assetId: assignedAsset.assetId,
        employeeId: assignedAsset.employeeId,
        remarks: assignedAsset.remarks,
        status: assignedAsset.status,
        assignedDate: assignedAsset.assignedDate,
        returnedDate: assignedAsset.returnedDate,
      },
    });

    return {
      success: true,
      message: "Assigned Asset updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteAssignedAsset(id: string) {
  try {
    await checkPermission("delete");

    const assignment = await prisma.assignedAsset.findUnique({
      where: { id },
    });

    if (assignment?.status === "RETURNED") {
      throw new Error("Cannot delete a returned assignment");
    }

    await prisma.$transaction(async (tx) => {
      await tx.assignedAsset.delete({
        where: { id },
      });

      if (assignment) {
        await tx.asset.update({
          where: { id: assignment.assetId },
          data: { assetState: "AVAILABLE" },
        });
      }
    });

    return {
      success: true,
      message: "Assigned asset deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ RETURN ASSET (same logic, no history/notification)
export async function returnAssetAction({
  assignedId,
  assetId,
  damage,
  remarks,
}: any) {
  await checkPermission("edit");

  const assignment = await prisma.assignedAsset.findUnique({
    where: { id: assignedId },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  if (assignment.status === "RETURNED") {
    throw new Error("Asset already returned");
  }

  if (assignment.assetId !== assetId) {
    throw new Error("Assignment does not match asset");
  }

  await prisma.$transaction(async (tx) => {
    await tx.assignedAsset.update({
      where: { id: assignedId },
      data: {
        status: "RETURNED",
        returnedDate: new Date(),
        damage: damage || "NO",
        remarks: remarks || null,
      },
    });

    await tx.asset.update({
      where: { id: assetId },
      data: {
        assetState: "AVAILABLE",
      },
    });
  });

  return { success: true };
}
