import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RoleForm from "@/components/user/role-form";
import { getRoleById } from "@/lib/actions/role-action";
import Link from "next/link";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const RoleEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/role";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const { id } = await params;
  const res = await getRoleById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Role</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/role">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <RoleForm data={res.data} update={true} />
      </CardContent>
    </Card>
  );
};

export default RoleEditPage;