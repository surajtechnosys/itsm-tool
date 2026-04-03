"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getEndClientColumns } from "./end-client-columns";

import { deleteEndClient, getEndClients } from "@/lib/actions/end-client";
import { EndClient } from "@/types";

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
  data: EndClient[];
  canEdit: boolean;
  canDelete: boolean;
  title?: string;
  actions?: React.ReactNode;
};

export default function EndClientTable({
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
    const res = await getEndClients();
    setTableData(res ?? []);
  };

  const deleteHandler = async (id: string) => {
    const res = await deleteEndClient(id);

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
      getEndClientColumns({
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
              Delete this End Client?
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