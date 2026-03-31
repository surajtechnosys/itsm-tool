"use server";

import { Employee } from "@/types";
import { prisma } from "../db/prisma-helper";
import { employeeSchema } from "../validators";
import { formatError } from "../utils";

/* ---------------- GET ALL ---------------- */

export async function getEmployee() {
  return prisma.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/* ---------------- CREATE ---------------- */

export async function createEmployee(data: Employee) {
  try {
    const employee = employeeSchema.parse(data);

    await prisma.employee.create({
      data: {
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        dateOfBirth: employee.dateOfBirth,
        hireDate: employee.hireDate,
        salary: employee.salary,
        departmentId: employee.departmentId,
        locationId: employee.locationId,
        status: employee.status,
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
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return {
        success: false,
        message: "Employee not found",
      };
    }

    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/* ---------------- UPDATE ---------------- */

export async function updateEmployee(data: Employee, id: string) {
  try {
    const employee = employeeSchema.parse(data);

    await prisma.employee.update({
      where: { id },
      data: {
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        dateOfBirth: employee.dateOfBirth,
        hireDate: employee.hireDate,
        salary: employee.salary,
        departmentId: employee.departmentId,
        locationId: employee.locationId,
        status: employee.status,
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

export async function deleteEmployee(id: string) {
  try {
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
