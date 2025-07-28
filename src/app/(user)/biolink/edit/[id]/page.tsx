import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { EditProfileForm } from '@/features/biolink/components/edit-profile-form';
import { biolinkService } from '@/features/biolink';
import { routes } from '@/routes';

type EditProfilePageProps = {
  params: {
    id: string;
  };
};

const EditProfileContent = async ({ profileId }: { profileId: number }) => {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const profile = await biolinkService.getProfileById(profileId);
  
  if (!profile) {
    notFound();
  }

  // Check if user owns this profile
  if (profile.userId !== user.id) {
    redirect(routes.biolink.root);
  }

  return <EditProfileForm profile={profile} />;
};

const EditProfilePage = async ({ params }: EditProfilePageProps) => {
  const { id } = await params;
  const profileId = parseInt(id);

  if (isNaN(profileId)) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    }>
      <EditProfileContent profileId={profileId} />
    </Suspense>
  );
};

export default EditProfilePage; 