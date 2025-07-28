import { useState } from 'react';
import { toast } from 'sonner';
import type { AliasGenerationResponse } from '../types';

export const useGenerateAlias = () => {
  const [suggestedAliases, setSuggestedAliases] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAliases = async (url: string) => {
    if (!url.trim()) {
      toast.error('Please enter a URL first');
      return;
    }

    setIsGenerating(true);
    setSuggestedAliases([]);

    try {
      const response = await fetch('/api/generate-alias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          options: {
            count: 5,
            maxLength: 12,
          },
        }),
      });

      const data: AliasGenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate aliases');
      }

      if (data.success && data.data?.aliases) {
        setSuggestedAliases(data.data.aliases);
        toast.success(`Generated ${data.data.aliases.length} alias suggestions`);
      } else {
        throw new Error('No aliases generated');
      }
    } catch (error) {
      console.error('Alias generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate aliases');
      setSuggestedAliases([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestedAliases([]);
  };

  return {
    suggestedAliases,
    isGenerating,
    generateAliases,
    clearSuggestions,
  };
}; 