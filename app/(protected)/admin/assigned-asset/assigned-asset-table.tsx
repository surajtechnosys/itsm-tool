"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getAssignedAssetColumns } from "./assigned-asset-columns";

import {
  deleteAssignedAsset,
  getAssignedAssets,
  updateAssignedAsset,
} from "@/lib/actions/assigned-asset-action";

import AssignedAssetForm from "@/components/device/assigned-asset-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AssignedAssetTable({
  data,
  devices,
  employees,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const deleteHandler = async (id: string) => {
    const res = await deleteAssignedAsset(id);

    if (!res?.success) {
      toast.error("Error", { description: res?.message });
    } else {
      toast.success("Success", { description: res?.message });

      const updated = await getAssignedAssets();
      setTableData(updated);
    }
  };

  const handleReturn = (row: any) => {
    setSelectedRow(row);
    setOpenReturn(true);
  };

  const columns = getAssignedAssetColumns({
    devices,
    employees,
    canEdit,
    canDelete,
    onDelete: deleteHandler,
    onReturn: handleReturn,
  });

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        title={title}
        actions={actions}
      />

      {/* 🔥 RETURN MODAL */}
      <Dialog open={openReturn} onOpenChange={setOpenReturn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Asset</DialogTitle>
          </DialogHeader>

          {selectedRow && (
            <AssignedAssetForm
              data={selectedRow}
              update={true}
              assets={assets}
              employees={employees}
              isReturn={true}
              onSuccess={async () => {
                setOpenReturn(false);
                const updated = await getAssignedAssets();
                setTableData(updated);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
