import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { getAssetType } from '@/lib/actions/asset-type-action'
// import AssetTypeTable from './asset-type-table'
import AssetTypeTable from './asset-type-table'
import { AssetType } from '@/types'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssetTypePage = async () => {

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/asset-type"; // ✅ CRITICAL CHANGE

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const assetTypes = await getAssetType();

  return (
    <div className="mt-2">
        <AssetTypeTable
          data={assetTypes as AssetType[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Asset Type"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/asset-type/create">
                  Add Asset Type
                </Link>
              </Button>
            )
          }
        />
    </div>
  )
}

export default AssetTypePage;