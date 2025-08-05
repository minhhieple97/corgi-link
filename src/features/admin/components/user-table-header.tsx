import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type UserTableHeaderProps = {
  currentSortBy: string;
  currentSortOrder: string;
  handleSort: (column: string) => void;
};

export const UserTableHeader = ({
  currentSortBy,
  currentSortOrder,
  handleSort,
}: UserTableHeaderProps) => {
  const getSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">
          <button
            onClick={() => handleSort("name")}
            className="flex items-center font-medium"
          >
            User
            {getSortIcon("name")}
          </button>
        </TableHead>
        <TableHead>
          <button
            onClick={() => handleSort("email")}
            className="flex items-center font-medium"
          >
            Email
            {getSortIcon("email")}
          </button>
        </TableHead>
        <TableHead className="w-[120px]">
          <button
            onClick={() => handleSort("role")}
            className="flex items-center font-medium"
          >
            Role
            {getSortIcon("role")}
          </button>
        </TableHead>
        <TableHead className="w-[150px]">
          <button
            onClick={() => handleSort("createdAt")}
            className="flex items-center font-medium"
          >
            Joined
            {getSortIcon("createdAt")}
          </button>
        </TableHead>
        <TableHead className="w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
