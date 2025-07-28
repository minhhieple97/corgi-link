import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const UserUrlsTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] sm:w-[35%]">Original URL</TableHead>
              <TableHead className="w-[25%] sm:w-[25%]">Short URL</TableHead>
              <TableHead className="w-[8%]">Clicks</TableHead>
              <TableHead className="w-[15%] sm:w-[15%]">Expiration</TableHead>
              <TableHead className="w-[12%] sm:w-[15%]">Created</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="size-4 flex-shrink-0" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="size-8 flex-shrink-0" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <div className="hidden sm:flex gap-1">
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                    </div>
                    <div className="sm:hidden">
                      <Skeleton className="size-8" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
