"use server";

import { prisma } from "../db/prisma-helper";
import { endClientSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

// 🔐 RBAC
async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/end-client";

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }
}

// GET
export async function getEndClients() {
  await checkPermission("view");

  return await prisma.endClient.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// CREATE
export async function createEndClient(data: any) {
  try {
    await checkPermission("create");

    const validated = endClientSchema.parse(data);

    await prisma.endClient.create({ data: validated });

    return { success: true, message: "Created successfully" };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}

// GET BY ID
export async function getEndClientById(id: string) {
  try {
    await checkPermission("view");

    const data = await prisma.endClient.findFirst({ where: { id } });

    if (!data) return { success: false };

    return { success: true, data };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}

// UPDATE
export async function updateEndClient(data: any, id: string) {
  try {
    await checkPermission("edit");

    const validated = endClientSchema.parse(data);

    await prisma.endClient.update({
      where: { id },
      data: validated,
    });

    return { success: true };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}

// DELETE
export async function deleteEndClient(id: string) {
  try {
    await checkPermission("delete");

    await prisma.endClient.delete({ where: { id } });

    return { success: true };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
}