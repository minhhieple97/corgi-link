import Link from 'next/link';
import { routes } from '@/routes';

export const AdminToolsLink = () => {
  return (
    <div className="flex justify-center pt-2 lg:pt-4">
      <Link
        href={routes.admin.root}
        className="inline-flex items-center text-xs lg:text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
      >
        Admin Tools
      </Link>
    </div>
  );
}; 