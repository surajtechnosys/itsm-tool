"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getDepartmentColumns } from "./department-columns";

import { deleteDepartment } from "@/lib/actions/department";

export default function DepartmentTable({
  data,
  canEdit,
  canDelete,
  title,
  actions

}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteDepartment(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      setTableData((prev: any[]) =>
        prev.filter((d) => d.id !== id)
      );
    }
  };

  const columns = getDepartmentColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}