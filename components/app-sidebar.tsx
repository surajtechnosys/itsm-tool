"use client";

import * as React from "react";
import {
  BriefcaseBusinessIcon,
  BuildingIcon,
  ComputerIcon,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Laptop2Icon,
  LocationEdit,
  Map,
  PersonStanding,
  PersonStandingIcon,
  PieChart,
  SettingsIcon,
  User,
  User2,
  UserCog,
  UserPlus,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/lib/constants";
import { IconTableSpark } from "@tabler/icons-react";
import { Configuration } from "@/lib/generated/prisma/client";
// This is sample data.
const data = {
  teams: [
    {
      name: APP_NAME,
      logo: GalleryVerticalEnd,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: PieChart,
    },
    {
      title: "Assets",
      url: "/admin/asset",
      icon: Laptop2Icon,
      items: [
        {
          title: "Assets",
          url: "/admin/asset",
          icon: Laptop2Icon,
        },
        {
          title: "Asset Types",
          url: "/admin/asset-type",
          icon: ComputerIcon,
        },
        {
          title: "Accessory Types",
          url: "/admin/accessory-type",
          icon: ComputerIcon,
        },
        {
          title: "Asset Assigned",
          url: "/admin/assigned-asset",
          icon: UserPlus,
        },
      ],
    },
    {
      title: "Clients",
      url: "/admin/front-client",
      icon: PersonStanding,
      items: [
        {
          title: "Front Client",
          url: "/admin/front-client",
          icon: PersonStandingIcon,
        },
        {
          title: "End Client",
          url: "/admin/end-client",
          icon: PersonStandingIcon,
        }
      ],
    },
    {
      title: "Procurement",
      url: "/admin/procurement",
      icon: BriefcaseBusinessIcon,
      items: [
        {
          title: "Vendor",
          url: "/admin/vendor",
          icon: BriefcaseBusinessIcon,
        },
        {
          title: "Requirements",
          url: "/admin/requirements",
          icon: BriefcaseBusinessIcon,
        },
        {
          title: "Procurement",
          url: "/admin/procurement",
          icon: BriefcaseBusinessIcon,
        },
        {
          title: "Purchase Order",
          url: "/admin/purchase-order",
          icon: FileText,
        },
      ],
    },
    {
      title: "Employee",
      url: "/admin/employee",
      icon: PersonStanding,
      items: [
        {
          title: "Employee",
          url: "/admin/employee",
          icon: PersonStandingIcon,
        },
        {
          title: "Department",
          url: "/admin/department",
          icon: BuildingIcon,
        },
        {
          title: "Location",
          url: "/admin/location",
          icon: LocationEdit,
        },
        {
          title: "Designation",
          url: "/admin/designation",
          icon: UserCog,
        }
      ],
    },
    {
      title: "User",
      url: "/admin/user",
      icon: User2,
      items: [
        {
          title: "User",
          url: "/admin/user",
          icon: User,
        },
        {
          title: "Role",
          url: "/admin/role",
          icon: UserCog,
        },
        {
          title: "Module",
          url: "/admin/module",
          icon: IconTableSpark,
        },
      ],
    },
    {
      title: "Configuration",
      url: "/admin/configuration",
      icon: SettingsIcon,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    allowedRoutes?: string[];
  };
  config?: Configuration | null;
};

function filterNav(navMain: any[], allowedRoutes: string[]) {
  return navMain
    .map((section) => {
      if (!section.items) {
        return allowedRoutes.includes(section.url) ? section : null;
      }

      const filteredItems = section.items.filter((item: any) =>
        allowedRoutes.includes(item.url),
      );

      if (filteredItems.length === 0) return null;

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter(Boolean);
}

export function AppSidebar({ user, config, ...props }: AppSidebarProps) {
  const allowedRoutes = user?.allowedRoutes || [];
  const filteredNav = filterNav(data.navMain, allowedRoutes);

  return (
    <Sidebar collapsible="icon" user={user} {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <div className="flex items-center px-3 py-2 group-data-[collapsible=icon]:justify-center">
            {/* Logo */}
            <div className="flex items-center justify-center h-8 w-8 shrink-0">
              {config?.logo ? (
                <img
                  src={config.logo}
                  alt="logo"
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                <GalleryVerticalEnd className="h-6 w-6" />
              )}
            </div>

            {/* Text */}
            <span className="ml-2 font-semibold text-sm truncate group-data-[collapsible=icon]:hidden">
              {config?.name || APP_NAME}
            </span>
          </div>
        </SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "User",
            email: user?.email ?? "",
            avatar: user?.image ?? "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
