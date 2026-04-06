"use server";

import { prisma } from "../db/prisma-helper";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import { formatError } from "../utils";

import { PurchaseOrder } from "@/types";
import { purchaseOrderSchema } from "../validators";


export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const data = await prisma.purchaseOrder.findMany({
    include: {
      endClient: true,
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data as unknown as PurchaseOrder[];
}


export async function createPurchaseOrder(data: PurchaseOrder) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/purchase-order", "create")) {
    throw new Error("No permission");
  }

  try {
    const po = purchaseOrderSchema.parse(data);

    await prisma.purchaseOrder.create({
      data: {
        endClientId: po.endClientId,
        poNumber: po.poNumber,

        contactName: po.contactName,
        contactNumber: po.contactNumber,
        contactEmail: po.contactEmail,

        startDate: new Date(po.startDate),
        endDate: new Date(po.endDate),
        poReceiveDate: new Date(po.poReceiveDate),

        employeeId: po.employeeId,
        poType: po.poType,

        status: po.status,
        poValue: Number(po.poValue),
      },
    });

    return {
      success: true,
      message: "Purchase Order created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


export async function getPurchaseOrderById(
  id: string,
): Promise<{ success: boolean; data?: PurchaseOrder; message: string }> {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        endClient: true,
        employee: true,
      },
    });

    if (!po) {
      return { success: false, message: "Purchase Order not found" };
    }

    return {
      success: true,
      data: po as unknown as PurchaseOrder,
      message: "Purchase Order fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


export async function updatePurchaseOrder(data: PurchaseOrder, id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/purchase-order", "edit")) {
    throw new Error("No permission");
  }

  try {
    const po = purchaseOrderSchema.parse(data);

    await prisma.purchaseOrder.update({
      where: { id },
      data: {
        endClientId: po.endClientId,
        poNumber: po.poNumber,

        contactName: po.contactName,
        contactNumber: po.contactNumber,
        contactEmail: po.contactEmail,

        startDate: new Date(po.startDate),
        endDate: new Date(po.endDate),
        poReceiveDate: new Date(po.poReceiveDate),

        employeeId: po.employeeId,
        poType: po.poType,

        status: po.status,
        poValue: Number(po.poValue),
      },
    });

    return {
      success: true,
      message: "Purchase Order updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}


export async function deletePurchaseOrder(id: string) {
  const session = await auth();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/purchase-order", "delete")) {
    throw new Error("No permission");
  }

  try {
    await prisma.purchaseOrder.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Purchase Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}