'use client';

import React from 'react';
import { useAction } from 'next-safe-action/hooks';
import { DragProvider } from './drag-context';
import { ComponentPalette } from './component-palette';
import { CanvasArea } from './canvas-area';
import { PropertyEditor } from './property-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Share, Settings, Smartphone, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import type { BiolinkProfileWithRelations } from '../../types';
import { 
  saveBiolinkVersionAction, 
  previewBiolinkProfileAction, 
  publishBiolinkProfileAction 
} from '../../actions';

type PageBuilderProps = {
  profile: BiolinkProfileWithRelations;
};

export const PageBuilder = ({ profile }: PageBuilderProps) => {
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top toolbar */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-xl font-bold">
                  {profile.title || 'Untitled Profile'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={profile.status === 'public' ? 'default' : 'secondary'}>
                    {profile.status === 'public' ? 'Published' : 'Draft'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    /{profile.slug}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Preview mode toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="h-8 px-3"
                >
                  <Smartphone className="size-4 mr-1" />
                  Mobile
                </Button>
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="h-8 px-3"
                >
                  <Monitor className="size-4 mr-1" />
                  Desktop
                </Button>
              </div>

              {/* Action buttons */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="size-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview}
                disabled={isPreviewing}
              >
                <Eye className="size-4 mr-1" />
                {isPreviewing ? 'Opening...' : 'Preview'}
              </Button>

              <Button 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublishing}
              >
                <Share className="size-4 mr-1" />
                {isPublishing ? 'Publishing...' : (profile.status === 'public' ? 'Unpublish' : 'Publish')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main builder interface */}
      <div className="flex-1 overflow-hidden">
        <DragProvider>
          <div className="flex h-full">
            {/* Left panel - Component palette */}
            <div className="border-r bg-background">
              <ComponentPalette />
            </div>

            {/* Center panel - Canvas */}
            <div className="flex-1 min-w-0">
              <CanvasArea />
            </div>

            {/* Right panel - Property editor */}
            <div className="border-l bg-background">
              <PropertyEditor />
            </div>
          </div>
        </DragProvider>
      </div>

      {/* Bottom status bar */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="py-2 px-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Last saved: 2 minutes ago</span>
              <span>•</span>
              <span>{profile.components?.length || 0} components</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="size-4" />
              <span>Ready to build</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};