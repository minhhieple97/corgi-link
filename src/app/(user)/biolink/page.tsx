import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { biolinkService } from '@/features/biolink';
import { BiolinkDashboard } from '@/features/biolink/components/dashboard';

import { routes } from '@/routes';

const BiolinkDashboardContent = async () => {
  const user = await currentUser();

  if (!user) {
    redirect(routes.home);
  }

  const { profiles } = await biolinkService.getUserProfiles(user.id);

  return <BiolinkDashboard profiles={profiles} />;
};

export default function BiolinkDashboardPage() {
  return <BiolinkDashboardContent />;
}
