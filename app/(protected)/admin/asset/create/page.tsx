import FrontClientForm from "@/components/front-client/front-client-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserPermissions, canAccess } from "@/lib/rbac";

const FrontClientCreate = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/front-client", "create")) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Add Front Client</h1>

          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/front-client">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <FrontClientForm update={false} />
      </CardContent>
    </Card>
  );
};

export default FrontClientCreate;
