import AssetForm from "@/components/device/asset-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssetCreate = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/asset", "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Asset</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/asset">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AssetForm update={false} />
      </CardContent>
    </Card>
  );
};

export default AssetCreate;
