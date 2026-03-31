import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RequirementForm from "@/components/requirement/requirements-form";
import { getVendors } from "@/lib/actions/vendor";
import Link from "next/link";
import { Vendor } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const RequirementCreatePage = async () => {

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/requirements", "create")) {
    redirect("/404");
  }

  const vendors = await getVendors();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Requirements</h1>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/requirements">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <RequirementForm vendors={vendors as Vendor[]} update={false} />
      </CardContent>
    </Card>
  );
};

export default RequirementCreatePage;