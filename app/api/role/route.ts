import { description } from "@/components/chart-area-interactive";
import { prisma } from "@/lib/db/prisma-helper";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, modules } = body;

  const role = await prisma.role.create({
    data: {
      name,
      description: description || "",
      roleModules: {
        create: modules.map((moduleId: string) => ({
          moduleId,
        })),
      },
    },
  });

  return Response.json(role);
}