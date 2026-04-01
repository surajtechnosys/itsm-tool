import AccessoryTypeForm from '@/components/device/accessory-type-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const CreateAccessoryType = async () => {

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/accessory-type"; 

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h1>Add Accessory Type</h1>

          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Link href="/admin/accessory-type">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AccessoryTypeForm update={false} />
      </CardContent>
    </Card>
  )
}

export default CreateAccessoryType;