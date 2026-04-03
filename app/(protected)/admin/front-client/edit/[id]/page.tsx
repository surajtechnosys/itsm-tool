import FrontClientForm from "@/components/front-client/front-client-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getFrontClientById } from "@/lib/actions/front-client";
import { FrontClient } from "@/types";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const FrontClientEditPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/front-client", "edit")) {
    redirect("/404");
  }

  const { id } = params;

  const res = await getFrontClientById(id);

  if (!res?.success || !res.data) {
    redirect("/404");
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              Edit Front Client
            </h1>

            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/front-client">Back</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <FrontClientForm
            data={res.data as FrontClient}
            update={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FrontClientEditPage;