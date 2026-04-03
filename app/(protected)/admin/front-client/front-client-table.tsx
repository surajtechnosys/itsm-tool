"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteFrontClient, getFrontClients } from "@/lib/actions/front-client";

import { FrontClient } from "@/types";
import { getFrontClientColumns } from "./front-client-columns";

type Props = {
  data: FrontClient[];
  canEdit: boolean;
  canDelete: boolean;
  title?: string;
  actions?: React.ReactNode;
};

const FrontClientTable = ({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: Props) => {
  const [tableData, setTableData] = useState<FrontClient[]>(data);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 🔄 Refresh after delete
  const refreshData = async () => {
    const res = await getFrontClients();
    setTableData(res as FrontClient[]);
  };

  const deleteHandler = async (id: string) => {
    const res = await deleteFrontClient(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message,
      });
      return;
    }

    toast.success("Success", {
      description: res?.message,
    });

    await refreshData();
    setOpen(false);
    setSelectedId(null);
  };

  const columns = useMemo(
    () =>
      getFrontClientColumns({
        canEdit,
        canDelete,
        onAskDelete: (id: string) => {
          setSelectedId(id);
          setOpen(true);
        },
      }),
    [canEdit, canDelete]
  );

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        title={title}
        actions={actions}
      />

      {/* 🔴 Delete Confirmation Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this Front Client?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex justify-end gap-3">
            {canDelete && selectedId && (
              <AlertDialogAction asChild>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
                  onClick={() => deleteHandler(selectedId)}
                >
                  Delete Permanently
                </button>
              </AlertDialogAction>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
                setSelectedId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FrontClientTable;