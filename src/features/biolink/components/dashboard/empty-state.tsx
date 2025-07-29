'use client';

import Link from 'next/link';
import { Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/routes';

export const EmptyState = () => {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Globe className="size-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first BioLink profile to share all your important
            links in one beautiful page.
          </p>
          <Button asChild>
            <Link href={routes.biolink.create}>
              <Plus className="size-4 mr-2" />
              Create Your First Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
