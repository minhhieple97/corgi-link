import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { biolinkService } from '@/features/biolink';
import {
  ProfileHeader,
  SocialLinks,
  ProjectsSection,
  ProfileFooter,
  ProfileLayout,
  ComponentsSection,
} from '@/features/biolink/components';

type PublicProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({ params }: PublicProfilePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const profile = await biolinkService.getPublicProfile(slug);

  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
    };
  }

  return {
    title: profile.metaTitle || profile.title || `${slug}'s Profile`,
    description: profile.metaDescription || profile.bio || 'Personal landing page',
    openGraph: {
      title: profile.title || `${slug}'s Profile`,
      description: profile.bio || 'Personal landing page',
      images: profile.avatar ? [{ url: profile.avatar }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.title || `${slug}'s Profile`,
      description: profile.bio || 'Personal landing page',
      images: profile.avatar ? [profile.avatar] : [],
    },
  };
};

const PublicProfileContent = async ({ slug }: { slug: string }) => {
  const profile = await biolinkService.getPublicProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <ProfileLayout profile={profile}>
      <ProfileHeader profile={profile} />
      <SocialLinks socialLinks={profile.socialLinks} />
      <ComponentsSection components={profile.components} />
      <ProjectsSection projects={profile.projects} profile={profile} />
      <ProfileFooter />
    </ProfileLayout>
  );
};

const PublicProfilePage = async ({ params }: PublicProfilePageProps) => {
  const { slug } = await params;

  return <PublicProfileContent slug={slug} />;
};

export default PublicProfilePage; 