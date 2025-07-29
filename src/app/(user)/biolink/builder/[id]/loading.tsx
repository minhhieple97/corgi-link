import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top toolbar skeleton */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Preview mode toggle skeleton */}
              <div className="flex items-center border rounded-lg p-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20 ml-1" />
              </div>

              {/* Action buttons skeleton */}
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main builder interface skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Left panel - Component palette skeleton */}
          <div className="w-80 border-r bg-background p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Center panel - Canvas skeleton */}
          <div className="flex-1 min-w-0 p-8">
            <div className="max-w-sm mx-auto">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Property editor skeleton */}
          <div className="w-80 border-l bg-background p-4">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar skeleton */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="py-2 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}