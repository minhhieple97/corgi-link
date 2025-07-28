'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useDragContext } from './drag-context';
import { ComponentRenderer } from './component-renderer';
import type { BiolinkComponent, ComponentType } from '../../types';

export const CanvasArea = () => {
  const { state, selectComponent, deleteComponent, addComponent, endDrag } = useDragContext();
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    
    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const componentElements = e.currentTarget.querySelectorAll('[data-component-index]');
    
    let insertIndex = state.components.length;
    
    for (let i = 0; i < componentElements.length; i++) {
      const element = componentElements[i] as HTMLElement;
      const elementRect = element.getBoundingClientRect();
      const elementY = elementRect.top - rect.top;
      
      if (y < elementY + elementRect.height / 2) {
        insertIndex = i;
        break;
      }
    }
    
    setDragOverIndex(insertIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if we're leaving the canvas completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragOverIndex(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (dragData.source === 'palette') {
        // Create new component from palette
        const newComponent: Partial<BiolinkComponent> = {
          type: dragData.type as ComponentType,
          title: getDefaultTitle(dragData.type),
          content: getDefaultContent(dragData.type),
          order: dragOverIndex ?? state.components.length,
          isVisible: true,
          backgroundColor: null,
          textColor: null,
          borderColor: null,
          url: dragData.type === 'link' || dragData.type === 'button' ? 'https://' : null,
          imageUrl: null,
          settings: getDefaultSettings(dragData.type),
        };

        // Note: In real implementation, you'd call the server action here
        // For now, we'll just update local state
        addComponent(newComponent as BiolinkComponent);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    } finally {
      endDrag();
    }
  }, [dragOverIndex, state.components.length, addComponent, endDrag]);

  const handleComponentClick = (component: BiolinkComponent) => {
    selectComponent(component);
  };

  const handleDeleteComponent = (componentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(componentId);
  };

  const toggleComponentVisibility = (component: BiolinkComponent, e: React.MouseEvent) => {
    e.stopPropagation();
    // Note: In real implementation, you'd call the update action here
    console.log('Toggle visibility for component:', component.id);
  };

  const renderDropIndicator = (index: number) => {
    if (dragOverIndex === index && isDragOver) {
      return (
        <div className="h-0.5 bg-primary rounded-full mx-4 my-2 transition-all duration-200" />
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-6 bg-muted/10">
      <Card 
        className={`
          min-h-[600px] max-w-md mx-auto p-6 relative
          transition-all duration-200
          ${isDragOver ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Phone-like frame */}
        <div className="absolute inset-0 rounded-lg border-8 border-gray-800 pointer-events-none" />
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full pointer-events-none" />
        
        {/* Canvas content */}
        <div className="relative z-10 space-y-4">
          {state.components.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-lg font-medium mb-2">Start building your page</div>
              <div className="text-sm">Drag components from the left panel to get started</div>
            </div>
          ) : (
            <>
              {renderDropIndicator(0)}
              {state.components
                .sort((a, b) => a.order - b.order)
                .map((component, index) => (
                  <React.Fragment key={component.id}>
                    <div
                      data-component-index={index}
                      className={`
                        group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer
                        ${state.selectedComponent?.id === component.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-transparent hover:border-border hover:bg-accent/50'
                        }
                      `}
                      onClick={() => handleComponentClick(component)}
                    >
                      {/* Component controls */}
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-1 bg-background border rounded-md shadow-md p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 cursor-grab"
                          >
                            <GripVertical className="size-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => toggleComponentVisibility(component, e)}
                          >
                            {component.isVisible ? (
                              <Eye className="size-3" />
                            ) : (
                              <EyeOff className="size-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteComponent(component.id, e)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Component content */}
                      <ComponentRenderer component={component} isPreview={false} />
                    </div>
                    {renderDropIndicator(index + 1)}
                  </React.Fragment>
                ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

// Helper functions for default component data
const getDefaultTitle = (type: ComponentType): string => {
  switch (type) {
    case 'button': return 'Click me';
    case 'text': return 'Your text here';
    case 'link': return 'Visit my website';
    case 'social-links': return 'Follow me';
    case 'projects': return 'My Projects';
    case 'contact-form': return 'Get in touch';
    case 'divider': return '';
    case 'image': return 'Image';
    default: return 'New Component';
  }
};

const getDefaultContent = (type: ComponentType): string => {
  switch (type) {
    case 'text': return 'Add your content here...';
    case 'projects': return 'Showcase your amazing work';
    case 'contact-form': return 'Send me a message';
    default: return '';
  }
};

const getDefaultSettings = (type: ComponentType): string => {
  const defaultSettings = {
    button: { buttonStyle: 'filled', borderRadius: 8 },
    text: { fontSize: 'base', fontWeight: 'normal', textAlign: 'left' },
    image: { width: 200, height: 200, borderRadius: 8, alt: '' },
    link: { showIcon: true, openInNewTab: true, underline: false },
  };

  return JSON.stringify(defaultSettings[type as keyof typeof defaultSettings] || {});
}; 