import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const po = await prisma.purchaseOrder.findMany({
      include: {
        vendor: true,
        requirement: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(po);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}
