import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

export const getRequirementColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: Props): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "warranty",
    header: "Warranty",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? format(new Date(value), "PPP") : "-";
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const req = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button
              asChild
              size="icon"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Link href={`/admin/requirements/edit/${req.id}`}>
                <EditIcon size={16} />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(req.id)}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      );
    },
  },
];