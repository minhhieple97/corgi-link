import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { PageBuilder } from '@/features/biolink/components/page-builder/page-builder';
import { biolinkService } from '@/features/biolink';
import { routes } from '@/routes';

type PageBuilderPageProps = {
  params: {
    id: string;
  };
};

const PageBuilderContent = async ({ profileId }: { profileId: number }) => {
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

  const handleSave = async () => {
    'use server';
    // This would be implemented to save the current state
    console.log('Saving profile...');
  };

  const handlePreview = async () => {
    'use server';
    // This would open a preview of the profile
    console.log('Opening preview...');
  };

  const handlePublish = async () => {
    'use server';
    // This would publish the profile
    console.log('Publishing profile...');
  };

  return (
    <PageBuilder
      profile={profile}
      onSave={handleSave}
      onPreview={handlePreview}
      onPublish={handlePublish}
    />
  );
};

const PageBuilderPage = async ({ params }: PageBuilderPageProps) => {
  const profileId = parseInt(await params.id);

  if (isNaN(profileId)) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading page builder...</p>
        </div>
      </div>
    }>
      <PageBuilderContent profileId={profileId} />
    </Suspense>
  );
};

export default PageBuilderPage; 