import { UpdateUrlSchema, UrlFormSchema, DeleteUrlSchema } from './schemas';
import { z } from 'zod';

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

// Types moved to lib services for better modularity
// CrawledContent - now in lib/crawler.ts
// UrlSafetyCheck - now in lib/llm-service.ts
// AliasGenerationOptions - now in lib/llm-service.ts
