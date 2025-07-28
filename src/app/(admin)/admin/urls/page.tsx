import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PAGINATION } from '@/constants';
import { UrlsTable } from '@/features/admin/components';
import { UrlFilter } from '@/features/admin/components/url-filter';
import { UrlSearch } from '@/features/admin/components/url-search';
import { getAllUrls } from '@/features/admin/queries/get-all-urls';
import type { UrlWithUser } from '@/features/admin/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Management | Admin | CorgiLink',
  description: 'Manage URLs in the CorgiLink application',
};

export default async function AdminUrlsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search || '';
  const sortBy = (params.sortBy || 'createdAt') as
    | 'originalUrl'
    | 'shortCode'
    | 'createdAt'
    | 'clicks'
    | 'userName';
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc';
  const filter = (params.filter || 'all') as
    | 'all'
    | 'flagged'
    | 'security'
    | 'inappropriate'
    | 'other';

  const getHighlightStyle = () => {
    switch (filter) {
      case 'security':
        return 'security';
      case 'inappropriate':
        return 'inappropriate';
      case 'other':
        return 'other';
      default:
        return 'none';
    }
  };

  const response = await getAllUrls({
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
    search,
    sortBy,
    sortOrder,
    filter,
  });

  const { urls: rawUrls, total } = response;

  const urls: UrlWithUser[] = rawUrls.map((url) => ({
    ...url,
    createdAt: url.createdAt.toISOString(),
    userId: url.userId?.toString() || null,
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">URL Management</h1>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>URLs</CardTitle>
                <CardDescription>View and manage all URLs in the system.</CardDescription>
              </div>
              <UrlSearch initialSearch={search} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UrlFilter initialFilter={filter} />
              <UrlsTable urls={urls} total={total} highlightStyle={getHighlightStyle()} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
