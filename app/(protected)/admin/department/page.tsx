import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import DepartmentTable from "./department-table";
import { getDepartment } from "@/lib/actions/department";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DepartmentPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/department";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const roleName = user?.role?.name || "";
  const isAdmin = roleName.toLowerCase().includes("admin");

  const canCreate = isAdmin || canAccess(user, route, "create");
  const canEdit = isAdmin || canAccess(user, route, "edit");
  const canDelete = isAdmin || canAccess(user, route, "delete");

  const department = await getDepartment();

  return (
    <div className="mt-2">
      <DepartmentTable
        data={department}
        canEdit={canEdit}
        canDelete={canDelete}
        title="Department"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/department/create">Add Department</Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default DepartmentPage;
