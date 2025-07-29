'use client';

import React from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import type { BiolinkProfileWithRelations } from '../types';
import { 
  saveBiolinkVersionAction, 
  previewBiolinkProfileAction, 
  publishBiolinkProfileAction 
} from '../actions';

type UsePageBuilderProps = {
  profile: BiolinkProfileWithRelations;
};

export const usePageBuilder = ({ profile }: UsePageBuilderProps) => {
  const [previewMode, setPreviewMode] = React.useState<'mobile' | 'desktop'>('mobile');

  // Server actions
  const { execute: saveVersion, isExecuting: isSaving } = useAction(saveBiolinkVersionAction, {
    onSuccess: () => {
      toast.success('Profile saved successfully!');
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'Failed to save profile');
    },
  });

  const { execute: previewProfile, isExecuting: isPreviewing } = useAction(previewBiolinkProfileAction, {
    onSuccess: ({ data }) => {
      if (data?.previewUrl) {
        window.open(data.previewUrl, '_blank');
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'Failed to open preview');
    },
  });

  const { execute: publishProfile, isExecuting: isPublishing } = useAction(publishBiolinkProfileAction, {
    onSuccess: () => {
      toast.success('Profile published successfully!');
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'Failed to publish profile');
    },
  });

  const handleSave = () => {
    saveVersion({ profileId: profile.id });
  };

  const handlePreview = () => {
    previewProfile({ profileId: profile.id });
  };

  const handlePublish = () => {
    const newStatus = profile.status === 'public' ? 'draft' : 'public';
    publishProfile({ profileId: profile.id, status: newStatus });
  };

  return {
    previewMode,
    setPreviewMode,
    handleSave,
    handlePreview,
    handlePublish,
    isSaving,
    isPreviewing,
    isPublishing,
  };
};