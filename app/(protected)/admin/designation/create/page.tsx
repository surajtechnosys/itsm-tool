import DesignationForm from "@/components/employee/designation-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DesignationCreatePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/designation";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <h1>Add Designation</h1>

          <Button className="bg-blue-500">
            <Link href="/admin/designation">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DesignationForm update={false} />
      </CardContent>
    </Card>
  );
};

export default DesignationCreatePage;