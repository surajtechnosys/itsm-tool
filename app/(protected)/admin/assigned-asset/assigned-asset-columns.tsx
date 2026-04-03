import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash, RotateCcw } from "lucide-react";
import Link from "next/link";

export const getAssignedAssetColumns = ({
  canEdit,
  canDelete,
  onDelete,
  onReturn,
}: any): ColumnDef<any>[] => [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },

  // ✅ Asset Code
  {
    header: "Asset Code",
    cell: ({ row }) => row.original.asset?.assetCode || "-",
  },

  // ✅ Name
  {
    header: "Name",
    cell: ({ row }) => row.original.asset?.name || "-",
  },

  // ✅ Category
  {
    header: "Category",
    cell: ({ row }) =>
      row.original.asset?.assetType?.name || "-",
  },

  // ✅ Assigned To
  {
    header: "Assigned To",
    cell: ({ row }) => {
      const emp = row.original.employee;
      return emp
        ? `${emp.first_name} ${emp.last_name}`
        : "-";
    },
  },

  // ✅ Location (keep placeholder)
  {
    header: "Location",
    cell: () => "-",
  },

  // ✅ Status (same UI idea)
  {
    accessorKey: "status",
    header: "Status",
  },

  // ✅ ACTIONS (UI SAME, only removed Info)
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
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
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
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