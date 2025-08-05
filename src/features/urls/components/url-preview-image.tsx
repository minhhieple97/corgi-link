"use client";

import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [faviconError, setFaviconError] = useState(false);

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
    setFaviconError(true);
  };

  if (image && !imageError) {
    return (
      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-sm border border-border/50 group-hover:shadow-md transition-all duration-200">
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted">
            <Skeleton className="absolute inset-0 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50 animate-pulse" />
            </div>
          </div>
        )}
        <Image
          src={image}
          alt={title}
          fill
          className={cn(
            "object-cover transition-all duration-300 ease-out",
            imageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
            "group-hover:scale-105"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="64px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    );
  }

  return (
    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-muted/30 via-muted/50 to-muted/70 flex items-center justify-center shadow-sm border border-border/30 group-hover:shadow-md group-hover:border-border/50 transition-all duration-200 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

      {favicon && !faviconError ? (
        <div className="relative z-10 p-2 rounded-md bg-background/80 backdrop-blur-sm shadow-sm">
          <Image
            src={favicon}
            alt="Favicon"
            width={24}
            height={24}
            className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
            onError={handleFaviconError}
            unoptimized
          />
        </div>
      ) : (
        <div className="relative z-10 p-2 rounded-md bg-background/60 backdrop-blur-sm">
          <Globe className="h-6 w-6 text-muted-foreground/70 transition-all duration-200 group-hover:text-muted-foreground group-hover:scale-110" />
        </div>
      )}
    </div>
  );
};
