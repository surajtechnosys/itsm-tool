import EmployeeForm from "@/components/employee/employee-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDepartment } from "@/lib/actions/department";
import { getEmployeeById } from "@/lib/actions/employee";
import { getLocation } from "@/lib/actions/location";
import { Employee } from "@/types";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EmployeeEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;  


  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/employee";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const res = await getEmployeeById(id);
  if (!res?.data) {
    redirect("/404");
  }

  const departments = await getDepartment();
  const locations = await getLocation();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Employee</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/employee">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <EmployeeForm
          data={res.data as Employee}
          update={true}
          departments={departments}
          locations={locations as any}
        />
      </CardContent>
    </Card>
  );
};

export default EmployeeEditPage;