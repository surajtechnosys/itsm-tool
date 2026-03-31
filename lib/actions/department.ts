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
        code: dept.code,
        description: dept.description,
        status: dept.status,
      },
    });

    return { success: true, message: "Department created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* GET BY ID */
export async function getDepartmentById(id: string) {
  const data = await prisma.department.findUnique({ where: { id } });

  if (!data) {
    return { success: false, message: "Not found" };
  }

  return { success: true, data };
}

/* UPDATE */
export async function updateDepartment(data: any, id: string) {
  try {
    const dept = departmentSchema.parse(data);

    await prisma.department.update({
      where: { id },
      data: {
        name: dept.name,
        code: dept.code,
        description: dept.description,
        status: dept.status,
      },
    });

    return { success: true, message: "Department updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* DELETE */
export async function deleteDepartment(id: string) {
  try {
    await prisma.department.delete({ where: { id } });

    return { success: true, message: "Department deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
