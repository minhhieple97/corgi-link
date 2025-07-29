'use client';

import React from 'react';
import { Toolbar } from './toolbar';
import { BuilderInterface } from './builder-interface';
import { StatusBar } from './status-bar';
import { usePageBuilder } from '../../hooks/use-page-builder';
import type { BiolinkProfileWithRelations } from '../../types';

type PageBuilderProps = {
  profile: BiolinkProfileWithRelations;
};

export const PageBuilder = ({ profile }: PageBuilderProps) => {
  const {
    previewMode,
    setPreviewMode,
    handleSave,
    handlePreview,
    handlePublish,
    isSaving,
    isPreviewing,
    isPublishing,
  } = usePageBuilder({ profile });

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        profile={profile}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        onSave={handleSave}
        onPreview={handlePreview}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPreviewing={isPreviewing}
        isPublishing={isPublishing}
      />
      
      <BuilderInterface />
      
      <StatusBar profile={profile} />
    </div>
  );
};