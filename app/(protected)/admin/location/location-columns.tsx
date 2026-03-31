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

export const getLocationColumns = ({
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
    header: "LOCATION ID",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    id: "code",
    header: "CODE",
    cell: ({ row }) => row.original.name?.slice(0, 5),
  },
  {
    accessorKey: "city",
    header: "CITY",
  },
  {
    id: "floors",
    header: "HAS FLOORS",
    cell: () => "No",
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
    id: "actions",
    header: "ACTION",
    cell: ({ row }) => {
      const loc = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href={`/admin/location/edit/${loc.id}`}>
                <EditIcon size={16} />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(loc.id)}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      );
    },
  },
];