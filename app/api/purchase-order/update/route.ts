import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "ID and status are required" },
        { status: 400 }
      );
    }

    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!existingPO) {
      return NextResponse.json(
        { message: "Purchase Order not found" },
        { status: 404 }
      );
    }

    // 🚨 Enforce workflow transitions
    if (existingPO.status === "DRAFT" && status !== "SENT") {
      return NextResponse.json(
        { message: "DRAFT can only move to SENT" },
        { status: 400 }
      );
    }

    if (existingPO.status === "SENT" && status !== "RECEIVED") {
      return NextResponse.json(
        { message: "SENT can only move to RECEIVED" },
        { status: 400 }
      );
    }

    if (existingPO.status === "RECEIVED") {
      return NextResponse.json(
        { message: "Completed PO cannot be modified" },
        { status: 400 }
      );
    }

    await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
