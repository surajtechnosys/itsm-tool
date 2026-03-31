"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getDeviceAssignedColumns } from "./device-assigned-columns";

import {
  deleteDeviceAssigned,
  getAssignedDevices,
} from "@/lib/actions/device-assigned-action";

export default function DeviceAssignedTable({
  data,
  devices,
  employees,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);

  const deleteHandler = async (id: string) => {
    const res = await deleteDeviceAssigned(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      const updated = await getAssignedDevices();
      setTableData(updated);
    }
  };

  const columns = getDeviceAssignedColumns({
    devices,
    employees,
    canEdit,
    canDelete,
    onDelete: deleteHandler,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}


