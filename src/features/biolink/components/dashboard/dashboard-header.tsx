'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/routes';

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">My BioLink Profiles</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your personal landing pages
        </p>
      </div>
      <Button asChild>
        <Link href={routes.biolink.create}>
          <Plus className="size-4 mr-2" />
          Create Profile
        </Link>
      </Button>
    </div>
  );
};
