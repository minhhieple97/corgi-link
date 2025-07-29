'use client';

import { useState, useCallback } from 'react';
import { validateBiolinkSlugAction } from '@/features/biolink';

export const useSlugValidation = () => {
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    setIsValidating(true);

    try {
      const result = await validateBiolinkSlugAction({ slug });

      if (result?.data) {
        setSlugAvailable(result.data.isAvailable);
      } else {
        setSlugAvailable(false);
      }
    } catch (error) {
      console.error('Error validating slug:', error);
      setSlugAvailable(false);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const resetValidation = useCallback(() => {
    setSlugAvailable(null);
    setIsValidating(false);
  }, []);

  return {
    slugAvailable,
    isValidating,
    validateSlug,
    resetValidation,
  };
};
