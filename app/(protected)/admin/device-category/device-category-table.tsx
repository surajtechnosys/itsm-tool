"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getDeviceCategoryColumns } from "./deviceCategory-columns";

import {
  deleteCategoryDevice,
  getDeviceCategory,
} from "@/lib/actions/device-category-action";

export default function DeviceCategoryTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteCategoryDevice(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      const updated = await getDeviceCategory();
      setTableData(updated);
    }
  };

  const columns = getDeviceCategoryColumns({
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}
