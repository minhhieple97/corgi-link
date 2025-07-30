import { UpdateUrlSchema, UrlFormSchema, DeleteUrlSchema } from './schemas';
import { z } from 'zod';
import type { UseFormReturn } from 'react-hook-form';

export type IUrlFormData = z.infer<typeof UrlFormSchema>;

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: 'safe' | 'suspicious' | 'malicious' | 'inappropriate' | 'unknown';
  confidence: number;
};

export type IUrl = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  expiresAt: Date | null;
};

export type IUpdateUrlFormData = z.infer<typeof UpdateUrlSchema>;

export type IDeleteUrlFormData = z.infer<typeof DeleteUrlSchema>;

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AliasGenerationRequest = {
  url: string;
  options?: {
    count?: number;
    maxLength?: number;
    excludeWords?: string[];
  };
};

export type AliasGenerationResponse = {
  success: boolean;
  data?: {
    aliases: string[];
    metadata: {
      originalUrl: string;
      title: string;
      description: string;
      generatedAt: string;
      processingTime: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
};

export type FlaggedUrlAlertProps = {
  flagReason: string;
  onCreateAnother: () => void;
};

export type SuccessUrlDisplayProps = {
  shortUrl: string;
  onCopy: () => void;
  onCreateAnother: () => void;
};

export type UrlInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  isValid: boolean;
  isSignedIn: boolean | undefined;
  isPending: boolean;
  onSubmit: () => void;
};

export type CustomCodeFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  baseUrl: string;
  onGenerateAliases: () => void;
  isGenerating: boolean;
};

export type AliasSuggestionsProps = {
  aliases: string[];
  onAliasClick: (alias: string) => void;
  disabled: boolean;
};

export type ExpirationFieldProps = {
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  disabled: boolean;
};

// Hook Return Types
export type UseUrlShortenerFormReturn = {
  // Form state
  form: UseFormReturn<IUrlFormData>;
  urlValue: string;
  customCodeValue: string | undefined;
  expirationValue: Date | null | undefined;

  // Computed values
  isUrlValid: boolean;
  baseUrl: string;

  // URL shortening state
  shortUrl: string | null | undefined;
  isPending: boolean;
  flagged: boolean | undefined;
  flagReason: string | null | undefined;
  isAnalyzing: boolean;

  // Alias generation state
  suggestedAliases: string[];
  isGenerating: boolean;

  // Event handlers
  handleSubmit: () => void;
  handleUrlChange: (value: string) => void;
  handleCustomCodeChange: (value: string) => void;
  handleExpirationChange: (date: Date | undefined) => void;
  handleSuggestionClick: (alias: string) => void;
  handleGenerateAliases: () => void;
  handleResetForm: () => void;
  handleCopy: () => void;
  setIsAnalyzing: (analyzing: boolean) => void;
};

// Event Handler Types
export type UrlChangeHandler = (value: string) => void;
export type DateChangeHandler = (date: Date | undefined) => void;
export type AliasClickHandler = (alias: string) => void;
export type SubmitHandler = () => void;
export type ResetHandler = () => void;
export type CopyHandler = () => void;
