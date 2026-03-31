import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db/prisma-helper";

export async function proxy(req: any) {
  // ✅ FIXED
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    // ✅ allow dashboard
    if (pathname === "/admin" || pathname === "/admin/dashboard") {
      return NextResponse.next();
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.email) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email },
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
  user?.role?.roleModules
    ?.filter((rm) => rm.canView)
    .map((rm) => rm.module.route) || [];

    // ✅ admin bypass
    if (user?.role?.name === "Admin") {
      return NextResponse.next();
    }

    const cleanPath = pathname.replace(/\/$/, "");

    const isAllowed = allowedRoutes.some((route) => {
      const cleanRoute = route.replace(/\/$/, "");
      return cleanPath.startsWith(cleanRoute);
    });

    if (!isAllowed) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
