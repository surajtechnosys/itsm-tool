import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { quotationId } = await req.json();

    if (!quotationId) {
      return NextResponse.json(
        { message: "Quotation ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {

      const quotation = await tx.quotation.findUnique({
        where: { id: quotationId },
      });

      if (!quotation) {
        throw new Error("Quotation not found");
      }

      await tx.quotation.update({
        where: { id: quotationId },
        data: { status: "APPROVED" },
      });

      await tx.quotation.updateMany({
        where: {
          requirementId: quotation.requirementId,
          NOT: { id: quotationId },
        },
        data: { status: "REJECTED" },
      });

      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          poNumber: `PO-${Date.now()}`,
          requirementId: quotation.requirementId,
          vendorId: quotation.vendorId,
          totalAmount: quotation.grandTotal,
          status: "DRAFT",
        },
      });

      await tx.requirement.update({
        where: { id: quotation.requirementId },
        data: { status: "INACTIVE" },
      });

      return purchaseOrder;
    });

    return NextResponse.json({
      message: "Quotation Approved & Purchase Order Created",
      purchaseOrder: result,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
