'use client';

import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BiolinkProfileWithRelations } from '../../types';

type ProfileHeaderProps = {
  profile: BiolinkProfileWithRelations;
};

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <CardTitle className="text-xl font-bold">
          {profile.title || 'Untitled Profile'}
        </CardTitle>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={profile.status === 'public' ? 'default' : 'secondary'}>
            {profile.status === 'public' ? 'Published' : 'Draft'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            /{profile.slug}
          </span>
        </div>
      </div>
    </div>
  );
};