'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BiolinkProfile } from '@/features/biolink/types';

type StatsSectionProps = {
  profiles: BiolinkProfile[];
};

export const StatsSection = ({ profiles }: StatsSectionProps) => {
  if (profiles.length === 0) {
    return null;
  }

  const publishedCount = profiles.filter((p) => p.status === 'public').length;

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profiles.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Published
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publishedCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};
