'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const CreateFormLoading = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    ))}
    <Skeleton className="h-10 w-full" />
  </div>
);

const CreateProfileForm = dynamic(
  () => import('./create-profile-form').then((mod) => ({ default: mod.CreateProfileForm })),
  {
    loading: () => <CreateFormLoading />,
    ssr: false,
  },
);

export const CreateFormClient = () => {
  return <CreateProfileForm />;
};
