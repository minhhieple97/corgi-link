'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/routes';

export const PageHeader = () => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={routes.biolink.root}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Profiles
        </Link>
      </Button>

      <h1 className="text-3xl font-bold">Create New Profile</h1>
      <p className="text-muted-foreground mt-2">
        Set up your personal landing page to share all your important links
      </p>
    </div>
  );
};
