import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}