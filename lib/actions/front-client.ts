"use server";

import { FrontClient } from "@/types";
import { prisma } from "../db/prisma-helper";
import { formatError } from "../utils";
import { frontClientSchema } from "../validators";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// ✅ RBAC CHECK
async function checkPermission(
  action: "view" | "create" | "edit" | "delete"
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/front-client"; // 🔥 IMPORTANT

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }

  return user;
}

// ✅ GET
export async function getFrontClients() {
  await checkPermission("view");

  return await prisma.frontClient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ✅ CREATE
export async function createFrontClient(data: FrontClient) {
  try {
    await checkPermission("create");

    const validated = frontClientSchema.parse(data);

    await prisma.frontClient.create({
      data: validated as any,
    });

    return {
      success: true,
      message: "Front Client created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ GET BY ID
export async function getFrontClientById(id: string) {
  try {
    await checkPermission("view");

    const client = await prisma.frontClient.findFirst({
      where: { id },
    });

    if (client) {
      return {
        success: true,
        data: client,
      };
    }

    return { success: false, message: "Not found" };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ UPDATE
export async function updateFrontClient(data: FrontClient, id: string) {
  try {
    await checkPermission("edit");

    const validated = frontClientSchema.parse(data);

    await prisma.frontClient.update({
      where: { id },
      data: validated as any,
    });

    return {
      success: true,
      message: "Updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// ✅ DELETE
export async function deleteFrontClient(id: string) {
  try {
    await checkPermission("delete");

    await prisma.frontClient.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}