import { Button } from "@/components/ui/button";
import Link from "next/link";
// import PurchaseOrderTable from "./purchase-order-table";
import PurchaseOrderTable from "./purchase-order-table";
// import { getPurchaseOrders } from "@/lib/actions/purchase-order";
import { getPurchaseOrders } from "@/lib/actions/purchase-order";
import { PurchaseOrder } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const PurchaseOrderPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/purchase-order";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="mt-2">
      <PurchaseOrderTable
        data={(purchaseOrders ?? []) as PurchaseOrder[]}
        canEdit={canEdit}
        canDelete={canDelete}
        title="Purchase Orders"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/purchase-order/create">
                Add Purchase Order
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default PurchaseOrderPage;