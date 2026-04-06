import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { prisma } from "@/lib/db/prisma-helper";
import { getConfiguration } from "@/lib/actions/configuration";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/notifications/notification-dropdown";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const dbUser = session?.user?.email
    ? await prisma.user.findUnique({
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
      })
    : null;

  const config = await getConfiguration();

  const allowedRoutes =
    dbUser?.role?.roleModules?.map((rm) => rm.module.route) || []
      ? [
          "/admin/asset",
          "/admin/asset-type",
          "/admin/accessory-type",
          "/admin/assigned-asset",
          "/admin/front-client",
          "/admin/end-client",
          "/admin/purchase-order",
          "/admin/employee",
          "/admin/department",
          "/admin/location",
          "/admin/user",
          "/admin/role",
          "/admin/module",
          "/admin/configuration",
          "/admin/notifications",
          "/admin/designation",
          "/admin/dashboard",
        ]
      : dbUser?.role?.roleModules?.reduce((acc, rm) => {
          if (rm?.module?.route) {
            acc.push(rm.module.route);
          }
          return acc;
        }, [] as string[]) || [];

  const user = dbUser
    ? {
        name: `${dbUser.firstName ?? ""} ${dbUser.lastName ?? ""}`.trim(),
        email: dbUser.email || undefined,
        allowedRoutes,
      }
    : undefined;

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={user} config={config} />
        <SidebarInset>
          <header className="relative sticky top-0 z-50 flex h-16 items-center justify-between bg-background border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <ThemeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
