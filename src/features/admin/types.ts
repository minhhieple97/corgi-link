import { z } from "zod";
import { manageFlaggedUrlSchema } from "./schemas";

export type ManageFlaggedUrlResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export type Action = "approve" | "delete";

export type SortOrder = "asc" | "desc";
export type SortBy =
  | "originalUrl"
  | "shortCode"
  | "clicks"
  | "userName"
  | "createdAt";
export type HighlightStyle = "security" | "inappropriate" | "other" | "none";

export type UrlsTableQueryState = {
  page: number;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  filter?: string;
};

export type UrlWithUser = {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  flagged: boolean;
  flagReason?: string | null;
  createdAt: string; // Keep as string for the component
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
};

export type ManageFlaggedUrlInput = z.infer<typeof manageFlaggedUrlSchema>;
