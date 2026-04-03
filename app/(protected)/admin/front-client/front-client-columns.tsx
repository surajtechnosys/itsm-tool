import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { FrontClient } from "@/types";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onAskDelete: (id: string) => void;
};

export const getFrontClientColumns = ({
  canEdit,
  canDelete,
  onAskDelete,
}: Props): ColumnDef<FrontClient>[] => [
  {
    accessorKey: "name",
    header: "Client Name",
  },
  {
    accessorKey: "frontClientId",
    header: "Client ID",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status === "Active"
              ? "bg-green-500 hover:bg-green-500"
              : "bg-red-500 hover:bg-red-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button
              asChild
              size="icon"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Link href={`/admin/front-client/edit/${client.id}`}>
                <EditIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onAskDelete(client.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];