"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
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
  deleteDevice,
  getDevice,
  retireDevice,
} from "@/lib/actions/device-action";
import { Device } from "@/types";
import { getDeviceColumns } from "./device-columns";

type Props = {
  data: Device[];
  canEdit: boolean;
  canDelete: boolean;
  title?: string;
  actions?: React.ReactNode;
};

const DeviceTable = ({ data, canEdit, canDelete, title, actions }: Props) => {
  const [tableData, setTableData] = useState<Device[]>(data);
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const refreshDevices = async () => {
    const response = await getDevice();
    setTableData(response as Device[]);
  };

  const retireDeviceHandler = async (id: string) => {
    const res = await retireDevice(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message,
      });
      return;
    }

    toast.success("Success", {
      description: res?.message,
    });

    await refreshDevices();
    setOpen(false);
    setSelectedDevice(null);
  };

  const deleteDeviceHandler = async (id: string) => {
    const res = await deleteDevice(id);

    if (!res?.success) {
      toast.error("Error", {
        description: res?.message,
      });
      return;
    }

    toast.success("Success", {
      description: res?.message,
    });

    await refreshDevices();
    setOpen(false);
    setSelectedDevice(null);
  };

  const columns = useMemo(
    () =>
      getDeviceColumns({
        canEdit,
        canDelete,
        onAskDelete: (id: string) => {
          setSelectedDevice(id);
          setOpen(true);
        },
      }),
    [canEdit, canDelete]
  );

  return (
    <>
      <DataTable data={tableData} columns={columns}title={title}
    actions={actions}  />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              What would you like to do with this device?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex justify-end gap-3">
            {canEdit && selectedDevice && (
              <AlertDialogAction asChild>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  onClick={() => retireDeviceHandler(selectedDevice)}
                >
                  Retire Device
                </button>
              </AlertDialogAction>
            )}

            {canDelete && selectedDevice && (
              <AlertDialogAction asChild>
                <button
                  className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteDeviceHandler(selectedDevice)}
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
                setSelectedDevice(null);
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

export default DeviceTable;
