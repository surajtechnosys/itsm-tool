"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { getEmployeeColumns } from "./employee-columns";
import { deleteEmployee } from "@/lib/actions/employee";

export default function EmployeeTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState<any[]>(data);

  // 🔴 DELETE HANDLER (RBAC controlled from backend)
  const deleteHandler = async (id: string) => {
    const res = await deleteEmployee(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message || "Delete failed",
      });
      return;
    }

    toast.success("Success", {
      description: res?.message || "Deleted successfully",
    });

    // remove from UI
    setTableData((prev) => prev.filter((emp) => emp.id !== id));
  };

  // 📊 Columns (with RBAC actions)
  const columns = getEmployeeColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return (
    <DataTable
      data={tableData}
      columns={columns}
      title={title || "Employees"}
      actions={actions}          // ✅ CREATE BUTTON COMES FROM HERE
      searchKey="email"          // 🔍 search by email (can change to name if needed)
    />
  );
}
