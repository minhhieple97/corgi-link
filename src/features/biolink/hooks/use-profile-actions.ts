'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  deleteBiolinkProfileAction,
  duplicateBiolinkProfileAction,
} from '@/features/biolink';
import { routes } from '@/routes';
import type { BiolinkProfile } from '@/features/biolink/types';

export const useProfileActions = () => {
  const router = useRouter();

  const copyProfile = useCallback(async (profile: BiolinkProfile) => {
    try {
      // Copy profile URL to clipboard
      const profileUrl = `${window.location.origin}${routes.profile(
        profile.slug,
      )}`;
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  }, []);

  const duplicateProfile = useCallback(
    async (profile: BiolinkProfile) => {
      try {
        const newSlug = `${profile.slug}-copy-${Date.now()}`;
        const result = await duplicateBiolinkProfileAction({
          profileId: profile.id,
          newSlug,
        });

        if (result?.data?.profile) {
          toast.success('Profile duplicated successfully!');
          router.refresh();
        } else {
          toast.error('Failed to duplicate profile');
        }
      } catch (error) {
        console.error('Failed to duplicate profile:', error);
        toast.error('Failed to duplicate profile');
      }
    },
    [router],
  );

  const deleteProfile = useCallback(
    async (profile: BiolinkProfile) => {
      if (
        !confirm(
          `Are you sure you want to delete "${
            profile.title || 'Untitled Profile'
          }"? This action cannot be undone.`,
        )
      ) {
        return;
      }

      try {
        const result = await deleteBiolinkProfileAction({ id: profile.id });

        if (result?.data?.success) {
          toast.success('Profile deleted successfully!');
          router.refresh();
        } else {
          toast.error('Failed to delete profile');
        }
      } catch (error) {
        console.error('Failed to delete profile:', error);
        toast.error('Failed to delete profile');
      }
    },
    [router],
  );

  return {
    copyProfile,
    duplicateProfile,
    deleteProfile,
  };
};
