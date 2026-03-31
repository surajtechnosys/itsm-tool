import EmployeeForm from "@/components/employee/employee-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDepartment } from "@/lib/actions/department";
import { getDesignation } from "@/lib/actions/designation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EmployeeCreatePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/employee";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  const departments = await getDepartment();
  const designationsRes = await getDesignation();

  // 🔥 handle both cases (array OR {data})
  const designations = (designationsRes as any)?.data || designationsRes;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Employee</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/employee">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeForm
          update={false}
          departments={departments}
          designations={designations}   // ✅ FIXED
        />
      </CardContent>
    </Card>
  );
};

export default EmployeeCreatePage;



