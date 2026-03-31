import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
};

export const getUserColumns = ({
  canEdit,
  canDelete,
  onDelete,
}: Props): ColumnDef<any>[] => [
  {
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Create Date",
    cell: ({ row }) => {
      const value = row.original.createdAt;
      return value
        ? new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-";
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          {canEdit && (
            <Button
              asChild
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Link href={`/admin/user/edit/${user.id}`}>
                Edit
              </Link>
            </Button>
          )}

          {canDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(user.id)}
            >
              Delete
            </Button>
          )}
        </div>
      );
    },
  },
];