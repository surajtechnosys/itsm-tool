import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

import AssignedAssetTable from "./assigned-asset-table";

// import { getAssignedDevices } from "@/lib/actions/asset-assigned-action";
import { getAssignedAssetById } from "@/lib/actions/assigned-asset-action";
import { getEmployee } from "@/lib/actions/employee";
// import { getDevice } from "@/lib/actions/device";/
import { getAssetById } from "@/lib/actions/asset-action";

import { Device, Employee } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssignedAssetPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/assigned-asset";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const [assignedAssets, devices, employees] = await Promise.all([
    getAssignedAssets(),
    getAssets(),
    getEmployee(),
  ]);

  return (
    <div className="mt-2">
      <CardContent className="w-full">
        <AssignedAssetTable
          data={assignedAssets}
          devices={devices as Device[]}
          employees={employees as Employee[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Assigned Assets"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/assigned-asset/create">
                  Add Assigned Asset
                </Link>
              </Button>
            )
          }
        />
      </CardContent>
    </div>
  );
};

export default AssignedAssetPage;
