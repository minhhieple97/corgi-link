import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/routes';
import type { BiolinkProfileWithRelations } from '@/features/biolink/types';

type EditPageHeaderProps = {
  profile: BiolinkProfileWithRelations;
};

export const EditPageHeader = ({ profile }: EditPageHeaderProps) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={routes.biolink.root}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Profiles
        </Link>
      </Button>

      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <p className="text-muted-foreground mt-2">
        Update your {profile.title || 'profile'} settings and appearance
      </p>
    </div>
  );
};
