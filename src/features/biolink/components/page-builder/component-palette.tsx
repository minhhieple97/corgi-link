'use client';

import React from 'react';
import { 
  Type, 
  MousePointer, 
  Image, 
  Link, 
  Share2, 
  Briefcase, 
  Mail, 
  Minus 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDragContext } from './drag-context';
import type { ComponentType } from '../../types';

type ComponentInfo = {
  type: ComponentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const componentTypes: ComponentInfo[] = [
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    description: 'Call-to-action button with custom styling',
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    description: 'Rich text content with formatting',
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    description: 'Upload and display images',
  },
  {
    type: 'link',
    label: 'Link',
    icon: Link,
    description: 'Simple text link to external URLs',
  },
  {
    type: 'social-links',
    label: 'Social Links',
    icon: Share2,
    description: 'Display social media profiles',
  },
  {
    type: 'projects',
    label: 'Projects',
    icon: Briefcase,
    description: 'Showcase your work and projects',
  },
  {
    type: 'contact-form',
    label: 'Contact Form',
    icon: Mail,
    description: 'Simple contact form for visitors',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    description: 'Visual separator between sections',
  },
];

export const ComponentPalette = () => {
  const { startDrag, endDrag, state } = useDragContext();

  const handleDragStart = (e: React.DragEvent, componentType: ComponentType) => {
    const dragId = `palette-${componentType}-${Date.now()}`;
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: componentType,
      source: 'palette',
      id: dragId,
    }));
    e.dataTransfer.effectAllowed = 'copy';
    startDrag(componentType, dragId);
  };

  const handleDragEnd = () => {
    endDrag();
  };

  return (
    <Card className="w-80 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Components</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag components to your page
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {componentTypes.map((component) => {
          const Icon = component.icon;
          return (
            <Button
              key={component.type}
              variant="ghost"
              className={`
                w-full justify-start p-4 h-auto cursor-grab active:cursor-grabbing
                hover:bg-accent hover:text-accent-foreground
                transition-colors duration-200
                ${state.isDragging && state.draggedComponent?.type === component.type 
                  ? 'opacity-50' : 'opacity-100'
                }
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, component.type)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-start gap-3 w-full text-left">
                <Icon className="size-5 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{component.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {component.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}; 