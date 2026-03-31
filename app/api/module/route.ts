import { prisma } from "@/lib/db/prisma-helper";

export async function GET() {
  const modules = await prisma.module.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });

  return Response.json(modules);
}