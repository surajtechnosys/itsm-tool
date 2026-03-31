import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ModuleForm from "@/components/user/module-form";
import { getModuleById } from "@/lib/actions/module-action";
import { getRoles } from "@/lib/actions/role-action";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const ModuleEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/module";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const res = await getModuleById(id);
  const roles = await getRoles();

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Module</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/module">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ModuleForm update={true} data={res.data} roles={roles} />
      </CardContent>
    </Card>
  );
};

export default ModuleEditPage;