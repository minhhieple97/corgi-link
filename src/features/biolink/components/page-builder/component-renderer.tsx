'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Instagram,
  Facebook,
} from 'lucide-react';
import type {
  BiolinkComponent,
  ButtonComponentSettings,
  TextComponentSettings,
  ImageComponentSettings,
  LinkComponentSettings,
} from '../../types';

type ComponentRendererProps = {
  component: BiolinkComponent;
  isPreview: boolean;
};

export const ComponentRenderer = ({
  component,
  isPreview,
}: ComponentRendererProps) => {
  const getSettings = <T,>(defaultSettings: T): T => {
    if (!component.settings) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(component.settings) };
    } catch {
      return defaultSettings;
    }
  };

  const getComponentStyle = () => ({
    backgroundColor: component.backgroundColor || undefined,
    color: component.textColor || undefined,
    borderColor: component.borderColor || undefined,
  });

  switch (component.type) {
    case 'button': {
      const settings = getSettings<ButtonComponentSettings>({
        buttonStyle: 'filled',
        borderRadius: 8,
        icon: undefined,
      });

      return (
        <Button
          variant={
            settings.buttonStyle === 'filled'
              ? 'default'
              : settings.buttonStyle === 'outlined'
              ? 'outline'
              : 'ghost'
          }
          className="w-full"
          style={{
            ...getComponentStyle(),
            borderRadius: `${settings.borderRadius}px`,
          }}
          disabled={!isPreview}
        >
          {component.title}
          {isPreview && component.url && (
            <ExternalLink className="ml-2 size-4" />
          )}
        </Button>
      );
    }

    case 'text': {
      const settings = getSettings<TextComponentSettings>({
        fontSize: 'base',
        fontWeight: 'normal',
        textAlign: 'left',
      });

      const sizeMap = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      };

      const weightMap = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      };

      return (
        <div
          className={`
            ${sizeMap[settings.fontSize]} 
            ${weightMap[settings.fontWeight]}
            text-${settings.textAlign}
          `}
          style={getComponentStyle()}
        >
          {component.title && (
            <h3 className="font-semibold mb-2">{component.title}</h3>
          )}
          {component.content && (
            <div className="whitespace-pre-wrap">{component.content}</div>
          )}
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
        <div className="text-center">
          {component.title && (
            <h3 className="font-semibold mb-3">{component.title}</h3>
          )}
          <div
            className="mx-auto bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center"
            style={{
              width: `${settings.width}px`,
              height: `${settings.height}px`,
              borderRadius: `${settings.borderRadius}px`,
              ...getComponentStyle(),
            }}
          >
            {component.imageUrl ? (
              <Image
                src={component.imageUrl}
                alt={settings.alt || component.title || 'Image'}
                width={settings.width}
                height={settings.height}
                className="w-full h-full object-cover"
                style={{ borderRadius: `${settings.borderRadius}px` }}
              />
            ) : (
              <div className="text-muted-foreground text-sm">
                Click to upload image
              </div>
            )}
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
        <div className="text-center" style={getComponentStyle()}>
          <a
            href={isPreview ? component.url || '#' : '#'}
            target={isPreview && settings.openInNewTab ? '_blank' : undefined}
            rel={
              isPreview && settings.openInNewTab
                ? 'noopener noreferrer'
                : undefined
            }
            className={`
              inline-flex items-center gap-2 transition-colors
              ${settings.underline ? 'underline' : ''}
              ${isPreview ? 'hover:opacity-80' : 'pointer-events-none'}
            `}
          >
            {component.title}
            {settings.showIcon && <ExternalLink className="size-4" />}
          </a>
        </div>
      );
    }

    case 'social-links': {
      const socialPlatforms = [
        { name: 'github', icon: Github, url: 'https://github.com/username' },
        {
          name: 'linkedin',
          icon: Linkedin,
          url: 'https://linkedin.com/in/username',
        },
        { name: 'twitter', icon: Twitter, url: 'https://twitter.com/username' },
        {
          name: 'instagram',
          icon: Instagram,
          url: 'https://instagram.com/username',
        },
        {
          name: 'facebook',
          icon: Facebook,
          url: 'https://facebook.com/username',
        },
        { name: 'email', icon: Mail, url: 'mailto:email@example.com' },
      ];

      return (
        <div className="text-center" style={getComponentStyle()}>
          {component.title && (
            <h3 className="font-semibold mb-4">{component.title}</h3>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Button
                  key={platform.name}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  disabled={!isPreview}
                >
                  <Icon className="size-4" />
                </Button>
              );
            })}
          </div>
        </div>
      );
    }

    case 'projects': {
      const mockProjects = [
        {
          title: 'Project 1',
          description: 'A brief description of your amazing project',
          image: null,
          tech: ['React', 'TypeScript'],
        },
        {
          title: 'Project 2',
          description: 'Another awesome project you worked on',
          image: null,
          tech: ['Next.js', 'Tailwind'],
        },
      ];

      return (
        <div style={getComponentStyle()}>
          {component.title && (
            <h3 className="font-semibold mb-4 text-center">
              {component.title}
            </h3>
          )}
          <div className="space-y-4">
            {mockProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-secondary rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'contact-form': {
      return (
        <div style={getComponentStyle()}>
          {component.title && (
            <h3 className="font-semibold mb-4 text-center">
              {component.title}
            </h3>
          )}
          <div className="space-y-4">
            <Input placeholder="Your name" disabled={!isPreview} />
            <Input
              placeholder="Your email"
              type="email"
              disabled={!isPreview}
            />
            <Textarea
              placeholder={component.content || 'Your message'}
              rows={4}
              disabled={!isPreview}
            />
            <Button className="w-full" disabled={!isPreview}>
              Send Message
            </Button>
          </div>
        </div>
      );
    }

    case 'divider': {
      return (
        <div className="flex items-center justify-center py-4">
          <div
            className="w-full h-px bg-border"
            style={{
              backgroundColor: component.backgroundColor || undefined,
            }}
          />
        </div>
      );
    }

    default:
      return (
        <div className="p-4 border border-dashed border-muted-foreground/50 rounded-lg text-center text-muted-foreground">
          Unknown component type: {component.type}
        </div>
      );
  }
};
