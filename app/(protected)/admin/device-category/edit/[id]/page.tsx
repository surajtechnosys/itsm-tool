import DeviceCategoryForm from '@/components/device/device-category-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getDeviceCategoryById } from '@/lib/actions/device-category-action'
import Link from 'next/link'
import React from 'react'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EditDeviceCategory = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-category";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const res = await getDeviceCategoryById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h1>Edit Device Category</h1>

          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Link href="/admin/device-category">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DeviceCategoryForm data={res.data} update={true} />
      </CardContent>
    </Card>
  )
}

export default EditDeviceCategory;