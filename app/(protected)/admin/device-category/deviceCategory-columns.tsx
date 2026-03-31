import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

export const getDeviceCategoryColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: Props): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return status === "ACTIVE" ? (
        <Badge className="bg-green-500">ACTIVE</Badge>
      ) : (
        <Badge variant="destructive">INACTIVE</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? new Date(value).toLocaleString() : "-";
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href={`/admin/device-category/edit/${category.id}`}>
                <EditIcon />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(category.id)}
            >
              <Trash />
            </Button>
          )}
        </div>
      );
    },
  },
];