'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, Share } from 'lucide-react';
import type { BiolinkProfileWithRelations } from '../../types';

type ActionButtonsProps = {
  profile: BiolinkProfileWithRelations;
  onSave: () => void;
  onPreview: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPreviewing: boolean;
  isPublishing: boolean;
};

export const ActionButtons = ({
  profile,
  onSave,
  onPreview,
  onPublish,
  isSaving,
  isPreviewing,
  isPublishing,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className="size-4 mr-1" />
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPreview}
        disabled={isPreviewing}
      >
        <Eye className="size-4 mr-1" />
        {isPreviewing ? 'Opening...' : 'Preview'}
      </Button>

      <Button 
        size="sm" 
        onClick={onPublish}
        disabled={isPublishing}
      >
        <Share className="size-4 mr-1" />
        {isPublishing ? 'Publishing...' : (profile.status === 'public' ? 'Unpublish' : 'Publish')}
      </Button>
    </div>
  );
};