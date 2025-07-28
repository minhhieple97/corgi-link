import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UrlShortenerForm } from '@/features/urls/components';

export const CreateUrlCard = () => {
  return (
    <Card className="shadow-sm border-border/50 w-full">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-lg lg:text-xl">Create New Short URL</CardTitle>
        <CardDescription className="text-xs lg:text-sm">
          Enter a long URL to create a shortened link. You can also customize the short code and set an expiration date.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <UrlShortenerForm />
      </CardContent>
    </Card>
  );
}; 