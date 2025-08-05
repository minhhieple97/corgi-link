"use client";

import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

type UrlPreviewContentProps = {
  domain: string | null;
  title: string;
  description: string;
  siteName?: string;
};

export const UrlPreviewContent = ({
  domain,
  title,
  description,
  siteName,
}: UrlPreviewContentProps) => {
  return (
    <div className="flex-1 min-w-0 space-y-1">
      {domain && (
        <Badge variant="secondary" className="text-xs font-normal mb-2">
          <Globe className="h-3 w-3 mr-1" />
          {domain}
        </Badge>
      )}

      <h3 className="font-medium text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {siteName && siteName !== title && (
        <p className="text-xs text-muted-foreground/80 font-medium">
          {siteName}
        </p>
      )}
    </div>
  );
};
