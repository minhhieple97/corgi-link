import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Edit, Copy, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/routes';
import { biolinkService } from '@/features/biolink';

const BiolinkDashboard = async () => {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const { profiles } = await biolinkService.getUserProfiles(user.id);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My BioLink Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your personal landing pages
          </p>
        </div>
        <Button asChild>
          <Link href={routes.biolink.create}>
            <Plus className="size-4 mr-2" />
            Create Profile
          </Link>
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Globe className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first BioLink profile to share all your important links in one beautiful page.
              </p>
              <Button asChild>
                <Link href={routes.biolink.create}>
                  <Plus className="size-4 mr-2" />
                  Create Your First Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card key={profile.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {profile.title || 'Untitled Profile'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={profile.status === 'public' ? 'default' : 'secondary'}>
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
                  <span>Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
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

                  <Button variant="ghost" size="sm">
                    <Copy className="size-4" />
                  </Button>

                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick stats */}
      {profiles.length > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter(p => p.status === 'public').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const BiolinkDashboardPage = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    }>
      <BiolinkDashboard />
    </Suspense>
  );
};

export default BiolinkDashboardPage; 