import { PAGINATION, ROLE_TYPE, UserRole } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateUserRole } from "../actions/update-user-role";
import { routes } from "@/routes";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

export const useUsersTable = (total: number) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE)
  );
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("")
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("asc")
  );

  const totalPages = Math.ceil(total / PAGINATION.DEFAULT_LIMIT);

  const { execute, reset } = useAction(updateUserRole, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("User role updated successfully", {
          description: `User role has been updated to ${data.role}`,
        });
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update user role");
    },
    onSettled: () => {
      setIsLoading(null);
      reset();
    },
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(PAGINATION.DEFAULT_PAGE);
  };

  const createPaginationUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set("page", targetPage.toString());

    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    return `${routes.admin.users}?${params.toString()}`;
  };

  const handleRoleToggle = (userId: string, currentRole: UserRole) => {
    setIsLoading(userId);
    const newRole: UserRole =
      currentRole === ROLE_TYPE.ADMIN ? ROLE_TYPE.USER : ROLE_TYPE.ADMIN;

    execute({
      userId,
      role: newRole,
    });
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";

    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  return {
    isLoading,
    totalPages,
    page,
    search,
    sortBy,
    sortOrder,

    handleSort,
    handleRoleToggle,
    createPaginationUrl,
    getUserInitials,
  };
};
