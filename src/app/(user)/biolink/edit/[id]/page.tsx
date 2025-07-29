import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { biolinkService } from '@/features/biolink';
import { EditProfilePage } from '@/features/biolink/components/edit-profile';
import { routes } from '@/routes';

type EditProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditProfileContent = async ({ profileId }: { profileId: number }) => {
  const user = await currentUser();

  if (!user) {
    redirect(routes.home);
  }

  const profile = await biolinkService.getProfileById(profileId);

  if (!profile) {
    notFound();
  }

  if (profile.userId !== user.id) {
    redirect(routes.biolink.root);
  }

  return <EditProfilePage profile={profile} />;
};

export default async function EditBiolinkProfilePage({
  params,
}: EditProfilePageProps) {
  const { id } = await params;
  const profileId = parseInt(id);

  if (isNaN(profileId)) {
    notFound();
  }

  return <EditProfileContent profileId={profileId} />;
}
