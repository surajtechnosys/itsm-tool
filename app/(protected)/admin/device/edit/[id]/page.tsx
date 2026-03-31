import DeviceForm from "@/components/device/device-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDeviceById } from "@/lib/actions/device-action";
import { getDeviceCategory } from "@/lib/actions/device-category-action";
import { Device } from "@/types";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DeviceEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/device", "edit")) {
    redirect("/404");
  }

  const { id } = await params;

  const res = await getDeviceById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  const categories = await getDeviceCategory();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Device</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/device">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DeviceForm
          data={res.data as Device}
          update={true}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default DeviceEditPage;
