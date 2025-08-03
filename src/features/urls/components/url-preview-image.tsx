'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

type UrlPreviewImageProps = {
  image?: string;
  favicon?: string;
  title: string;
  onImageLoad: () => void;
  onImageError: () => void;
};

export const UrlPreviewImage = ({
  image,
  favicon,
  title,
  onImageLoad,
  onImageError,
}: UrlPreviewImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    onImageLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    onImageError();
  };

  const handleFaviconError = () => {
    setImageError(true);
  };

  if (image && !imageError) {
    return (
      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
        {imageLoading && <Skeleton className="absolute inset-0" />}
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            'object-cover transition-opacity',
            imageLoading ? 'opacity-0' : 'opacity-100',
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="64px"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
      {favicon && !imageError ? (
        <Image
          src={favicon}
          alt="Favicon"
          width={24}
          height={24}
          className="h-6 w-6"
          onError={handleFaviconError}
          unoptimized
        />
      ) : (
        <Globe className="h-6 w-6 text-muted-foreground" />
      )}
    </div>
  );
};