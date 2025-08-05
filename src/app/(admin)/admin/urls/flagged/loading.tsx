import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlaggedURLsLoading() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Flagged URLs</h1>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
            <AlertTriangle className="size-4" />
            <span className="font-medium">Loading...</span>
          </div>
        </div>
        <Link href={"/admin/urls"} passHref>
          <Button variant={"outline"} size={"sm"} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to All URLs
          </Button>
        </Link>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-sm border-yellow-200 dark:border-yellow-800">
          <CardHeader className="border-b px-3 py-1 border-yellow-100 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />
              <CardTitle className="text-yellow-800 dark:text-yellow-300">
                Flagged URLs
              </CardTitle>
            </div>
            <CardDescription>
              These URLs have been automatically flagged by our AI system as
              potentially unsafe or inappropriate. Please review each URL
              carefully before taking action.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="size-5" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Card className="border shadow-sm mb-6">
                      <CardContent className="pt-4">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
