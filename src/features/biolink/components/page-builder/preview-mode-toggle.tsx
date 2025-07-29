'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor } from 'lucide-react';

type PreviewModeToggleProps = {
  previewMode: 'mobile' | 'desktop';
  onPreviewModeChange: (mode: 'mobile' | 'desktop') => void;
};

export const PreviewModeToggle = ({ previewMode, onPreviewModeChange }: PreviewModeToggleProps) => {
  return (
    <div className="flex items-center border rounded-lg p-1">
      <Button
        variant={previewMode === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPreviewModeChange('mobile')}
        className="h-8 px-3"
      >
        <Smartphone className="size-4 mr-1" />
        Mobile
      </Button>
      <Button
        variant={previewMode === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPreviewModeChange('desktop')}
        className="h-8 px-3"
      >
        <Monitor className="size-4 mr-1" />
        Desktop
      </Button>
    </div>
  );
};