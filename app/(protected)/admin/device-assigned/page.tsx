import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import DeviceAssignedTable from "./device-assigned-table";

import { getAssignedDevices } from "@/lib/actions/device-assigned-action";
import { getEmployee } from "@/lib/actions/employee";

import { Device, Employee } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DeviceAssignedPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-assigned";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const [deviceAssigned, devices, employees] = await Promise.all([
    getAssignedDevices(),
    getDevice(),
    getEmployee(),
  ]);

  return (
    <div className="mt-2">
      <CardContent className="w-full">
        <DeviceAssignedTable
          data={deviceAssigned}
          devices={devices as Device[]}
          employees={employees as Employee[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Device Assigned"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/device-assigned/create">
                  Add Device Assigned
                </Link>
              </Button>
            )
          }
        />
      </CardContent>
    </div>
  );
};

export default DeviceAssignedPage;
