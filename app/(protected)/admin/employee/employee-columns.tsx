import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

export const getEmployeeColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: Props): ColumnDef<any>[] => [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "dateOfBirth",
    header: "DOB",
    cell: ({ row }) => {
      const value = row.original.dateOfBirth;
      return value ? format(new Date(value), "PPP") : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header: "Created",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value ? format(new Date(value), "PPP") : "-";
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const emp = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href={`/admin/employee/edit/${emp.id}`}>
                <EditIcon size={16} />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(emp.id)}
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      );
    },
  },
];