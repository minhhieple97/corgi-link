import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StatsLoading() {
  return (
    <>
      <div className="text-center mb-8">
        <Skeleton className="h-9 w-64 mx-auto" />
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-l-4 border-gray-200 flex-1 min-w-[280px]"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="p-3 rounded-xl bg-gray-50 flex-shrink-0">
                  <Skeleton className="h-6 w-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right ml-2">
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>

                  <div className="mt-3 w-full">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <Card className="shadow-sm">
        <CardHeader>
          {/* Chart title skeleton */}
          <Skeleton className="h-6 w-48 mb-2" />
          {/* Chart description skeleton */}
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          {/* Tabs skeleton */}
          <div className="mb-4">
            <div className="flex space-x-1 bg-muted p-1 rounded-md w-fit">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          {/* Chart content skeleton */}
          <div className="min-h-[400px] mt-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                {/* Chart area skeleton */}
                <div className="space-y-4">
                  {/* Chart bars/elements skeleton */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 flex-1 max-w-xs" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                {/* Footer skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
