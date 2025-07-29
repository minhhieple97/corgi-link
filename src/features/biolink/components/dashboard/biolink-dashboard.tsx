'use client';

import { useBiolinkDashboard, useProfileActions } from '@/features/biolink/hooks';
import { DashboardHeader } from './dashboard-header';
import { ProfileGrid } from './profile-grid';
import { StatsSection } from './stats-section';
import type { BiolinkProfile } from '@/features/biolink/types';

type BiolinkDashboardProps = {
  profiles: BiolinkProfile[];
};

export const BiolinkDashboard = ({ profiles }: BiolinkDashboardProps) => {
  const { profiles: sortedProfiles, hasProfiles } = useBiolinkDashboard({ profiles });
  const { copyProfile, deleteProfile } = useProfileActions();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <DashboardHeader />
      
      <ProfileGrid
        profiles={sortedProfiles}
        onCopyProfile={copyProfile}
        onDeleteProfile={deleteProfile}
      />

      {hasProfiles && <StatsSection profiles={sortedProfiles} />}
    </div>
  );
};
