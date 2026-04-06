import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";

type Props = {
  onAskDelete: (id: string) => void;
};

export const getPOAssetColumns = ({
  onAskDelete,
}: Props): ColumnDef<any>[] => [
  {
    accessorKey: "endClient.name",
    header: "End Client",
    cell: ({ row }) => row.original.endClient?.name,
  },

  {
    accessorKey: "purchaseOrder.poNumber",
    header: "PO Number",
    cell: ({ row }) => row.original.purchaseOrder?.poNumber,
  },

  { accessorKey: "make", header: "Make" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "serialNumber", header: "Serial No" },

  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) =>
      new Date(row.original.startDate).toLocaleDateString(),
  },

  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) =>
      new Date(row.original.endDate).toLocaleDateString(),
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex gap-2">
          <Button asChild size="icon" className="bg-orange-500">
            <Link href={`/admin/po-asset/edit/${item.id}`}>
              <EditIcon className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => onAskDelete(item.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];