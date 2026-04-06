"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getPurchaseOrderColumns } from "./purchase-order-columns";

import { deletePurchaseOrder, getPurchaseOrders } from "@/lib/actions/purchase-order";

import { PurchaseOrder } from "@/types";

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
  data: PurchaseOrder[];
  canEdit: boolean;
  canDelete: boolean;
  title?: string;
  actions?: React.ReactNode;
};

export default function PurchaseOrderTable({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: Props) {
  const [tableData, setTableData] = useState(data ?? []);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = async () => {
    const res = await getPurchaseOrders();
    setTableData(res ?? []);
  };

  const deleteHandler = async (id: string) => {
    const res = await deletePurchaseOrder(id);

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
      getPurchaseOrderColumns({
        canEdit,
        canDelete,
        onAskDelete: (id) => {
          setSelectedId(id);
          setOpen(true);
        },
      }),
    [canEdit, canDelete]
  );

  return (
    <>
      <DataTable
        data={tableData ?? []}
        columns={columns}
        title={title}
        actions={actions}
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this Purchase Order?
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