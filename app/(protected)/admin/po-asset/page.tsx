import { Button } from "@/components/ui/button";
import Link from "next/link";

import POAssetTable from "./po-asset-table";

import { getPOAssets } from "@/lib/actions/po-asset";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const user = await getUserPermissions(session.user.email);

  const route = "/admin/po-asset";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");

  const data = await getPOAssets();

  return (
    <div className="mt-2">
      <POAssetTable
        data={data}
        title="PO Assets"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/po-asset/create">
                Add PO Asset
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default Page;