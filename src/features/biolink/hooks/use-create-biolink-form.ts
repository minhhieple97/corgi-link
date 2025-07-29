'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createBiolinkProfileSchema,
  createBiolinkProfileAction,
} from '@/features/biolink';
import { routes } from '@/routes';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

const DEFAULT_FORM_VALUES: CreateBiolinkProfileInput = {
  slug: '',
  title: '',
  bio: '',
  career: '',
  location: '',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  accentColor: '#3b82f6',
};

export const useCreateBiolinkForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateBiolinkProfileInput>({
    resolver: zodResolver(createBiolinkProfileSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

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

  return {
    form,
    isPending,
    onSubmit,
  };
};
