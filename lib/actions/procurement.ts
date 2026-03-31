"use server";

import { Procurement } from "@/types";
import { prisma } from "../db/prisma-helper";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import { sendMail } from "../mail";
import { requirementEmailTemplate } from "../requirement-template";

async function checkPermission(action: "view" | "create" | "edit" | "delete") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/procurement";

  if (!canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }
}

export async function getProcurement(): Promise<Procurement[]> {
  await checkPermission("view");

  return (await prisma.procurement.findMany({
    orderBy: { createdAt: "desc" },
  })) as Procurement[];
}

export async function createProcurement(data: Procurement) {
  try {
    await checkPermission("create");

    const created = await prisma.procurement.create({
      data: {
        manufatured: data.manufatured,
        model: data.model,
        vendorId: data.vendorId,
        configuration: JSON.stringify(data.configuration),
        warranty: data.warranty,
        warrantyType: data.warrantyType,
        quotationValidity: data.quotationValidity,
        status: data.status,
        notes: data.notes,
        requirementId: data.requirementId,
      },
    });

    const html = requirementEmailTemplate({
      requirementId: created.id,
      vendorId: data.vendorId,
      vendorName: "Vendor", // or fetch from DB if needed
      model: data.model,
      manufatured: "",
      warranty: "",
      quotationValidity: "",
      configuration: [],
    });

    await sendMail({
      to: "example@mail.com",
      subject: "Procurement Request",
      html,
    });

    return {
      success: true,
      message: "Procurement created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getProcurementById(id: string) {
  try {
    await checkPermission("view");

    const procurement = await prisma.procurement.findFirst({
      where: { id },
    });

    if (procurement) {
      return {
        success: true,
        data: procurement,
      };
    }

    return {
      success: false,
      message: "Procurement not found",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateProcurement(data: Procurement, id: string) {
  try {
    await checkPermission("edit");

    await prisma.procurement.update({
      where: { id },
      data: {
        manufatured: data.manufatured,
        model: data.model,
        vendorId: data.vendorId,
        configuration: JSON.stringify(data.configuration),
        warranty: data.warranty,
        warrantyType: data.warrantyType,
        quotationValidity: data.quotationValidity,
        status: data.status,
        notes: data.notes,
        requirementId: data.requirementId,
      },
    });

    return {
      success: true,
      message: "Procurement updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deleteProcurement(id: string) {
  try {
    await checkPermission("delete");

    await prisma.procurement.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Procurement deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
