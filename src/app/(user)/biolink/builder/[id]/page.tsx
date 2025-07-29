import { currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { PageBuilder } from '@/features/biolink/components/page-builder/page-builder';
import { biolinkService } from '@/features/biolink';
import { routes } from '@/routes';

type PageBuilderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const PageBuilderContent = async ({ profileId }: { profileId: number }) => {
  const user = await currentUser();

  const profile = await biolinkService.getProfileById(profileId);

  if (!profile) {
    notFound();
  }

  if (!user) {
    redirect(routes.home);
  }

  if (profile.userId !== user.id) {
    redirect(routes.biolink.root);
  }

  return <PageBuilder profile={profile} />;
};

const PageBuilderPage = async ({ params }: PageBuilderPageProps) => {
  const { id } = await params;
  const profileId = parseInt(id);

  if (isNaN(profileId)) {
    notFound();
  }

  return <PageBuilderContent profileId={profileId} />;
};

export default PageBuilderPage;
