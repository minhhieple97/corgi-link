import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { env } from '@/env';
import { useShortenUrl } from './use-shorten-url';
import { useGenerateAlias } from './use-generate-alias';
import { UrlFormSchema } from '../schemas';
import type { IUrlFormData, UseUrlShortenerFormReturn } from '../types';

export const useUrlShortenerForm = (): UseUrlShortenerFormReturn => {
  // Form state management
  const form = useForm<IUrlFormData>({
    resolver: zodResolver(UrlFormSchema),
    defaultValues: {
      url: '',
      customCode: '',
      expiresAt: undefined,
    },
  });

  // Business logic hooks
  const {
    onSubmit: submitUrl,
    shortUrl,
    isPending,
    resetForm: resetShortenUrl,
    flagged,
    flagReason,
    handleCopy,
    isAnalyzing,
    setIsAnalyzing,
  } = useShortenUrl();

  const { suggestedAliases, isGenerating, generateAliases, clearSuggestions } =
    useGenerateAlias();

  // Computed values
  const urlValue = form.watch('url');
  const isUrlValid = useMemo(() => {
    if (!urlValue || urlValue.trim() === '') return false;
    return UrlFormSchema.shape.url.safeParse(urlValue).success;
  }, [urlValue]);

  const baseUrl =
    env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  // Event handlers
  const handleSubmit = () => {
    const formData = form.getValues();
    submitUrl(formData);
  };

  const handleUrlChange = (value: string) => {
    form.setValue('url', value);
  };

  const handleCustomCodeChange = (value: string) => {
    form.setValue('customCode', value);
  };

  const handleExpirationChange = (date: Date | undefined) => {
    form.setValue('expiresAt', date);
  };

  const handleSuggestionClick = (alias: string) => {
    form.setValue('customCode', alias);
    clearSuggestions();
  };

  const handleGenerateAliases = () => {
    const url = form.getValues('url');
    generateAliases(url);
  };

  const handleResetForm = () => {
    resetShortenUrl();
    clearSuggestions();
  };

  // Effects
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'url' && suggestedAliases.length > 0) {
        clearSuggestions();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, suggestedAliases.length, clearSuggestions]);

  return {
    // Form state
    form,
    urlValue,
    customCodeValue: form.watch('customCode'),
    expirationValue: form.watch('expiresAt'),

    // Computed values
    isUrlValid,
    baseUrl,

    // URL shortening state
    shortUrl,
    isPending,
    flagged,
    flagReason,
    isAnalyzing,

    // Alias generation state
    suggestedAliases,
    isGenerating,

    // Event handlers
    handleSubmit,
    handleUrlChange,
    handleCustomCodeChange,
    handleExpirationChange,
    handleSuggestionClick,
    handleGenerateAliases,
    handleResetForm,
    handleCopy,
    setIsAnalyzing,
  };
};
