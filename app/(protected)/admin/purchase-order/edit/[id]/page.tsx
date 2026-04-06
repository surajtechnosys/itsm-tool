import PurchaseOrderForm from "@/components/purchase-order/purchase-order-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getPurchaseOrderById } from "@/lib/actions/purchase-order";
import { getEndClients } from "@/lib/actions/end-client";
import { getEmployee } from "@/lib/actions/employee";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

import { PurchaseOrder } from "@/types";

const PurchaseOrderEditPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  // 🔐 Auth
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  // 🔐 RBAC
  const user = await getUserPermissions(session.user.email);
  if (!canAccess(user, "/admin/purchase-order", "edit")) {
    redirect("/404");
  }

  const { id } = params;

  // 📦 Fetch data
  const res = await getPurchaseOrderById(id);
  const endClients = await getEndClients();
  const employees = await getEmployee();

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              Edit Purchase Order
            </h1>

            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/purchase-order">Back</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <PurchaseOrderForm
            data={res.data as PurchaseOrder}
            update={true}
            endClients={endClients}
            employees={employees}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderEditPage;