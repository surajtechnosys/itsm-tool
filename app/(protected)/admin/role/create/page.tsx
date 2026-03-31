import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RoleForm from "@/components/user/role-form";
import Link from "next/link";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const RoleCreatePage = async () => {
  // ✅ AUTH
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  // ✅ RBAC
  const user = await getUserPermissions(session.user.email);
  const route = "/admin/role";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Role</h1>

          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/role">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <RoleForm update={false} />
      </CardContent>
    </Card>
  );
};

export default RoleCreatePage;