import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { purchaseOrderTemplate } from "@/lib/purchaseorder-template";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { vendorEmail, vendorName, poNumber, poDate, totalAmount, deliveryDate } = body;

    const html = purchaseOrderTemplate({
      vendorName,
      poNumber,
      poDate,
      totalAmount,
      deliveryDate,
    });

    await sendMail({
      to: vendorEmail,
      subject: `Purchase Order Approved - PO No ${poNumber}`,
      html,
    });

    return NextResponse.json({
      message: "Purchase Order sent successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending mail" },
      { status: 500 }
    );
  }
}