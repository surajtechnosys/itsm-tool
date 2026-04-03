import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { EndClient } from "@/types";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onAskDelete: (id: string) => void;
};

export const getEndClientColumns = ({
  canEdit,
  canDelete,
  onAskDelete,
}: Props): ColumnDef<EndClient>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "endClientId", header: "EndClient ID" },
  { accessorKey: "contactPerson", header: "Contact Person" },
  { accessorKey: "contactNumber", header: "Contact Number" },
  { accessorKey: "status", header: "Status" },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild size="icon" className="bg-orange-500">
              <Link href={`/admin/end-client/edit/${client.id}`}>
                <EditIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              size="icon"
              variant="destructive"
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