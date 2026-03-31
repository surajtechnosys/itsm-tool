import LocationForm from '@/components/employee/location-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getLocationById } from '@/lib/actions/location'
import { Location } from '@/types'
import Link from 'next/link'
import React from 'react'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { getUserPermissions, canAccess } from "@/lib/rbac";

const LocationEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    
      const session = await auth();
      if (!session?.user?.email) {
        redirect("/sign-in");
      }
    
      const user = await getUserPermissions(session.user.email);
      const route = "/admin/location"; 
    
      if (!canAccess(user, route, "edit")) {
        redirect("/404");
      }
    
      const res = await getLocationById(id);
      if (!res?.data) redirect("/404");

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <h1>Edit Location</h1>
                    <Button variant="default" className='bg-blue-500 hover:bg-blue-600'>
                        <Link href="/admin/location">Back</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <LocationForm data={res.data as Location} update={true} />
            </CardContent>
        </Card>
    )
}

export default LocationEditPage