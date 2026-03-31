import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import VendorTable from "./vendor-table";
import { getVendors } from "@/lib/actions/vendor";
import { Vendor } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const VendorPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/vendor";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const vendors = await getVendors();

  return (
    <div className="mt-2">
        <VendorTable
          vendor={vendors as Vendor[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Vendor"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/vendor/create">
                  Add Vendor
                </Link>
              </Button>
            )
          }

        />
    </div>
  );
};

export default VendorPage;
