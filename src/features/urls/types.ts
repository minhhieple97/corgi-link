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
