'use client';

import Link from 'next/link';
import { Edit, Globe, Copy, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/routes';
import type { BiolinkProfile } from '@/features/biolink/types';

type ProfileCardProps = {
  profile: BiolinkProfile;
  onCopy?: (profile: BiolinkProfile) => void;
  onDelete?: (profile: BiolinkProfile) => void;
};

export const ProfileCard = ({ profile, onCopy, onDelete }: ProfileCardProps) => {
  const handleCopy = () => {
    onCopy?.(profile);
  };

  const handleDelete = () => {
    onDelete?.(profile);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {profile.title || 'Untitled Profile'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  profile.status === 'public' ? 'default' : 'secondary'
                }
              >
                {profile.status === 'public' ? 'Published' : 'Draft'}
              </Badge>
              <span className="text-sm text-muted-foreground truncate">
                /{profile.slug}
              </span>
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Updated {new Date(profile.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <Link href={routes.biolink.edit(profile.id)}>
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={routes.biolink.builder(profile.id)}>
              <Globe className="size-4" />
            </Link>
          </Button>

          {profile.status === 'public' && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={routes.profile(profile.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
