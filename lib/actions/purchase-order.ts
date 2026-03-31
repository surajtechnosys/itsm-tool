"use server";

import { prisma } from "@/lib/db/prisma-helper";
import { createPurchaseOrderSchema } from "@/lib/validators";
import { PurchaseOrderStatus } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getUserPermissions, canAccess } from "@/lib/rbac";

/* ---------------- RBAC CHECK ---------------- */

async function checkPermission(action: "view" | "create" | "edit") {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/purchase-order";

  const roleName = user?.role?.name || "";
  const isAdmin = roleName.toLowerCase().includes("admin");

  if (!isAdmin && !canAccess(user, route, action)) {
    throw new Error("Access Denied");
  }
}

/* ---------------- CREATE ---------------- */

export async function createPurchaseOrder(input: unknown) {
  await checkPermission("create");

  const data = createPurchaseOrderSchema.parse(input);

  const totalAmount = data.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      poNumber: `PO-${Date.now()}`,
      requirementId: data.requirementId,
      vendorId: data.vendorId,
      totalAmount,
      status: PurchaseOrderStatus.DRAFT,

      items: {
        create: data.items.map((item) => ({
          deviceCategoryId: item.deviceCategoryId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          totalPrice:
            Number(item.quantity) * Number(item.unitPrice),
        })),
      },
    },
  });

  revalidatePath("/admin/purchase-order");

  return {
    success: true,
    data: purchaseOrder,
    message: "Purchase Order created successfully",
  };
}

/* ---------------- UPDATE STATUS ---------------- */

export async function updatePurchaseOrderStatus(id: string) {
  await checkPermission("edit");

  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
  });

  if (!po) {
    throw new Error("Purchase Order not found");
  }

  if (po.status === PurchaseOrderStatus.DRAFT) {
    await prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.SENT },
    });
  } else if (po.status === PurchaseOrderStatus.SENT) {
    await prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.RECEIVED },
    });
  } else {
    throw new Error("Purchase Order cannot be modified further");
  }

  revalidatePath("/admin/purchase-order");

  return {
    success: true,
    message: "Status updated",
  };
}

/* ---------------- GET ALL ---------------- */

export async function getPurchaseOrders() {
  await checkPermission("view");

  return prisma.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vendor: true,
      requirement: true,
      items: {
        include: {
          deviceCategory: true,
        },
      },
    },
  });
}

/* ---------------- GET BY ID ---------------- */

export async function getPurchaseOrderById(id: string) {
  await checkPermission("view");

  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      vendor: true,
      requirement: true,
      items: {
        include: {
          deviceCategory: true,
        },
      },
    },
  });

  if (!po) {
    throw new Error("Purchase Order not found");
  }

  return po;
}
