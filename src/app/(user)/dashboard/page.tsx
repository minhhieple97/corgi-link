import { getUserUrls } from '@/features/urls/queries';
import { isAdmin } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { env } from '@/env';
import { PAGINATION } from '@/constants';
import { createSearchParamsCache, parseAsInteger } from 'nuqs/server';
import {
  DashboardHeader,
  CreateUrlCard,
  UserUrlsCard,
  AdminToolsLink,
} from '@/components/dashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | ShortLink',
  description: 'Dashboard page',
};

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE),
});

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await currentUser();
  const { page } = searchParamsCache.parse(await searchParams);

  const urlsPromise = getUserUrls({
    userId: user!.id,
    page,
    limit: PAGINATION.DEFAULT_LIMIT,
  });

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      <DashboardHeader title="Dashboard" description="Create and manage your shortened URLs" />

      <div className="grid gap-4 lg:gap-6">
        <CreateUrlCard />

        <UserUrlsCard urlsPromise={urlsPromise} currentPage={page} />

        {env.NODE_ENV === 'development' && user && isAdmin(user) && <AdminToolsLink />}
      </div>
    </div>
  );
}
