import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { quotationId } = await req.json();

    if (!quotationId) {
      return NextResponse.json(
        { message: "Quotation ID required" },
        { status: 400 }
      );
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      return NextResponse.json(
        { message: "Quotation not found" },
        { status: 404 }
      );
    }

     
    if (quotation.status === "APPROVED") {
      return NextResponse.json(
        { message: "Approved quotation cannot be deleted" },
        { status: 400 }
      );
    }

    await prisma.quotation.delete({
      where: { id: quotationId },
    });

    return NextResponse.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
