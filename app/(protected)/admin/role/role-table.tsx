"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getRoleColumns } from "./role-columns";

import { deleteRole } from "@/lib/actions/role-action";

export default function RoleTable({
  data,
  canEdit,
  canDelete,
  title,
  actions
}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteRole(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
      return;
    }

    toast.success("Success", { description: res?.message });

    setTableData((prev: any[]) =>
      prev.filter((r) => r.id !== id)
    );
  };

  const columns = getRoleColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}