"use server";

import { prisma } from "../db/prisma-helper";
import { employeeSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

/* ---------------- GET ---------------- */
export async function getEmployee() {
  return prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: true,
      designation: true,
    },
  });
}

/* ---------------- CREATE ---------------- */
export async function createEmployee(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/employee", "create")) {
      return { success: false, message: "No permission" };
    }

    const emp = employeeSchema.parse(data);

    await prisma.employee.create({
      data: {
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        hireDate: emp.hireDate,
        departmentId: emp.departmentId,
        designationId: emp.designationId,
        locationId: emp.locationId,
        status: emp.status,
      },
    });

    return { success: true, message: "Employee created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* ---------------- GET BY ID ---------------- */
export async function getEmployeeById(id: string) {
  try {
    const data = await prisma.employee.findUnique({
      where: { id },
    });

    if (!data) {
      return { success: false, message: "Not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* ---------------- UPDATE ---------------- */
export async function updateEmployee(data: any, id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/employee", "edit")) {
      return { success: false, message: "No permission" };
    }

    const emp = employeeSchema.parse(data);

    await prisma.employee.update({
      where: { id },
      data: {
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        phoneNumber: emp.phoneNumber,
        hireDate: emp.hireDate,
        departmentId: emp.departmentId,
        designationId: emp.designationId,
        locationId: emp.locationId,
        status: emp.status,
      },
    });

    return { success: true, message: "Updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteEmployee(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/employee", "delete")) {
      return { success: false, message: "No permission" };
    }

    await prisma.employee.delete({ where: { id } });

    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
