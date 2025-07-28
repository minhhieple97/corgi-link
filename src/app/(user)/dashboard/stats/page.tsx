import { StatsContent } from '@/features/dashboard/components/stats-content';
import { getUserUrlsForStats } from '@/features/urls/queries/get-user-urls-for-stats';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Statistics | CorgiLink',
  description: 'View your URL statistics and analytics',
};

export default async function StatsPage() {
  const user = await currentUser();

  const urls = await getUserUrlsForStats({
    userId: user!.id,
  });

  return <StatsContent urls={urls} />;
}
