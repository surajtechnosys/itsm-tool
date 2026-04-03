import { Button } from "@/components/ui/button";
import Link from "next/link";
import FrontClientTable from "./front-client-table";
import { getFrontClients } from "@/lib/actions/front-client";
import { FrontClient } from "@/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const FrontClientPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);
  const route = "/admin/front-client";

  if (!canAccess(user, route, "view")) {
    redirect("/404");
  }

  const canCreate = canAccess(user, route, "create");
  const canEdit = canAccess(user, route, "edit");
  const canDelete = canAccess(user, route, "delete");

  // ✅ FETCH DATA ONCE
  const clients = await getFrontClients();

  return (
    <div className="mt-2">
      <FrontClientTable
        data={(clients ?? []) as FrontClient[]}   // ✅ SAFE FALLBACK
        canEdit={canEdit}
        canDelete={canDelete}
        title="Front Client"
        actions={
          canCreate && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/admin/front-client/create">
                Add Front Client
              </Link>
            </Button>
          )
        }
      />
    </div>
  );
};

export default FrontClientPage;