'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { ProfileHeader } from './profile-header';
import { PreviewModeToggle } from './preview-mode-toggle';
import { ActionButtons } from './action-buttons';
import type { BiolinkProfileWithRelations } from '../../types';

type ToolbarProps = {
  profile: BiolinkProfileWithRelations;
  previewMode: 'mobile' | 'desktop';
  onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPreviewing: boolean;
  isPublishing: boolean;
};

export const Toolbar = ({
  profile,
  previewMode,
  onPreviewModeChange,
  onSave,
  onPreview,
  onPublish,
  isSaving,
  isPreviewing,
  isPublishing,
}: ToolbarProps) => {
  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <ProfileHeader profile={profile} />
          
          <div className="flex items-center gap-2">
            <PreviewModeToggle 
              previewMode={previewMode}
              onPreviewModeChange={onPreviewModeChange}
            />
            
            <ActionButtons
              profile={profile}
              onSave={onSave}
              onPreview={onPreview}
              onPublish={onPublish}
              isSaving={isSaving}
              isPreviewing={isPreviewing}
              isPublishing={isPublishing}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};