import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesignationTable from "./designation-table";
import { getDesignation } from "@/lib/actions/designation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DesignationPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/designation";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const roleName = user?.role?.name || "";
  const isAdmin = roleName.toLowerCase().includes("admin");

  const canCreate = isAdmin || canAccess(user, route, "create");
  const canEdit = isAdmin || canAccess(user, route, "edit");
  const canDelete = isAdmin || canAccess(user, route, "delete");

  const designation = await getDesignation();

  return (
    <div className="mt-2">
      <DesignationTable
        data={designation}
        canEdit={canEdit}
        canDelete={canDelete}
        title="Designation"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/designation/create">
                Add Designation
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default DesignationPage;