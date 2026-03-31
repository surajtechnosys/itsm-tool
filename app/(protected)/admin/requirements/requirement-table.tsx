"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getRequirementColumns } from "./requirement-columns";

import {
  deleteRequirement,
  getRequirement,
} from "@/lib/actions/requirements";

export default function RequirementTable({
  requirement,
  canEdit,
  canDelete,
  title,
  actions

}: any) {
  const [tableData, setTableData] = useState(requirement);

  const deleteHandler = async (id: string) => {
    const res = await deleteRequirement(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      const updated = await getRequirement();
      setTableData(updated);
    }
  };

  const columns = getRequirementColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}
