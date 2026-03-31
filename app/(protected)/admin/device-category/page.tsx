import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { getDeviceCategory } from '@/lib/actions/device-category-action'
import DeviceCategoryTable from './device-category-table'
import { DeviceCategory } from '@/types'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const CategoryPage = async () => {

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-category";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const categories = await getDeviceCategory();

  return (
    <div className="mt-2">
        <DeviceCategoryTable
          data={categories as DeviceCategory[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Device Category"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/device-category/create">
                  Add Device Category
                </Link>
              </Button>
            )
          }

        />
    </div>
  )
}

export default CategoryPage;