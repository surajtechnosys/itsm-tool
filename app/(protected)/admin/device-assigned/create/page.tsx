import DeviceAssignedForm from '@/components/device/assigned-device-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { getDevice } from '@/lib/actions/device-action'
import { getDeviceAssignedById } from '@/lib/actions/device-assigned-action'
import { getEmployee } from '@/lib/actions/employee'

import { Device, Employee } from '@/types'
import Link from 'next/link'
import React from 'react'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserPermissions, canAccess } from '@/lib/rbac'

const DeviceAssignedEditPage = async ({ params }: { params: { id: string } }) => {

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/device-assigned";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const { id } = params;

  const res = await getDeviceAssignedById(id);
  const devices = await getDevice();
  const employees = await getEmployee();

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h1>Edit Device Assigned</h1>

          <Button className='bg-blue-500 hover:bg-blue-600'>
            <Link href="/device-assigned">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DeviceAssignedForm
          data={res.data}
          update={true}
          devices={devices as Device[]}
          employees={employees as Employee[]}
        />
      </CardContent>
    </Card>
  )
}

export default DeviceAssignedEditPage
