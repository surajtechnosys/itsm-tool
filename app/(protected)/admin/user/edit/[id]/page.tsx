import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserForm from "@/components/user/user-form";
import { getUserById } from "@/lib/actions/user-action";
import Link from "next/link";

import { getRoles } from "@/lib/actions/role-action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const UserEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/user";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const { id } = await params;

  const res = await getUserById(id);
  const roles = await getRoles();

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit User</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/user">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <UserForm data={res.data as any} update={true} roles={roles} />
      </CardContent>
    </Card>
  );
};

export default UserEditPage;
  



