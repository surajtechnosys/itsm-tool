import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VendorForm from "@/components/vendor/vendor-from";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const VendorCreatePage = async () => {

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/vendor";

  if (!canAccess(user, route, "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Vendor</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/vendor">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <VendorForm update={false} />
      </CardContent>
    </Card>
  );
};

export default VendorCreatePage;
