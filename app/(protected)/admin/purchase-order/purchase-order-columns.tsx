import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { PurchaseOrder } from "@/types";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onAskDelete: (id: string) => void;
};

export const getPurchaseOrderColumns = ({
  canEdit,
  canDelete,
  onAskDelete,
}: Props): ColumnDef<PurchaseOrder>[] => [
  { accessorKey: "poNumber", header: "PO Number" },

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
    accessorKey: "poReceiveDate",
    header: "PO Received Date",
    cell: ({ row }) =>
      new Date(row.original.poReceiveDate).toLocaleDateString(),
  },

  { accessorKey: "poType", header: "Type" },

  { accessorKey: "poValue", header: "Value" },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const po = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild size="icon" className="bg-orange-500">
              <Link href={`/admin/purchase-order/edit/${po.id}`}>
                <EditIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onAskDelete(po.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];