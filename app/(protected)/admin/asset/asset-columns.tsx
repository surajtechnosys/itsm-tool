import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { Asset } from "@/types";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onAskDelete: (id: string) => void;
};

export const getAssetColumns = ({
  canEdit,
  canDelete,
  onAskDelete,
}: Props): ColumnDef<Asset>[] => [
  {
    accessorKey: "name",
    header: "Asset Name",
  },
  {
    accessorKey: "type",
    header: "Asset Type",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial No",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className="bg-green-500 hover:bg-green-500">
          {status || "ACTIVE"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const asset = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600" size="icon">
              <Link href={`/admin/asset/edit/${asset.id}`}>
                <EditIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onAskDelete(asset.id as string)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];