import POAssetForm from "@/components/po-asset/po-asset-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getPOAssetById } from "@/lib/actions/po-asset";
import { getEndClients } from "@/lib/actions/end-client";
import { getPurchaseOrders } from "@/lib/actions/purchase-order";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/po-asset", "edit")) {
    redirect("/404");
  }

  const res = await getPOAssetById(params.id);

  if (!res?.success || !res.data) redirect("/404");

  const endClients = await getEndClients();
  const purchaseOrders = await getPurchaseOrders();

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h1>Edit PO Asset</h1>

        <Button asChild>
          <Link href="/admin/po-asset">Back</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <POAssetForm
          data={{
            ...res.data,

            startDate: res.data.startDate
              ? new Date(res.data.startDate).toISOString().split("T")[0]
              : "",

            endDate: res.data.endDate
              ? new Date(res.data.endDate).toISOString().split("T")[0]
              : "",
          }}
          update={true}
          endClients={endClients}
          purchaseOrders={purchaseOrders}
        />
      </CardContent>
    </Card>
  );
};

export default Page;