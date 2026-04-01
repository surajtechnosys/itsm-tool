"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { getAssetTypeColumns } from "./asset-type-columns";

import {
  deleteAssetType,
  getAssetType,
} from "@/lib/actions/asset-type-action";

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

      const updated = await getAssetType();
      setTableData(updated);
    }
  };

  const columns = getAssetTypeColumns({
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
