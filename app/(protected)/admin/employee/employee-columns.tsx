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

export const getEmployeeColumns = ({
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
    header: "Employee ID",
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) =>
      `${row.original.first_name} ${row.original.last_name}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "department",
    header: "Department",
    cell: ({ row }) => row.original.department?.name || "-",
  },
  {
    id: "designation",
    header: "Designation",
    cell: ({ row }) => row.original.designation?.name || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return row.original.status === "ACTIVE" ? (
        <Badge className="bg-green-500">ACTIVE</Badge>
      ) : (
        <Badge variant="destructive">INACTIVE</Badge>
      );
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
            <Button asChild size="sm" className="bg-orange-500">
              <Link href={`/admin/employee/edit/${emp.id}`}>
                <EditIcon size={16} />
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              size="sm"
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