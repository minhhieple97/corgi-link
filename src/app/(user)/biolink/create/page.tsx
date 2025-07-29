'use client';

import {
  CreateProfileForm,
  PageHeader,
} from '@/features/biolink/components/create-profile-form';

export const CreateBiolinkProfilePage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <PageHeader />
      <CreateProfileForm />
    </div>
  );
};

export default CreateBiolinkProfilePage;
