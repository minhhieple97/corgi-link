import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { BiolinkSocialLink } from '@/features/biolink/types';

type SocialLinksProps = {
  socialLinks: BiolinkSocialLink[];
};

export const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-center gap-3 flex-wrap">
        {socialLinks.map((social) => (
          <Button
            key={social.id}
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
            >
              <ExternalLink className="size-4" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}; 