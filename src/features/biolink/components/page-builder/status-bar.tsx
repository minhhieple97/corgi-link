'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import type { BiolinkProfileWithRelations } from '../../types';

type StatusBarProps = {
  profile: BiolinkProfileWithRelations;
};

export const StatusBar = ({ profile }: StatusBarProps) => {
  return (
    <Card className="rounded-none border-x-0 border-b-0">
      <CardContent className="py-2 px-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last saved: 2 minutes ago</span>
            <span>•</span>
            <span>{profile.components?.length || 0} components</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="size-4" />
            <span>Ready to build</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};