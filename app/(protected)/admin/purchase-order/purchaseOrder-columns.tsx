import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const getPurchaseOrderColumns = ({
  canEdit,
  onSend,
  onReceive,
}: any): ColumnDef<any>[] => [
  {
    accessorKey: "poNumber",
    header: "PO Number",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => row.original.vendor?.name,
  },
  {
    accessorKey: "requirement",
    header: "Requirement",
    cell: ({ row }) => row.original.requirement?.model,
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => `₹${row.original.totalAmount.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const po = row.original;

      return (
        <div className="flex justify-end gap-2">
          {canEdit && (
            <Button
              size="sm"
              disabled={po.status !== "DRAFT"}
              onClick={() => onSend(po.id)}
            >
              Send
            </Button>
          )}

          {canEdit && (
            <Button
              size="sm"
              className="bg-purple-600"
              disabled={po.status !== "SENT"}
              onClick={() => onReceive(po.id)}
            >
              Receive
            </Button>
          )}
        </div>
      );
    },
  },
];
