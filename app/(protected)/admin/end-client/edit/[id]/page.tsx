import EndClientForm from "@/components/end-client/end-client-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getEndClientById } from "@/lib/actions/end-client";
import { getFrontClients } from "@/lib/actions/front-client";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

import { EndClient } from "@/types";

const EndClientEditPage = async ({
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
  if (!canAccess(user, "/admin/end-client", "edit")) {
    redirect("/404");
  }

  const { id } = params;

  // 📦 Fetch data
  const res = await getEndClientById(id);
  const frontClients = await getFrontClients();

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              Edit End Client
            </h1>

            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/end-client">Back</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EndClientForm
            data={res.data as EndClient}
            update={true}
            frontClients={frontClients}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EndClientEditPage;