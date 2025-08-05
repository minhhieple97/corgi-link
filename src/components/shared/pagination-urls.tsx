"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { PAGINATION } from "@/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationUrlsProps = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  className?: string;
};

export function PaginationUrls({ pagination, className }: PaginationUrlsProps) {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
      shallow: false,
    })
  );

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) {
      return;
    }
    await setCurrentPage(newPage);
  };

  if (pagination.totalPages <= 1) {
    return null;
  }

  const activePage = currentPage ?? pagination.page;

  const canGoPrevious = activePage > 1;
  const canGoNext = activePage < pagination.totalPages;

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          {canGoPrevious && (
            <PaginationItem>
              <PaginationPrevious
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(activePage - 1);
                }}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            pageNum => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={e => {
                    e.preventDefault();
                    handlePageChange(pageNum);
                  }}
                  isActive={pageNum === activePage}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {canGoNext && (
            <PaginationItem>
              <PaginationNext
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(activePage + 1);
                }}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
