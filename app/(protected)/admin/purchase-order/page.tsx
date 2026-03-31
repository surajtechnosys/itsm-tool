import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import {
  getPurchaseOrders,
  updatePurchaseOrderStatus,
} from "@/lib/actions/purchase-order";
import PurchaseOrderTable from "./purchase-order-table";

export default async function PurchaseOrderPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/purchase-order";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const roleName = user?.role?.name || "";
  const isAdmin = roleName.toLowerCase().includes("admin");

  const canCreate = isAdmin || canAccess(user, route, "create");
  const canEdit = isAdmin || canAccess(user, route, "edit");

  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="mt-2">
      <PurchaseOrderTable
        data={purchaseOrders}
        canEdit={canEdit}
        title="Purchase Orders"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/purchase-order/create">Create PO</Link>
            </Button>
          )
        }
      />
    </div>
  );
}
