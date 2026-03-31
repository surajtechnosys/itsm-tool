"use server";

import { prisma } from "../db/prisma-helper";
import { designationSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

/* GET */
export async function getDesignation() {
  return prisma.designation.findMany({
    orderBy: { createdAt: "desc" },
  });
}


/* CREATE */


export async function createDesignation(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/designation", "create")) {
      return { success: false, message: "No permission" };
    }

    const d = designationSchema.parse(data);

    await prisma.designation.create({
      data: {
        name: d.name,
        code: d.code,
        level: d.level,
        description: d.description,
        status: d.status,
      },
    });

    return { success: true, message: "Created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* GET BY ID */
export async function getDesignationById(id: string) {
  const data = await prisma.designation.findUnique({ where: { id } });

  if (!data) return { success: false, message: "Not found" };

  return { success: true, data };
}

/* UPDATE */
export async function updateDesignation(data: any, id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/designation", "edit")) {
      return { success: false, message: "No permission" };
    }

    const d = designationSchema.parse(data);

    await prisma.designation.update({
      where: { id },
      data: {
        name: d.name,
        code: d.code,
        level: d.level,
        description: d.description,
        status: d.status,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* DELETE */
export async function deleteDesignation(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/designation", "delete")) {
      return { success: false, message: "No permission" };
    }

    await prisma.designation.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}