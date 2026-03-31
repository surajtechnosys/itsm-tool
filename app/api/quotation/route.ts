import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const quotation = await prisma.quotation.create({
      data: {
        vendorId: body.vendorId,
        requirementId: body.requirementId,
        items: body.items,
        validTill: new Date(body.validTill),
        deliveryDays: body.deliveryDays,
        paymentTerms: body.paymentTerms,
        gst: body.gst,
        additionalCharges: body.additionalCharges,
        subtotal: body.subtotal,
        gstAmount: body.gstAmount,
        grandTotal: body.grandTotal,
        remarks: body.remarks,
      },
    });

    return NextResponse.json({
      message: "Quotation Created Successfully",
      quotation,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
