import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { AliasGenerationResponse } from '../types';

type AliasGenerationOptions = {
  count?: number;
  maxLength?: number;
  excludeWords?: string[];
};

type UseGenerateAliasReturn = {
  suggestedAliases: string[];
  isGenerating: boolean;
  error: string | null;
  generateAliases: (
    url: string,
    options?: AliasGenerationOptions,
  ) => Promise<void>;
  clearSuggestions: () => void;
  clearError: () => void;
};

export const useGenerateAlias = (): UseGenerateAliasReturn => {
  const [suggestedAliases, setSuggestedAliases] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAliases = useCallback(
    async (url: string, options: AliasGenerationOptions = {}) => {
      // Input validation
      if (!url.trim()) {
        const errorMessage = 'Please enter a URL first';
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Reset state
      setIsGenerating(true);
      setSuggestedAliases([]);
      setError(null);

      try {
        const requestBody = {
          url: url.trim(),
          options: {
            count: options.count || 5,
            maxLength: options.maxLength || 12,
            excludeWords: options.excludeWords || [],
          },
        };

        const response = await fetch('/api/generate-alias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data: AliasGenerationResponse = await response.json();

        if (!response.ok) {
          const errorMessage =
            data.error?.message || `Server error: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (data.success && data.data?.aliases) {
          if (data.data.aliases.length === 0) {
            const warningMessage = 'No aliases could be generated for this URL';
            setError(warningMessage);
            toast.warning(warningMessage);
          } else {
            setSuggestedAliases(data.data.aliases);
            toast.success(
              `Generated ${data.data.aliases.length} alias suggestions`,
            );
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to generate aliases';

        console.error('Error generating aliases:', error);
        setError(errorMessage);
        toast.error(errorMessage);
        setSuggestedAliases([]);
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  const clearSuggestions = useCallback(() => {
    setSuggestedAliases([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    suggestedAliases,
    isGenerating,
    error,
    generateAliases,
    clearSuggestions,
    clearError,
  };
};
