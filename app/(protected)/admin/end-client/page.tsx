import { Button } from "@/components/ui/button";
import Link from "next/link";
// import EndClientTable from "./end-client-table";
import EndClientTable from "./end-client-table";
import { getEndClients } from "@/lib/actions/end-client";
import { EndClient } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const EndClientPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/end-client";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  const clients = await getEndClients();

  return (
    <div className="mt-2">
      <EndClientTable
        data={(clients ?? []) as EndClient[]}
        canEdit={canEdit}
        canDelete={canDelete}
        title="End Clients"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/end-client/create">
                Add End Client
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default EndClientPage;