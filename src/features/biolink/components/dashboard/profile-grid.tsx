'use client';

import { ProfileCard } from './profile-card';
import { EmptyState } from './empty-state';
import type { BiolinkProfile } from '@/features/biolink/types';

type ProfileGridProps = {
  profiles: BiolinkProfile[];
  onCopyProfile?: (profile: BiolinkProfile) => void;
  onDeleteProfile?: (profile: BiolinkProfile) => void;
};

export const ProfileGrid = ({ 
  profiles, 
  onCopyProfile, 
  onDeleteProfile 
}: ProfileGridProps) => {
  if (profiles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onCopy={onCopyProfile}
          onDelete={onDeleteProfile}
        />
      ))}
    </div>
  );
};
