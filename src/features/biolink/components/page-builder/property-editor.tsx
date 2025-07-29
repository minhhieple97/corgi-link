'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, Settings } from 'lucide-react';
import { useDragContext } from './drag-context';
import type {
  BiolinkComponent,
  ButtonComponentSettings,
  TextComponentSettings,
  ImageComponentSettings,
  LinkComponentSettings,
  ComponentSettings,
} from '../../types';

export const PropertyEditor = () => {
  const { state, updateComponent, selectComponent } = useDragContext();
  const [localComponent, setLocalComponent] = useState<BiolinkComponent | null>(
    null,
  );

  useEffect(() => {
    setLocalComponent(state.selectedComponent);
  }, [state.selectedComponent]);

  if (!localComponent) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="size-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-lg font-medium mb-2">
              No component selected
            </div>
            <div className="text-sm">
              Click a component to edit its properties
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const updateLocalComponent = (updates: Partial<BiolinkComponent>) => {
    const updated = { ...localComponent, ...updates };
    setLocalComponent(updated);
    updateComponent(updated.id, updates);
  };

  const getSettings = <T,>(defaultSettings: T): T => {
    if (!localComponent.settings) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(localComponent.settings) };
    } catch {
      return defaultSettings;
    }
  };

  const updateSettings = (newSettings: ComponentSettings) => {
    updateLocalComponent({
      settings: JSON.stringify(newSettings),
    });
  };

  const renderGeneralProperties = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={localComponent.title || ''}
          onChange={(e) => updateLocalComponent({ title: e.target.value })}
          placeholder="Enter title..."
        />
      </div>

      {['text', 'projects', 'contact-form'].includes(localComponent.type) && (
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={localComponent.content || ''}
            onChange={(e) => updateLocalComponent({ content: e.target.value })}
            placeholder="Enter content..."
            rows={4}
          />
        </div>
      )}

      {['button', 'link'].includes(localComponent.type) && (
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={localComponent.url || ''}
            onChange={(e) => updateLocalComponent({ url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      )}

      {localComponent.type === 'image' && (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={localComponent.imageUrl || ''}
            onChange={(e) => updateLocalComponent({ imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="visibility">Visible</Label>
        <Switch
          id="visibility"
          checked={localComponent.isVisible}
          onCheckedChange={(checked) =>
            updateLocalComponent({ isVisible: checked })
          }
        />
      </div>
    </div>
  );

  const renderStyleProperties = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="backgroundColor"
            type="color"
            value={localComponent.backgroundColor || '#ffffff'}
            onChange={(e) =>
              updateLocalComponent({ backgroundColor: e.target.value })
            }
            className="w-16 h-10 p-1"
          />
          <Input
            value={localComponent.backgroundColor || ''}
            onChange={(e) =>
              updateLocalComponent({ backgroundColor: e.target.value })
            }
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Text Color</Label>
        <div className="flex gap-2">
          <Input
            id="textColor"
            type="color"
            value={localComponent.textColor || '#000000'}
            onChange={(e) =>
              updateLocalComponent({ textColor: e.target.value })
            }
            className="w-16 h-10 p-1"
          />
          <Input
            value={localComponent.textColor || ''}
            onChange={(e) =>
              updateLocalComponent({ textColor: e.target.value })
            }
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>

      {['button', 'image'].includes(localComponent.type) && (
        <div className="space-y-2">
          <Label htmlFor="borderColor">Border Color</Label>
          <div className="flex gap-2">
            <Input
              id="borderColor"
              type="color"
              value={localComponent.borderColor || '#e5e5e5'}
              onChange={(e) =>
                updateLocalComponent({ borderColor: e.target.value })
              }
              className="w-16 h-10 p-1"
            />
            <Input
              value={localComponent.borderColor || ''}
              onChange={(e) =>
                updateLocalComponent({ borderColor: e.target.value })
              }
              placeholder="#e5e5e5"
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderComponentSpecificSettings = () => {
    switch (localComponent.type) {
      case 'button': {
        const settings = getSettings<ButtonComponentSettings>({
          buttonStyle: 'filled',
          borderRadius: 8,
          icon: undefined,
        });

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Button Style</Label>
              <Select
                value={settings.buttonStyle}
                onValueChange={(value) =>
                  updateSettings({ ...settings, buttonStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="outlined">Outlined</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="borderRadius"
                  type="range"
                  min="0"
                  max="50"
                  value={settings.borderRadius}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      borderRadius: Number(e.target.value),
                    })
                  }
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {settings.borderRadius}px
                </span>
              </div>
            </div>
          </div>
        );
      }

      case 'text': {
        const settings = getSettings<TextComponentSettings>({
          fontSize: 'base',
          fontWeight: 'normal',
          textAlign: 'left',
        });

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) =>
                  updateSettings({ ...settings, fontSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="base">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="2xl">2X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={settings.fontWeight}
                onValueChange={(value) =>
                  updateSettings({ ...settings, fontWeight: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select
                value={settings.textAlign}
                onValueChange={(value) =>
                  updateSettings({ ...settings, textAlign: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      case 'image': {
        const settings = getSettings<ImageComponentSettings>({
          width: 200,
          height: 200,
          borderRadius: 8,
          alt: '',
        });

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min="50"
                max="500"
                value={settings.width}
                onChange={(e) =>
                  updateSettings({ ...settings, width: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min="50"
                max="500"
                value={settings.height}
                onChange={(e) =>
                  updateSettings({
                    ...settings,
                    height: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={settings.alt}
                onChange={(e) =>
                  updateSettings({ ...settings, alt: e.target.value })
                }
                placeholder="Describe the image..."
              />
            </div>
          </div>
        );
      }

      case 'link': {
        const settings = getSettings<LinkComponentSettings>({
          showIcon: true,
          openInNewTab: true,
          underline: false,
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showIcon">Show Icon</Label>
              <Switch
                id="showIcon"
                checked={settings.showIcon}
                onCheckedChange={(checked) =>
                  updateSettings({ ...settings, showIcon: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="openInNewTab">Open in New Tab</Label>
              <Switch
                id="openInNewTab"
                checked={settings.openInNewTab}
                onCheckedChange={(checked) =>
                  updateSettings({ ...settings, openInNewTab: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="underline">Underline</Label>
              <Switch
                id="underline"
                checked={settings.underline}
                onCheckedChange={(checked) =>
                  updateSettings({ ...settings, underline: checked })
                }
              />
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">
              No specific settings for this component type
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-80 h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="size-5" />
            Properties
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectComponent(null)}
          >
            ✕
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Editing: {localComponent.type}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="text-xs">
              <Type className="size-3 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="size-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="size-3 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            {renderGeneralProperties()}
          </TabsContent>

          <TabsContent value="style" className="mt-4">
            {renderStyleProperties()}
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            {renderComponentSpecificSettings()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
