import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserUrlsTable, UserUrlsTableSkeleton } from '@/features/urls/components';
import { PaginationUrls } from '@/components/shared/pagination-urls';
import type { IUrl, PaginationInfo } from '@/features/urls/types';

type UserUrlsCardProps = {
  urlsPromise: Promise<{ urls: IUrl[]; pagination: PaginationInfo }>;
  currentPage: number;
};

export const UserUrlsCard = ({ urlsPromise, currentPage }: UserUrlsCardProps) => {
  return (
    <Card className="shadow-sm border-dashed border-border/50 w-full overflow-hidden">
      <CardHeader className="pb-3 lg:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg lg:text-xl">Your URLs</CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              Manage and track your shortened URLs.
            </CardDescription>
          </div>
          <Suspense fallback={<div className="hidden sm:block" />}>
            <PaginationWrapper urlsPromise={urlsPromise} />
          </Suspense>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0 lg:px-6">
        <div className="px-4 lg:px-0">
          <Suspense fallback={<UserUrlsTableSkeleton />}>
            <UserUrlsTable key={`page-${currentPage}`} urlsPromise={urlsPromise} currentPage={currentPage} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
};

async function PaginationWrapper({
  urlsPromise,
}: {
  urlsPromise: Promise<{ urls: IUrl[]; pagination: PaginationInfo }>;
}) {
  const { pagination } = await urlsPromise;
  return <PaginationUrls pagination={pagination} className="hidden sm:block" />;
} 