import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ModuleForm from "@/components/user/module-form";
import { getRoles } from "@/lib/actions/role-action";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const ModuleCreatePage = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/module";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  const roles = await getRoles();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Module</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/module">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ModuleForm update={false} roles={roles} />
      </CardContent>
    </Card>
  );
};

export default ModuleCreatePage;