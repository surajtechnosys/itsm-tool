import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma-helper";
import { redirect } from "next/navigation";

export async function checkAccess(route: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      role: {
        include: {
          roleModules: {
            include: {
              module: true,
            },
          },
        },
      },
    },
  });

  const allowedRoutes =
    user?.role?.roleModules.map((rm) => rm.module.route) || [];

  if (!allowedRoutes.includes(route)) {
    redirect("/unauthorized");
  }

  return user;
}