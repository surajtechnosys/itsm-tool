import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import DeviceTable from "./device-table";
import { getDevice } from "@/lib/actions/device-action";
import { Device } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DevicePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const device = await getDevice();

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  return (
    <div className="mt-2">

      <DeviceTable
          data={device as Device[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Device"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/device/create">
                  Add Device
                </Link>
              </Button>
            )
          }
        />
    </div>
  );
};

export default DevicePage;
