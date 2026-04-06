"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getPOAssetColumns } from "./po-asset-columns";

import {
  deletePOAsset,
  getPOAssets,
} from "@/lib/actions/po-asset";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

type Props = {
  data: any[];
  title?: string;
  actions?: React.ReactNode; // ✅ added
};

export default function POAssetTable({
  data,
  title,
  actions,
}: Props) {
  const [tableData, setTableData] = useState(data ?? []);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = async () => {
    const res = await getPOAssets();
    setTableData(res ?? []);
  };

  const deleteHandler = async (id: string) => {
    const res = await deletePOAsset(id);

    if (!res?.success) {
      toast.error(res?.message);
      return;
    }

    toast.success("Deleted");
    await refresh();
    setOpen(false);
  };

  const columns = useMemo(
    () =>
      getPOAssetColumns({
        onAskDelete: (id) => {
          setSelectedId(id);
          setOpen(true);
        },
      }),
    []
  );

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        title={title}
        actions={actions}   // ✅ FIXED
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this PO Asset?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex justify-end gap-3">
            {selectedId && (
              <AlertDialogAction asChild>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => deleteHandler(selectedId)}
                >
                  Delete
                </button>
              </AlertDialogAction>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}