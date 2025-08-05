"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import type { SortBy, HighlightStyle, UrlWithUser } from "../types";
import { SORT_COLUMNS } from "../constants";
import { useUrlsTable } from "../hooks";
import {
  truncateUrl,
  getHighlightStyles,
  getFlagIconColor,
  getColumnWidth,
} from "../utils";

type UrlsTableProps = {
  urls: UrlWithUser[];
  total: number;
  highlightStyle?: HighlightStyle;
};

export const UrlsTable = ({ urls, total, highlightStyle }: UrlsTableProps) => {
  const {
    page,
    search,
    sortBy,
    sortOrder,
    copyingId,
    isManagingUrl,
    totalPage,
    handleSort,
    handleManageFlaggedUrl,
    copyToClipboard,
    createPaginationUrl,
  } = useUrlsTable(total);

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  };

  const getPaginationItems = () => {
    const items = [];

    items.push(
      <PaginationItem key="first">
        <PaginationLink href={createPaginationUrl(1)} isActive={page === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPage - 1, page + 1);
      i++
    ) {
      if (i === 1 || i === totalPage) continue;

      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPaginationUrl(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (page < totalPage - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPage > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={createPaginationUrl(totalPage)}
            isActive={page === totalPage}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.entries(SORT_COLUMNS).map(([key, label]) => (
                <TableHead key={key} className={getColumnWidth(key)}>
                  <button
                    className="flex items-center font-medium"
                    onClick={() => handleSort(key as SortBy)}
                  >
                    {label}
                    {getSortIcon(key as SortBy)}
                  </button>
                </TableHead>
              ))}
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  {search
                    ? "No URLs found with the search term."
                    : "No URLs found."}
                </TableCell>
              </TableRow>
            ) : (
              urls.map(url => (
                <TableRow
                  key={url.id}
                  className={getHighlightStyles(url, highlightStyle)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {url.flagged && (
                        <div
                          className={getFlagIconColor(highlightStyle)}
                          title={url.flagReason || "Flagged By AI"}
                        >
                          <AlertTriangle className="size-4" />
                        </div>
                      )}
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 max-w-[250px] truncate"
                      >
                        {truncateUrl(url.originalUrl)}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                    {url.flagged && url.flagReason && (
                      <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400 max-w-[250px] truncate">
                        Reason: {url.flagReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">
                        {url.shortCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => copyToClipboard(url.id, url.shortCode)}
                        disabled={copyingId === url.id}
                      >
                        {copyingId === url.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{url.clicks}</Badge>
                  </TableCell>
                  <TableCell>
                    {url.userId ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={undefined}
                            alt={url.userName || "User"}
                          />
                          <AvatarFallback className="text-xs">
                            {url.userName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {url.userName || url.userEmail || "Unknown User"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Anonymous
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(url.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => copyToClipboard(url.id, url.shortCode)}
                        >
                          Copy Short URL
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Original URL
                          </a>
                        </DropdownMenuItem>
                        {url.flagged && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-green-600 dark:text-green-400"
                              onClick={() =>
                                handleManageFlaggedUrl(url.id, "approve")
                              }
                              disabled={isManagingUrl}
                            >
                              {isManagingUrl && (
                                <Loader2 className="size-4 mr-1 animate-spin" />
                              )}
                              <CheckCircle className="size-4 mr-1 text-green-700" />
                              Approve URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() =>
                                handleManageFlaggedUrl(url.id, "delete")
                              }
                              disabled={isManagingUrl}
                            >
                              {isManagingUrl && (
                                <Loader2 className="size-4 mr-1 animate-spin" />
                              )}
                              <Ban className="size-4 mr-1 text-red-700" />
                              Delete URL
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPage > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPaginationUrl(Math.max(1, page - 1))}
              />
            </PaginationItem>

            {getPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={createPaginationUrl(Math.min(totalPage, page + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-xs text-muted-foreground">
        Showing {urls.length} of {total} URLs.
        {search && ` Search results for "${search}".`}
      </div>
    </div>
  );
};
