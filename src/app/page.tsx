import { UrlShortenerForm } from '@/features/urls/components';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-2 lg:p-6 min-h-0 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
          <div className="text-center lg:text-left mb-4 lg:mb-0 lg:flex-1">
            <div className="flex items-center justify-center lg:justify-start mb-2">
              <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20 mr-2">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                Free & Fast URL Shortener
              </Badge>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Shorten Your Links
            </h1>

            <p className="text-sm text-muted-foreground lg:max-w-md">
              Transform long URLs into short, shareable links with analytics.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-muted-foreground">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-muted-foreground">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <BarChart3 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-muted-foreground">Analytics</span>
            </div>
          </div>
        </div>

        <Card className="mb-4 lg:mb-6 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <UrlShortenerForm />
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2 lg:hidden">
          <div className="text-center p-2 rounded-lg bg-card/30 border border-border/50">
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit mx-auto mb-1">
              <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Fast</p>
          </div>

          <div className="text-center p-2 rounded-lg bg-card/30 border border-border/50">
            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 w-fit mx-auto mb-1">
              <Shield className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Secure</p>
          </div>

          <div className="text-center p-2 rounded-lg bg-card/30 border border-border/50">
            <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-1">
              <BarChart3 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
