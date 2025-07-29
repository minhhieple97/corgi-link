'use client';

import { useMemo } from 'react';
import type { BiolinkProfile } from '@/features/biolink/types';

type UseBiolinkDashboardProps = {
  profiles: BiolinkProfile[];
};

export const useBiolinkDashboard = ({ profiles }: UseBiolinkDashboardProps) => {
  const stats = useMemo(() => {
    const totalProfiles = profiles.length;
    const publishedProfiles = profiles.filter(
      (p) => p.status === 'public',
    ).length;
    const draftProfiles = totalProfiles - publishedProfiles;

    return {
      total: totalProfiles,
      published: publishedProfiles,
      drafts: draftProfiles,
    };
  }, [profiles]);

  const sortedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      // Sort by updated date, most recent first
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [profiles]);

  const hasProfiles = profiles.length > 0;

  return {
    profiles: sortedProfiles,
    stats,
    hasProfiles,
  };
};
