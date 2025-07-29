'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

type BasicInfoSectionProps = {
  register: UseFormRegister<CreateBiolinkProfileInput>;
  errors: FieldErrors<CreateBiolinkProfileInput>;
  watch: UseFormWatch<CreateBiolinkProfileInput>;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugBlur: () => void;
  slugAvailable: boolean | null;
  isValidatingSlug: boolean;
};

export const BasicInfoSection = ({
  register,
  errors,
  watch,
  onTitleChange,
  onSlugChange,
  onSlugBlur,
  slugAvailable,
  isValidatingSlug,
}: BasicInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Profile Title</Label>
          <Input
            id="title"
            {...register('title')}
            onChange={onTitleChange}
            placeholder="John Doe - Developer"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Custom URL</Label>
          <div className="flex">
            <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
              yoursite.com/
            </div>
            <div className="relative flex-1">
              <Input
                id="slug"
                {...register('slug')}
                onChange={onSlugChange}
                onBlur={onSlugBlur}
                placeholder="your-name"
                className={`rounded-l-none ${
                  errors.slug ? 'border-destructive' : ''
                }`}
              />
              {slugAvailable === true && !isValidatingSlug && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-green-500" />
              )}
              {isValidatingSlug && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
          {errors.slug && (
            <p className="text-sm text-destructive">
              {errors.slug.message}
            </p>
          )}
          {slugAvailable === false && !isValidatingSlug && (
            <p className="text-sm text-destructive">
              This URL is already taken
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Tell visitors about yourself..."
            rows={3}
            className={errors.bio ? 'border-destructive' : ''}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="career">Career/Role</Label>
            <Input
              id="career"
              {...register('career')}
              placeholder="Software Developer"
              className={errors.career ? 'border-destructive' : ''}
            />
            {errors.career && (
              <p className="text-sm text-destructive">
                {errors.career.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="San Francisco, CA"
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
