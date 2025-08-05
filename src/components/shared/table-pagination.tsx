"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationInfo } from "@/features/urls/types";

type TablePaginationProps = {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
};

export const TablePagination = ({
  pagination,
  onPageChange,
  className,
}: TablePaginationProps) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          {pagination.hasPreviousPage && (
            <PaginationItem>
              <PaginationPrevious
                onClick={e => {
                  e.preventDefault();
                  onPageChange(pagination.page - 1);
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
                    onPageChange(pageNum);
                  }}
                  isActive={pageNum === pagination.page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {pagination.hasNextPage && (
            <PaginationItem>
              <PaginationNext
                onClick={e => {
                  e.preventDefault();
                  onPageChange(pagination.page + 1);
                }}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
