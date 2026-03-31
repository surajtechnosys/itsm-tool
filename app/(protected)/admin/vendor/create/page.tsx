import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VendorForm from "@/components/vendor/vendor-from";
import Link from "next/link";
import React from "react";

const VendorCreatePage = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Add Vendor</h1>
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
            <Link href="/admin/vendor">Back</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
          <VendorForm update={false}/>
      </CardContent>
    </Card>
  );
};

export default VendorCreatePage;
