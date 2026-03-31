import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserForm from "@/components/user/user-form";
import Link from "next/link";

import { getRoles } from "@/lib/actions/role-action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const UserCreatePage = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/user";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  const roles = await getRoles();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add User</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/user">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <UserForm update={false} roles={roles} />
      </CardContent>
    </Card>
  );
};

export default UserCreatePage;