import { EditPageHeader } from './edit-page-header';
import { EditProfileForm } from '../edit-profile-form';
import type { BiolinkProfileWithRelations } from '@/features/biolink/types';

type EditProfilePageProps = {
  profile: BiolinkProfileWithRelations;
};

export const EditProfilePage = ({ profile }: EditProfilePageProps) => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <EditPageHeader profile={profile} />
      <EditProfileForm profile={profile} />
    </div>
  );
};
