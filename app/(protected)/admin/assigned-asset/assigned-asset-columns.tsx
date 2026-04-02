import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Info, EditIcon, Trash, RotateCcw } from "lucide-react";
import Link from "next/link";

export const getAssignedAssetColumns = ({
  devices,
  employees,
  canEdit,
  canDelete,
  onDelete,
  onReturn,
}: any): ColumnDef<any>[] => [
  {
    accessorKey: "deviceId",
    header: "Asset",
    cell: ({ row }) =>
      devices.find((d: any) => d.id === row.original.deviceId)?.name,
  },
  {
    accessorKey: "employeeId",
    header: "Employee",
    cell: ({ row }) =>
      employees.find((e: any) => e.id === row.original.employeeId)?.first_name,
  },
  {
    accessorKey: "assignedDate",
    header: "Assigned Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* INFO */}
        <Button asChild variant="outline">
          <Link
            href={`/admin/device/${row.original.deviceId}/history?assignedId=${row.original.id}`}
          >
            <Info />
          </Link>
        </Button>

        {/* 🔥 RETURN BUTTON */}
        {row.original.status === "ASSIGNED" && (
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => onReturn(row.original)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}

        {/* EDIT */}
        {canEdit && (
          <Button asChild className="bg-orange-500">
            <Link href={`/admin/assigned-asset/edit/${row.original.id}`}>
              <EditIcon />
            </Link>
          </Button>
        )}

        {/* DELETE */}
        {canDelete && (
          <Button
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash />
          </Button>
        )}
      </div>
    ),
  },
];