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

export const getDesignationColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: Props): ColumnDef<any>[] => [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "id",
    header: "DESIGNATION ID",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "code",
    header: "CODE",
  },
  {
    accessorKey: "level",
    header: "LEVEL",
  },
  {
    accessorKey: "status",
    header: "STATUS",
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
    header: "CREATED DATE",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value
        ? new Date(value).toLocaleDateString()
        : "-";
    },
  },
  {
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const d = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href={`/admin/designation/edit/${d.id}`}>
                <EditIcon size={16} />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(d.id)}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      );
    },
  },
];