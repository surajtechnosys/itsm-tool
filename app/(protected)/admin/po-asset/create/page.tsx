import POAssetForm from "@/components/po-asset/po-asset-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getEndClients } from "@/lib/actions/end-client";
import { getPurchaseOrders } from "@/lib/actions/purchase-order";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/po-asset", "create")) {
    redirect("/404");
  }

  const endClients = await getEndClients();
  const purchaseOrders = await getPurchaseOrders();

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h1>Add PO Asset</h1>

        <Button asChild>
          <Link href="/admin/po-asset">Back</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <POAssetForm
          endClients={endClients}
          purchaseOrders={purchaseOrders}
        />
      </CardContent>
    </Card>
  );
};

export default Page;