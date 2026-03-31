"use server";

import { Vendor } from "@/types";
import { prisma } from "../db/prisma-helper";
import { formatError } from "../utils";
import { vendorSchema } from "../validators";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// ✅ COMMON RBAC CHECK
async function checkPermission(
  action: "view" | "create" | "edit" | "delete"
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/vendor"; // 🔥 must match DB

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET
export async function getVendors() {
  await checkPermission("view");

  return await prisma.vendor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE
export async function createVendor(data: Vendor) {
  try {
    await checkPermission("create");

    const vendor = vendorSchema.parse(data);

    await prisma.vendor.create({
      data: vendor as any,
    });

    return {
      success: true,
      message: "Vendor created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getVendorById(id: string) {
  try {
    await checkPermission("view");

    const vendor = await prisma.vendor.findFirst({
      where: { id },
    });

    if (vendor) {
      return {
        success: true,
        data: vendor,
        message: "Vendor fetched successfully",
      };
    }

    return {
      success: false,
      message: "Vendor not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateVendor(data: Vendor, id: string) {
  try {
    await checkPermission("edit");

    const vendor = vendorSchema.parse(data);

    await prisma.vendor.update({
      where: { id },
      data: vendor as any,
    });

    return {
      success: true,
      message: "Vendor updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteVendor(id: string) {
  try {
    await checkPermission("delete");

    await prisma.vendor.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
