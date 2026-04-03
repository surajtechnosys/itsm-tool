"use client";

import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getAssignedAssetColumns } from "./assigned-asset-columns";

import {
  deleteAssignedAsset,
  getAssignedAssets,
  returnAssetAction, // ✅ USE THIS
} from "@/lib/actions/assigned-asset-action";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AssignedAssetTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: any) {
  const [tableData, setTableData] = useState(data);
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ DELETE
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

  // ✅ OPEN RETURN MODAL
  const handleReturn = (row: any) => {
    setSelectedRow(row);
    setOpenReturn(true);
  };

  // ✅ CONFIRM RETURN (🔥 FIXED)
  const confirmReturn = async () => {
    if (!selectedRow) return;

    setLoading(true);

    try {
      const res = await returnAssetAction({
        assignedId: selectedRow.id,
        assetId: selectedRow.assetId,
      });

      if (!res?.success) {
        toast.error("Error", { description: "Return failed" });
      } else {
        toast.success("Asset returned successfully");

        const updated = await getAssignedAssets();
        setTableData(updated);
        setOpenReturn(false);
      }
    } catch (err) {
      toast.error("Error", { description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ CLEAN columns (no assets/employees needed anymore)
  const columns = getAssignedAssetColumns({
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

      {/* ✅ RETURN MODAL (FIXED UI) */}
      <Dialog open={openReturn} onOpenChange={setOpenReturn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Asset</DialogTitle>
          </DialogHeader>

          {selectedRow && (
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to return this asset?
              </p>

              <button
                onClick={confirmReturn}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
