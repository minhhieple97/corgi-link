"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ADMIN_TABLE } from "@/constants";
import { UserWithoutPassword } from "../queries";
import { useUsersTable } from "../hooks";
import { UserTableHeader } from "./user-table-header";
import { UserTableRow } from "./user-table-row";
import { UserTablePagination } from "./user-table-pagination";

type UsersTableProps = {
  users: UserWithoutPassword[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
};

export const UsersTable = ({
  users,
  total,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: UsersTableProps) => {
  const {
    isLoading,
    totalPages,
    handleSort,
    handleRoleToggle,
    createPaginationUrl,
    getUserInitials,
  } = useUsersTable(total);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <UserTableHeader
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            handleSort={handleSort}
          />
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {currentSearch
                    ? ADMIN_TABLE.MESSAGES.NO_USERS_SEARCH
                    : ADMIN_TABLE.MESSAGES.NO_USERS}
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isLoading={isLoading}
                  getUserInitials={getUserInitials}
                  handleRoleToggle={handleRoleToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPaginationUrl={createPaginationUrl}
      />

      <div className="text-xs text-muted-foreground">
        Showing {users.length} of {total} users
        {currentSearch && ` matching "${currentSearch}"`}
      </div>
    </div>
  );
};
