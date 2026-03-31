"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getVendorColumns } from "./vendor-columns";

import { deleteVendor } from "@/lib/actions/vendor";

export default function VendorTable({
  vendor,
  canEdit,
  canDelete,
  title,
  actions

}: any) {
  const [tableData, setTableData] = useState(vendor);

  const deleteHandler = async (id: string) => {
    const res = await deleteVendor(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message,
      });
      return;
    }

    toast.success("Success", {
      description: res?.message,
    });

    // Optimistic update (faster UX)
    setTableData((prev: any[]) => prev.filter((v) => v.id !== id));
  };

  const columns = getVendorColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}