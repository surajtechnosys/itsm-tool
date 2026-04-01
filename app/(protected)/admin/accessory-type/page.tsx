import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { getAccessoryType } from '@/lib/actions/accessory-type-action'
import AccessoryTypeTable from './accessory-type-table' 
import { AccessoryType } from '@/types'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AccessoryTypePage = async () => {

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/accessory-type"; // ✅ CRITICAL CHANGE

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const accessoryTypes = await getAccessoryType();

  return (
    <div className="mt-2">
        <AccessoryTypeTable
          data={accessoryTypes as AccessoryType[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Accessory Type"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/accessory-type/create">
                  Add Accessory Type
                </Link>
              </Button>
            )
          }
        />
    </div>
  )
}

export default AccessoryTypePage;