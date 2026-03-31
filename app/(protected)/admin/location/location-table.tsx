"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getLocationColumns } from "./location-columns";

import { deleteLocation } from "@/lib/actions/location";

export default function LocationTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteLocation(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      setTableData((prev: any[]) =>
        prev.filter((loc) => loc.id !== id)
      );
    }
  };

  const columns = getLocationColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}