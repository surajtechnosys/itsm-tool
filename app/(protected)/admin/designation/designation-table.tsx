"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { getDesignationColumns } from "./designation-columns";
import { deleteDesignation } from "@/lib/actions/designation";

export default function DesignationTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState<any[]>(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteDesignation(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });

    setTableData((prev) => prev.filter((d) => d.id !== id));
  };

  const columns = getDesignationColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return (
    <DataTable
      data={tableData}
      columns={columns}
      title={title}
      actions={actions}
    />
  );
}