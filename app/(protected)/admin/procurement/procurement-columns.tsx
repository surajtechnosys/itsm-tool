import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export const getProcurementColumns = ({
  canApprove,
  canReject,
  canDelete,
  loadingId,
  onApprove,
  onReject,
  onDelete,
}: any): ColumnDef<any>[] => [
  {
    accessorKey: "vendor",
    header: "Vendor",
    cell: ({ row }) => row.original.vendor?.name || "-",
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => row.original.requirement?.model || "-",
  },
  {
    accessorKey: "grandTotal",
    header: "Grand Total",
    cell: ({ row }) => {
      const value = row.original.grandTotal;
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value);
    },
  },
  {
    accessorKey: "deliveryDays",
    header: "Delivery",
    cell: ({ row }) => `${row.original.deliveryDays} Days`,
  },
  {
    accessorKey: "validTill",
    header: "Valid Till",
    cell: ({ row }) =>
      format(new Date(row.original.validTill), "PPP"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const styles =
        status === "PENDING"
          ? "bg-yellow-100 text-yellow-800"
          : status === "APPROVED"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800";

      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const quote = row.original;
      const isPending = quote.status === "PENDING";

      return (
        <div className="flex justify-end gap-2">
          {canApprove && (
            <Button
              size="sm"
              onClick={() => onApprove(quote.id)}
              disabled={!isPending || loadingId === quote.id}
              className="bg-green-500 hover:bg-green-600"
            >
              {loadingId === quote.id ? "..." : "Approve"}
            </Button>
          )}

          {canReject && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(quote.id)}
              disabled={!isPending || loadingId === quote.id}
            >
              Reject
            </Button>
          )}

          {canDelete && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => onDelete(quote.id)}
              disabled={loadingId === quote.id}
            >
              {loadingId === quote.id ? "⏳" : <Trash2 size={16} />}
            </Button>
          )}
        </div>
      );
    },
  },
];