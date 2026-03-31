"use server";

import { prisma } from "../db/prisma-helper";
import { employeeSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import { z } from "zod";

type ActionResponse = {
  success: boolean;
  message: string;
};

/* ---------------- MAP EMPLOYEE ---------------- */
function mapEmployee(e: any) {
  return {
    id: e.id,
    first_name: e.first_name ?? "",
    last_name: e.last_name ?? "",
    email: e.email ?? "",
    phoneNumber: e.phoneNumber ?? "",
    hireDate: e.hireDate ?? null,
    departmentId: e.departmentId ?? "",
    designationId: e.designationId ?? "",
    status: e.status ?? "ACTIVE",
    department: e.department ?? null,
    designation: e.designation ?? null,
    createdAt: e.createdAt?.toISOString(),
    updatedAt: e.updatedAt?.toISOString(),
  };
}

/* ---------------- GET ---------------- */
export async function getEmployee() {
  const data = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: true,
      designation: true,
    },
  });

  return data.map(mapEmployee);
}

/* ---------------- CREATE ---------------- */
export async function createEmployee(
  data: z.infer<typeof employeeSchema>,
): Promise<ActionResponse> {
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
        designationId: emp.designationId || null,

        status: emp.status,
      },
    });

    return {
      success: true,
      message: "Employee created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- GET BY ID ---------------- */
export async function getEmployeeById(id: string) {
  try {
    const data = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        designation: true,
      },
    });

    if (!data) {
      return {
        success: false,
        message: "Employee not found",
      };
    }

    return {
      success: true,
      data: mapEmployee(data),
      message: "Employee fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- UPDATE ---------------- */
export async function updateEmployee(
  data: z.infer<typeof employeeSchema>,
  id: string,
): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
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

        // ✅ FIXED
        designationId: emp.designationId || null,

        // ✅ FIXED ENUM
        status: emp.status,
      },
    });

    return {
      success: true,
      message: "Employee updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteEmployee(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await getUserPermissions(session.user.email);

    if (!canAccess(user, "/admin/employee", "delete")) {
      return { success: false, message: "No permission" };
    }

    await prisma.employee.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Employee deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
