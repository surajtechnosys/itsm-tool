import AssetForm from "@/components/device/asset-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAssetById } from "@/lib/actions/asset-action";
import { Asset } from "@/types";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssetEditPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/asset", "edit")) {
    redirect("/404");
  }

  const { id } = params;

  const res = await getAssetById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Asset</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/asset">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AssetForm data={res.data as Asset} update={true} />
      </CardContent>
    </Card>
  );
};

export default AssetEditPage;
