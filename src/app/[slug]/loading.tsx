import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 container mx-auto max-w-md px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          {/* Avatar Skeleton */}
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          
          {/* Badges Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          {/* Bio Skeleton */}
          <div className="max-w-sm mx-auto space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Social Links Skeleton */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>

        {/* Components Skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Projects Section Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-6 w-40 mx-auto mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="w-full h-32 rounded-md" />
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="py-6 text-center">
        <Skeleton className="h-4 w-32 mx-auto" />
      </footer>
    </div>
  );
}
