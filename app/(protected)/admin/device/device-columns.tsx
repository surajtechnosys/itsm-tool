import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, Info, Trash } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Device } from "@/types";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onAskDelete: (id: string) => void;
};

export const getDeviceColumns = ({
  canEdit,
  canDelete,
  onAskDelete,
}: Props): ColumnDef<Device>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchased Date",
    cell: ({ row }) => {
      const value = row.original.purchaseDate;
      return value ? format(new Date(value), "PPP") : "-";
    },
  },
  {
    accessorKey: "warrantyEnd",
    header: "Warranty End",
    cell: ({ row }) => {
      const value = row.original.warrantyEnd;
      return value ? format(new Date(value), "PPP") : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return status === "ACTIVE" ? (
        <Badge className="bg-green-500 hover:bg-green-500">{status}</Badge>
      ) : (
        <Badge variant="destructive">{status}</Badge>
      );
    },
  },
  {
    accessorKey: "deviceState",
    header: "State",
    cell: ({ row }) => {
      const state = row.original.deviceState;

      switch (state) {
        case "AVAILABLE":
          return <Badge className="bg-green-500">AVAILABLE</Badge>;
        case "ASSIGNED":
          return <Badge className="bg-blue-500">ASSIGNED</Badge>;
        case "REPAIR":
          return <Badge className="bg-yellow-500 text-black">REPAIR</Badge>;
        case "REPAIRING":
          return <Badge className="bg-orange-500">REPAIRING</Badge>;
        case "RETIRED":
          return <Badge variant="destructive">RETIRED</Badge>;
        default:
          return state || "-";
      }
    },
  },
  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const device = row.original;

      return (
        <div className="flex gap-2">
          {/* VIEW */}
          <Button asChild variant="secondary" size="icon">
            <Link href={`/admin/device/${device.id}/history`}>
              <Info className="h-4 w-4" />
            </Link>
          </Button>

          {/* EDIT */}
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600" size="icon">
              <Link href={`/admin/device/edit/${device.id}`}>
                <EditIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* DELETE */}
          {canDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onAskDelete(device.id as string)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];