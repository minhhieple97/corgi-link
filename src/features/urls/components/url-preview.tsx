'use client';

import type { UrlPreviewState } from '../types';
import { useUrlPreview } from '../hooks/use-url-preview';
import { UrlPreviewError } from './url-preview-error';
import { UrlPreviewSkeleton } from './url-preview-skeleton';
import { UrlPreviewCard } from './url-preview-card';

type UrlPreviewProps = {
  previewState: UrlPreviewState;
  className?: string;
};

export const UrlPreview = ({ previewState, className }: UrlPreviewProps) => {
  const { extractDomain, truncateTitle, truncateDescription, handleImageLoad, handleImageError } =
    useUrlPreview();

  const { isLoading, data, error } = previewState;

  if (!isLoading && !data && !error) {
    return null;
  }

  if (error && !isLoading) {
    return <UrlPreviewError error={error} className={className} />;
  }

  if (isLoading) {
    return <UrlPreviewSkeleton className={className} />;
  }

  if (data) {
    const domain = extractDomain(data.url);
    const title = truncateTitle(data.title);
    const description = truncateDescription(data.description);

    return (
      <UrlPreviewCard
        data={data}
        domain={domain}
        title={title}
        description={description}
        className={className}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />
    );
  }

  return null;
};