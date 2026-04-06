import PurchaseOrderForm from "@/components/purchase-order/purchase-order-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

import { getEndClients } from "@/lib/actions/end-client";
import { getEmployee } from "@/lib/actions/employee";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/purchase-order", "create")) {
    redirect("/404");
  }

  // 📦 Fetch dropdown data
  const endClients = await getEndClients();
  const employees = await getEmployee();

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h1>Add Purchase Order</h1>

        <Button asChild>
          <Link href="/admin/purchase-order">Back</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <PurchaseOrderForm
          update={false}
          endClients={endClients}
          employees={employees}
        />
      </CardContent>
    </Card>
  );
};

export default Page;