import { useCallback } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateBiolinkProfileInput } from '@/features/biolink/types';

type UseSlugGenerationProps = {
  setValue: UseFormSetValue<CreateBiolinkProfileInput>;
  watch: UseFormWatch<CreateBiolinkProfileInput>;
};

export const useSlugGeneration = ({ setValue, watch }: UseSlugGenerationProps) => {
  const slug = watch('slug');

  const generateSlugFromTitle = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  const sanitizeSlug = useCallback((input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '')
      .replace(/^-+|-+$/g, '');
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);

    // Auto-generate slug only if current slug is empty
    if (newTitle && !slug) {
      const generatedSlug = generateSlugFromTitle(newTitle);
      setValue('slug', generatedSlug);
    }
  }, [setValue, slug, generateSlugFromTitle]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedSlug = sanitizeSlug(e.target.value);
    setValue('slug', sanitizedSlug);
  }, [setValue, sanitizeSlug]);

  return {
    handleTitleChange,
    handleSlugChange,
    generateSlugFromTitle,
    sanitizeSlug,
  };
};
