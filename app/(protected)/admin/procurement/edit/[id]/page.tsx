import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RequirementForm from '@/components/requirement/requirements-form';
import { getRequirementById } from '@/lib/actions/requirements';
import Link from 'next/link';
import { Vendor } from '@/types';
import { getVendors } from '@/lib/actions/vendor';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserPermissions, canAccess } from '@/lib/rbac';

const RequirementEditPage = async ({ params }: { params: { id: string } }) => {

  const { id } = params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserPermissions(session.user.email);

  if (!canAccess(user, "/admin/requirements", "edit")) {
    redirect("/404");
  }

  const requirement = await getRequirementById(id);
  const vendors = await getVendors();

  if (!requirement?.data) {
    redirect("/404");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1>Edit Requirements</h1>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/requirements">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <RequirementForm
          update
          data={requirement.data}
          vendors={vendors as Vendor[]}
        />
      </CardContent>
    </Card>
  );
};

export default RequirementEditPage;
