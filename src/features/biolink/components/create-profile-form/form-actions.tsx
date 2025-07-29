'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/routes';

type FormActionsProps = {
  isPending: boolean;
  isValid: boolean;
};

export const FormActions = ({ isPending, isValid }: FormActionsProps) => {
  return (
    <div className="flex items-center gap-4 mt-8">
      <Button
        type="submit"
        disabled={isPending || !isValid}
        className="flex-1"
      >
        {isPending ? (
          <>
            <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Creating...
          </>
        ) : (
          <>
            <Globe className="size-4 mr-2" />
            Create Profile
          </>
        )}
      </Button>

      <Button variant="outline" asChild>
        <Link href={routes.biolink.root}>Cancel</Link>
      </Button>
    </div>
  );
};
