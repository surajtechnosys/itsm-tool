import { Button } from "@/components/ui/button";
import Link from "next/link";
import EmployeeTable from "./employee-table";
import { getEmployee } from "@/lib/actions/employee";
import { Employee } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EmployeePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/employee";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const roleName = user?.role?.name || "";
  const isAdmin = roleName.toLowerCase().includes("admin");

  const canCreate = isAdmin || canAccess(user, route, "create");
  const canEdit = isAdmin || canAccess(user, route, "edit");
  const canDelete = isAdmin || canAccess(user, route, "delete");

  const employees = await getEmployee();

  return (
  <div className="mt-2">

    <EmployeeTable
      data={employees as Employee[]}
      canEdit={canEdit}
      canDelete={canDelete}
      title="Employee"
      actions={
        canCreate && (
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/employee/create">
              Add Employee
            </Link>
          </Button>
        )
      }
    />
  </div>
);
};

export default EmployeePage;