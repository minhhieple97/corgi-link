"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlPreviewImage } from "./url-preview-image";
import { UrlPreviewContent } from "./url-preview-content";
import type { UrlPreviewMetadata } from "../types";

type UrlPreviewCardProps = {
  data: UrlPreviewMetadata;
  domain: string | null;
  title: string;
  description: string;
  className?: string;
  onImageLoad: () => void;
  onImageError: () => void;
};

export const UrlPreviewCard = ({
  data,
  domain,
  title,
  description,
  className,
  onImageLoad,
  onImageError,
}: UrlPreviewCardProps) => {
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(data.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className={cn(
        "border-border/50 bg-card hover:bg-accent/50 transition-colors cursor-pointer group",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <UrlPreviewImage
              image={data.image}
              favicon={data.favicon}
              title={title}
              onImageLoad={onImageLoad}
              onImageError={onImageError}
            />
          </div>

          <UrlPreviewContent
            domain={domain}
            title={title}
            description={description}
            siteName={data.siteName}
          />

          <div className="flex-shrink-0 self-start">
            <ExternalLink
              className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer"
              onClick={handleExternalLinkClick}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
