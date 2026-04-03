import EndClientForm from "@/components/end-client/end-client-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";
import { getFrontClients } from "@/lib/actions/front-client";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.email) redirect("/sign-in");

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/end-client", "create")) {
    redirect("/404");
  }

  const frontClients = await getFrontClients();

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <h1>Add End Client</h1>
        <Button asChild>
          <Link href="/admin/end-client">Back</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <EndClientForm
          update={false}
          frontClients={frontClients}
        />
      </CardContent>
    </Card>
  );
};

export default Page;