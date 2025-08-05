import type { SortBy, SortOrder } from "./types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_SEARCH = "";
export const DEFAULT_SORT_BY: SortBy = "createdAt";
export const DEFAULT_SORT_ORDER: SortOrder = "desc";
export const URLS_PER_PAGE = 10;

export const SORT_COLUMNS: Record<SortBy, string> = {
  originalUrl: "Original URL",
  shortCode: "Short Code",
  clicks: "Clicks",
  userName: "Created By",
  createdAt: "Created",
} as const;
