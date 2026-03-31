import { prisma } from "@/lib/db/prisma-helper";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.notification.count({
    where: {
      isRead: false,
    },
  });

  return NextResponse.json({ count });
}