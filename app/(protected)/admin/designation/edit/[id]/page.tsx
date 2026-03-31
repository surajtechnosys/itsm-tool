import DesignationForm from "@/components/employee/designation-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDesignationById } from "@/lib/actions/designation";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const DesignationEditPage = async ({
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
  const route = "/admin/designation";

  if (!canAccess(user, route, "edit")) {
    redirect("/404");
  }

  const res = await getDesignationById(id);
  if (!res?.data) redirect("/404");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <h1>Edit Designation</h1>

          <Button className="bg-blue-500">
            <Link href="/admin/designation">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <DesignationForm data={res.data} update={true} />
      </CardContent>
    </Card>
  );
};

export default DesignationEditPage;