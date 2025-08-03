'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type UrlPreviewSkeletonProps = {
  className?: string;
};

export const UrlPreviewSkeleton = ({ className }: UrlPreviewSkeletonProps) => {
  return (
    <Card className={cn('border-border/50', className)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};