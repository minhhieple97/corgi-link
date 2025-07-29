'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { UseFormWatch } from 'react-hook-form';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

type PreviewSectionProps = {
  watch: UseFormWatch<CreateBiolinkProfileInput>;
};

export const PreviewSection = ({ watch }: PreviewSectionProps) => {
  const title = watch('title');
  const career = watch('career');
  const location = watch('location');
  const bio = watch('bio');
  const backgroundColor = watch('backgroundColor');
  const textColor = watch('textColor');
  const accentColor = watch('accentColor');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="max-w-sm mx-auto p-6 rounded-lg border text-center"
          style={{
            backgroundColor: backgroundColor || '#ffffff',
            color: textColor || '#000000',
          }}
        >
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">
            {title || 'Your Name'}
          </h3>
          {career && (
            <p className="text-sm opacity-80 mb-2">{career}</p>
          )}
          {location && (
            <p className="text-xs opacity-60 mb-4">{location}</p>
          )}
          {bio && (
            <p className="text-sm opacity-90 mb-4">{bio}</p>
          )}
          <Button
            size="sm"
            style={{ backgroundColor: accentColor || '#3b82f6' }}
            disabled
          >
            Sample Button
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
