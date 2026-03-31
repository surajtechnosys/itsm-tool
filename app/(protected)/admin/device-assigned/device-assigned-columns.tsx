import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Info, EditIcon, Trash } from "lucide-react"
import Link from "next/link"

export const getDeviceAssignedColumns = ({
  devices,
  employees,
  canEdit,
  canDelete,
  onDelete,
}: any): ColumnDef<any>[] => [
  {
    accessorKey: "deviceId",
    header: "Device",
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
    cell: ({ row }) =>
      row.original.assignedDate
        ? new Date(row.original.assignedDate).toLocaleString()
        : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "-",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {/* VIEW */}
        <Button asChild variant="outline">
          <Link href={`/admin/device/${row.original.deviceId}/history?assignedId=${row.original.id}`}>
            <Info />
          </Link>
        </Button>

        {/* EDIT */}
        {canEdit && (
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href={`/admin/device-assigned/edit/${row.original.id}`}>
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
]