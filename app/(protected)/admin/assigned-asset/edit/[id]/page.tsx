import AssignedAssetForm from "@/components/device/assigned-asset-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { getAssignedAssetById } from "@/lib/actions/assigned-asset-action";
import { getAsset } from "@/lib/actions/asset-action";
import { getEmployee } from "@/lib/actions/employee";

import { AssetType, Employee } from "@/types";
import Link from "next/link";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const AssignedAssetCreatePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/assigned-asset";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  const assets = await getAsset();
  const employees = await getEmployee();
  const res = await getAssignedAssetById(id);

  if (!res.success) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Create Assigned Asset</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/assigned-asset">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AssignedAssetForm
          data={res.data}
          update={true}
          assets={assets}
          employees={employees}
        />
      </CardContent>
    </Card>
  );
};

export default AssignedAssetCreatePage;
