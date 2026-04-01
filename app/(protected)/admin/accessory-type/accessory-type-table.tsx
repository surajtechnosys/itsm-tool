"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { getAccessoryTypeColumns } from "./accessory-type-columns";

import {
  deleteAccessoryType,
  getAccessoryType,
} from "@/lib/actions/accessory-type-action";
import { deleteAssetType } from "@/lib/actions/asset-type-action";

export default function AssetTypeTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteAssetType(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      const updated = await getAccessoryType();
      setTableData(updated);
    }
  };

  const columns = getAccessoryTypeColumns({
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