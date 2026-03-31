import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { quotationId } = await req.json();

  if (!quotationId) {
    return NextResponse.json(
      { message: "Quotation ID required" },
      { status: 400 }
    );
  }

  await prisma.quotation.update({
    where: { id: quotationId },
    data: { status: "REJECTED" },
  });

  return NextResponse.json({ success: true });
}
