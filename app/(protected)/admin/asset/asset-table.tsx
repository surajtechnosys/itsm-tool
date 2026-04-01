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

import {
  deleteAsset,
  getAsset,
} from "@/lib/actions/asset-action";

import { Asset } from "@/types";
import { getAssetColumns } from "./asset-columns";

type Props = {
  data: Asset[];
  canEdit: boolean;
  canDelete: boolean;
  title?: string;
  actions?: React.ReactNode;
};

const AssetTable = ({
  data,
  canEdit,
  canDelete,
  title,
  actions,
}: Props) => {
  const [tableData, setTableData] = useState<Asset[]>(data);
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const refreshAssets = async () => {
    const response = await getAsset();
    setTableData(response as Asset[]);
  };

  const deleteAssetHandler = async (id: string) => {
    const res = await deleteAsset(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message,
      });
      return;
    }

    toast.success("Success", {
      description: res?.message,
    });

    await refreshAssets();
    setOpen(false);
    setSelectedAsset(null);
  };

  const columns = useMemo(
    () =>
      getAssetColumns({
        canEdit,
        canDelete,
        onAskDelete: (id: string) => {
          setSelectedAsset(id);
          setOpen(true);
        },
      }),
    [canEdit, canDelete]
  );

  return (
    <>
      <DataTable data={tableData} columns={columns} title={title} actions={actions} />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this asset?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex justify-end gap-3">
            {canDelete && selectedAsset && (
              <AlertDialogAction asChild>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
                  onClick={() => deleteAssetHandler(selectedAsset)}
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
                setSelectedAsset(null);
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

export default AssetTable;
