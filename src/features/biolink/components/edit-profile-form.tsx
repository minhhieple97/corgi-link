'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/routes';
// import { updateBiolinkProfileSchema, updateBiolinkProfileAction, deleteBiolinkProfileAction } from '../actions';
import type { BiolinkProfileWithRelations, UpdateBiolinkProfileInput } from '../types';
import { updateBiolinkProfileSchema } from '../schemas';
import { deleteBiolinkProfileAction, updateBiolinkProfileAction } from '../actions';

type EditProfileFormProps = {
  profile: BiolinkProfileWithRelations;
};

export const EditProfileForm = ({ profile }: EditProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateBiolinkProfileInput>({
    resolver: zodResolver(updateBiolinkProfileSchema),
    mode: 'onChange',
    defaultValues: {
      id: profile.id,
      slug: profile.slug,
      title: profile.title || '',
      bio: profile.bio || '',
      career: profile.career || '',
      location: profile.location || '',
      backgroundColor: profile.backgroundColor || '#ffffff',
      textColor: profile.textColor || '#000000',
      accentColor: profile.accentColor || '#3b82f6',
      metaTitle: profile.metaTitle || '',
      metaDescription: profile.metaDescription || '',
    },
  });

  const onSubmit = (data: UpdateBiolinkProfileInput) => {
    startTransition(async () => {
      try {
        const result = await updateBiolinkProfileAction(data);
        
        if (result?.data) {
          toast.success('Profile updated successfully!');
          router.refresh();
        } else {
          toast.error('Failed to update profile. Please try again.');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Something went wrong. Please try again.');
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteBiolinkProfileAction({ id: profile.id });
      
      if (result?.data) {
        toast.success('Profile deleted successfully!');
        router.push(routes.biolink.root);
      } else {
        toast.error('Failed to delete profile. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={routes.biolink.root}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Profiles
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={profile.status === 'public' ? 'default' : 'secondary'}>
                {profile.status === 'public' ? 'Published' : 'Draft'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                /{profile.slug}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {profile.status === 'public' && (
              <Button variant="outline" size="sm" asChild>
                <Link 
                  href={routes.profile(profile.slug)} 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="size-4 mr-1" />
                  View Live
                </Link>
              </Button>
            )}
            
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.biolink.builder(profile.id)}>
                Edit Components
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
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
                  placeholder="John Doe - Developer"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Custom URL</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                    yoursite.com/
                  </div>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="your-name"
                    className={`rounded-l-none ${errors.slug ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
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
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
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
                    <p className="text-sm text-destructive">{errors.career.message}</p>
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
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      {...register('backgroundColor')}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      {...register('backgroundColor')}
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
                      {...register('textColor')}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      {...register('textColor')}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      {...register('accentColor')}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      {...register('accentColor')}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="Optional custom title for search engines"
                  className={errors.metaTitle ? 'border-destructive' : ''}
                />
                {errors.metaTitle && (
                  <p className="text-sm text-destructive">{errors.metaTitle.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="Optional description for search engines and social media"
                  rows={2}
                  className={errors.metaDescription ? 'border-destructive' : ''}
                />
                {errors.metaDescription && (
                  <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="max-w-sm mx-auto p-6 rounded-lg border text-center"
                style={{
                  backgroundColor: watch('backgroundColor'),
                  color: watch('textColor'),
                }}
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">
                  {watch('title') || 'Your Name'}
                </h3>
                {watch('career') && (
                  <p className="text-sm opacity-80 mb-2">{watch('career')}</p>
                )}
                {watch('location') && (
                  <p className="text-xs opacity-60 mb-4">{watch('location')}</p>
                )}
                {watch('bio') && (
                  <p className="text-sm opacity-90 mb-4">{watch('bio')}</p>
                )}
                <Button 
                  size="sm" 
                  style={{ backgroundColor: watch('accentColor') }}
                  disabled
                >
                  Sample Button
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4 mr-2" />
                Delete Profile
              </>
            )}
          </Button>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href={routes.biolink.root}>Cancel</Link>
            </Button>
            
            <Button 
              type="submit" 
              disabled={isPending || !isDirty}
            >
              {isPending ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}; 