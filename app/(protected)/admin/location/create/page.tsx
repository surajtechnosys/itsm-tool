import LocationForm from '@/components/employee/location-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { getUserPermissions, canAccess } from "@/lib/rbac";

const LocationCreatePage = async () => {
    const session = await auth();
      if (!session?.user?.email) {
        redirect("/sign-in");
      }
    
      const user = await getUserPermissions(session.user.email);
      const route = "/admin/location";
    
      if (!canAccess(user, route, "create")) {
        redirect("/404");
      }

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <h1>Add Location</h1>
                    <Button variant="default" className='bg-blue-500 hover:bg-blue-600'>
                        <Link href="/admin/location">Back</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <LocationForm update={false} />
            </CardContent>
        </Card>
    )
}

export default LocationCreatePage