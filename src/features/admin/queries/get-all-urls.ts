/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/db";

export type UrlWithUser = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  flagged: boolean;
  flagReason: string | null;
};

type GetAllUrlsOptions = {
  page?: number;
  limit?: number;
  sortBy?: "originalUrl" | "shortCode" | "createdAt" | "clicks" | "userName";
  sortOrder?: "asc" | "desc";
  search?: string;
  filter?: "all" | "flagged" | "security" | "inappropriate" | "other";
};

export const getAllUrls = async (options: GetAllUrlsOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    filter = "all",
  } = options;

  const offset = (page - 1) * limit;

  const allUrls = await db.query.urls.findMany({
    with: { user: true },
  });

  let transformedUrls: UrlWithUser[] = allUrls.map(url => ({
    id: url.id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    createdAt: url.createdAt,
    clicks: url.clicks,
    userId: url.userId,
    userName: url.user?.name || null,
    userEmail: url.user?.email || null,
    flagged: url.flagged,
    flagReason: url.flagReason,
  }));

  if (search) {
    transformedUrls = transformedUrls.filter(
      url =>
        url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
        url.shortCode.toLowerCase().includes(search.toLowerCase()) ||
        url.userName?.toLowerCase().includes(search.toLowerCase()) ||
        url.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
        url.flagReason?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filter !== "all") {
    transformedUrls = transformedUrls.filter(url => {
      if (filter === "flagged") {
        return url.flagged;
      }

      if (filter === "security" && url.flagReason) {
        return (
          url.flagReason.toLowerCase().includes("security") ||
          url.flagReason.toLowerCase().includes("phishing") ||
          url.flagReason.toLowerCase().includes("malware")
        );
      }

      if (filter === "inappropriate" && url.flagReason) {
        return (
          url.flagReason.toLowerCase().includes("inappropriate") ||
          url.flagReason.toLowerCase().includes("adult") ||
          url.flagReason.toLowerCase().includes("offensive")
        );
      }

      if (filter === "other" && url.flagReason) {
        return (
          !url.flagReason.toLowerCase().includes("security") &&
          !url.flagReason.toLowerCase().includes("phishing") &&
          !url.flagReason.toLowerCase().includes("malware") &&
          !url.flagReason.toLowerCase().includes("inappropriate") &&
          !url.flagReason.toLowerCase().includes("adult") &&
          !url.flagReason.toLowerCase().includes("offensive")
        );
      }

      return false;
    });
  }

  const total = transformedUrls.length;

  if (sortBy && sortOrder) {
    transformedUrls.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (sortBy === "userName") {
        valueA = a.userName || a.userEmail || "";
        valueB = b.userName || b.userEmail || "";
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (valueA === null) valueA = "";
      if (valueB === null) valueB = "";

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  const paginatedUrls = transformedUrls.slice(offset, offset + limit);

  return {
    urls: paginatedUrls,
    total,
  };
};
