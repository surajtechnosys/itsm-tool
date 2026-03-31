"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
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
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteEmployee(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      setTableData((prev: any[]) =>
        prev.filter((emp) => emp.id !== id)
      );
    }
  };

  const columns = getEmployeeColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns}title={title}
    actions={actions}/>;
}
