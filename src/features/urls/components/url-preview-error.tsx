'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type UrlPreviewErrorProps = {
  error: string;
  className?: string;
};

export const UrlPreviewError = ({ error, className }: UrlPreviewErrorProps) => {
  return (
    <Card className={cn('border-destructive/20 bg-destructive/5', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive font-medium">Unable to load preview</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{error}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};