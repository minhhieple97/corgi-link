import type { BiolinkProfile } from '@/features/biolink/types';

type ProfileLayoutProps = {
  profile: BiolinkProfile;
  children: React.ReactNode;
};

export const ProfileLayout = ({ profile, children }: ProfileLayoutProps) => {
  const profileStyle = {
    backgroundColor: profile.backgroundColor || '#ffffff',
    color: profile.textColor || '#000000',
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={profileStyle}
    >
      {/* Custom CSS */}
      {profile.customCss && (
        <style dangerouslySetInnerHTML={{ __html: profile.customCss }} />
      )}

      {/* Main Content */}
      <div className="flex-1 container mx-auto max-w-md px-4 py-8">
        {children}
      </div>
    </div>
  );
}; 