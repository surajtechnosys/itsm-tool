import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import AssetTable from "./asset-table";
import { getAsset } from "@/lib/actions/asset-action";
import { Asset } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssetPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  // ✅ FIXED ROUTE
  const route = "/admin/asset";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const assets = await getAsset();

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  return (
    <div className="mt-2">
      <AssetTable
        data={assets as Asset[]}
        canEdit={canEdit}
        canDelete={canDelete}
        title="Assets"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/asset/create">Add Asset</Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default AssetPage;
