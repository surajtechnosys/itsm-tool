import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import RequirementTable from "./requirement-table";
import { getRequirement } from "@/lib/actions/requirements";
import { Requirement } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const RequirementsPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/requirements";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const requirements = await getRequirement();

  return (
    <div className="mt-2"> 
        <RequirementTable
          requirement={requirements as Requirement[]}
          canEdit={canEdit}
          canDelete={canDelete}
          title="Requirements"
          actions={
            canCreate && (
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Link href="/admin/requirements/create">
                  Add Requirements
                </Link>
              </Button>
            )
          }

        />
    </div>
  );
};

export default RequirementsPage;
