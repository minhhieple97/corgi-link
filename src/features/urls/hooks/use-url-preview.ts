'use client';

import { useState } from 'react';
import { urlPreviewService } from '../services/url-preview-service';

type UseUrlPreviewReturn = {
  imageError: boolean;
  imageLoading: boolean;
  setImageError: (error: boolean) => void;
  setImageLoading: (loading: boolean) => void;
  extractDomain: (url: string) => string | null;
  truncateTitle: (title?: string) => string;
  truncateDescription: (description?: string) => string;
  handleImageLoad: () => void;
  handleImageError: () => void;
};

export const useUrlPreview = (): UseUrlPreviewReturn => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const extractDomain = (url: string) => {
    return urlPreviewService.extractDomain(url);
  };

  const truncateTitle = (title?: string) => {
    return title ? urlPreviewService.truncateText(title, 80) : 'Untitled';
  };

  const truncateDescription = (description?: string) => {
    return description ? urlPreviewService.truncateText(description, 120) : '';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return {
    imageError,
    imageLoading,
    setImageError,
    setImageLoading,
    extractDomain,
    truncateTitle,
    truncateDescription,
    handleImageLoad,
    handleImageError,
  };
};