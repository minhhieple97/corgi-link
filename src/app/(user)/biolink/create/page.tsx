import { PageHeader } from '@/features/biolink/components/create-profile-form';
import { CreateFormClient } from '@/features/biolink/components/create-profile-form';

export default function CreateBiolinkProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <PageHeader />
      <CreateFormClient />
    </div>
  );
}
