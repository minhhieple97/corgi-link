import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase } from 'lucide-react';
import type { BiolinkProfile } from '@/features/biolink/types';

type ProfileHeaderProps = {
  profile: BiolinkProfile;
};

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {profile.avatar ? (
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile.avatar} alt={profile.title || ''} />
          <AvatarFallback className="text-2xl font-bold">
            {profile.title?.charAt(0)?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold border-2"
          style={{
            backgroundColor: profile.accentColor || '#3b82f6',
            color: profile.backgroundColor || '#ffffff',
          }}
        >
          {profile.title?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}

      {profile.title && (
        <h1 className="text-2xl font-bold mb-2">{profile.title}</h1>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {profile.career && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Briefcase className="size-3" />
            {profile.career}
          </Badge>
        )}
        {profile.location && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="size-3" />
            {profile.location}
          </Badge>
        )}
      </div>

      {profile.bio && (
        <p className="text-sm opacity-90 max-w-sm mx-auto leading-relaxed">
          {profile.bio}
        </p>
      )}
    </div>
  );
};
