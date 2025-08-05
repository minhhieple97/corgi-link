import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { manageFlaggedUrl } from "../actions/manage-flagged-url";
import type { Action, SortBy } from "../types";
import {
  DEFAULT_PAGE,
  DEFAULT_SEARCH,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  URLS_PER_PAGE,
} from "../constants";
import { PAGINATION } from "@/constants";

export const useUrlsTable = (total: number) => {
  const router = useRouter();
  const [copyingId, setCopyingId] = useState<number | null>(null);

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(DEFAULT_PAGE)
  );
  const [search] = useQueryState(
    "search",
    parseAsString.withDefault(DEFAULT_SEARCH)
  );
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault(DEFAULT_SORT_BY)
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault(DEFAULT_SORT_ORDER)
  );
  const [filter] = useQueryState("filter", parseAsString);

  const { execute: executeManageFlaggedUrl, isPending: isManagingUrl } =
    useAction(manageFlaggedUrl, {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success(data.message || "Action completed successfully");
          router.refresh();
        } else {
          toast.error(data?.error || "Action failed");
        }
      },
      onError: ({ error }) => {
        console.error("Error managing flagged URL:", error);
        toast.error("Failed to manage flagged URL");
      },
    });

  const totalPage = Math.ceil(total / URLS_PER_PAGE);

  const handleSort = (column: SortBy) => {
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
    if (sortBy !== DEFAULT_SORT_BY) params.set("sortBy", sortBy);
    if (sortOrder !== DEFAULT_SORT_ORDER) params.set("sortOrder", sortOrder);
    if (filter) params.set("filter", filter);

    return `?${params.toString()}`;
  };

  const handleManageFlaggedUrl = (urlId: number, action: Action) => {
    executeManageFlaggedUrl({ urlId, action });
  };

  const copyToClipboard = async (id: number, shortCode: string) => {
    try {
      setCopyingId(id);
      const shortUrl = `${window.location.origin}/r/${shortCode}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Short URL copied to clipboard.");
    } catch (error) {
      console.error("Error copying URL to clipboard", error);
      toast.error("Failed to copy short URL to clipboard.");
    } finally {
      setTimeout(() => {
        setCopyingId(null);
      }, 1000);
    }
  };

  return {
    page,
    search,
    sortBy,
    sortOrder,
    filter,
    copyingId,
    isManagingUrl,
    totalPage,

    handleSort,
    handleManageFlaggedUrl,
    copyToClipboard,
    createPaginationUrl,
  };
};
