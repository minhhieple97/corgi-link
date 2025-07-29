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
import { ArrowLeft, Check, Globe } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/routes';
import {
  createBiolinkProfileSchema,
  createBiolinkProfileAction,
} from '@/features/biolink';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

const CreateBiolinkProfilePage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateBiolinkProfileInput>({
    resolver: zodResolver(createBiolinkProfileSchema),
    mode: 'onChange',
    defaultValues: {
      slug: '',
      title: '',
      bio: '',
      career: '',
      location: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#3b82f6',
    },
  });

  const slug = watch('slug');
  const title = watch('title');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);

    if (newTitle && !slug) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '')
      .replace(/^-+|-+$/g, '');
    setValue('slug', newSlug);

    // Reset availability check
    setSlugAvailable(null);
  };

  const checkSlugAvailability = async () => {
    if (!slug || slug.length < 3) return;

    try {
      // Here you would call the slug validation action
      // const result = await validateBiolinkSlugAction({ slug });
      // setSlugAvailable(result.isAvailable);

      // For now, simulate the check
      setTimeout(() => {
        setSlugAvailable(true);
      }, 500);
    } catch {
      setSlugAvailable(false);
    }
  };

  const onSubmit = (data: CreateBiolinkProfileInput) => {
    startTransition(async () => {
      try {
        const result = await createBiolinkProfileAction(data);

        if (result?.data?.profile) {
          toast.success('Profile created successfully!');
          router.push(routes.biolink.builder(result.data.profile.id));
        } else {
          toast.error('Failed to create profile. Please try again.');
        }
      } catch (error) {
        console.error('Error creating profile:', error);
        toast.error('Something went wrong. Please try again.');
      }
    });
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

        <h1 className="text-3xl font-bold">Create New Profile</h1>
        <p className="text-muted-foreground mt-2">
          Set up your personal landing page to share all your important links
        </p>
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
                  onChange={handleTitleChange}
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
                      onChange={handleSlugChange}
                      onBlur={checkSlugAvailability}
                      placeholder="your-name"
                      className={`rounded-l-none ${
                        errors.slug ? 'border-destructive' : ''
                      }`}
                    />
                    {slugAvailable === true && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">
                    {errors.slug.message}
                  </p>
                )}
                {slugAvailable === false && (
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
                  {title || 'Your Name'}
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

        <div className="flex items-center gap-4 mt-8">
          <Button
            type="submit"
            disabled={isPending || !isValid}
            className="flex-1"
          >
            {isPending ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Globe className="size-4 mr-2" />
                Create Profile
              </>
            )}
          </Button>

          <Button variant="outline" asChild>
            <Link href={routes.biolink.root}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBiolinkProfilePage;
