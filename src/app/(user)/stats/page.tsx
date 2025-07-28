import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInButton } from '@clerk/nextjs';
import { getPublicStats } from '@/features/urls/queries';

export const metadata: Metadata = {
  title: 'Statistics | CorgiLink',
  description: 'Statistics about our URL shortener service',
};

export default async function PublicStatsPage() {
  const { totalUrls, totalClicks } = await getPublicStats();

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Service Statistics</h1>
      <p className="text-center text-muted-foreground mb-8">
        General statistics about our URL shortener service
      </p>

      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total URLs Shortened</CardTitle>
            <CardDescription>Number of URLs shortened with our service</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalUrls.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Clicks</CardTitle>
            <CardDescription>Total number of redirects through our service</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalClicks.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Want to see your personal statistics?</CardTitle>
            <CardDescription>
              Sign up for an account to track your own shortened URLs and view detailed statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <SignInButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
