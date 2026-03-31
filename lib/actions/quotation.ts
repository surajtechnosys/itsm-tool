"use server";

import { prisma } from "@/lib/db/prisma-helper";

export async function getQuotations() {
  return await prisma.quotation.findMany({
    include: {
      vendor: true,
      requirement: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
