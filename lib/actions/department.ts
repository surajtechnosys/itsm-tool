"use server";

import { prisma } from "../db/prisma-helper";
import { departmentSchema } from "../validators";
import { formatError } from "../utils";

/* GET */
export async function getDepartment() {
  return prisma.department.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/* CREATE */
export async function createDepartment(data: any) {
  try {
    const dept = departmentSchema.parse(data);

    await prisma.department.create({
      data: {
        name: dept.name,
        description: dept.description,
        status: dept.status,
      },
    });

    return { success: true, message: "Created" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* GET BY ID */
export async function getDepartmentById(id: string) {
  const data = await prisma.department.findUnique({ where: { id } });

  if (!data) return { success: false };

  return { success: true, data };
}

/* UPDATE */
/* UPDATE */
export async function updateDepartment(data: any, id: string) {
  try {
    const dept = departmentSchema.parse(data);

    await prisma.department.update({
      where: { id },
      data: {
        name: dept.name,
        description: dept.description,
        status: dept.status,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* DELETE */
export async function deleteDepartment(id: string) {
  try {
    await prisma.department.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
