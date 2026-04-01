import AssetTypeForm from '@/components/device/asset-type-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getAssetTypeById } from '@/lib/actions/asset-type-action'
import Link from 'next/link'
import React from 'react'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EditAssetType = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/asset-type"; // ✅ CRITICAL

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const res = await getAssetTypeById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h1>Edit Asset Type</h1>

          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Link href="/admin/asset-type">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AssetTypeForm data={res.data} update={true} />
      </CardContent>
    </Card>
  )
}

export default EditAssetType;