import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-none space-y-6 lg:space-y-8">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 lg:h-9 w-48" />
        <Skeleton className="h-4 lg:h-5 w-80" />
      </div>

      <div className="grid gap-4 lg:gap-6">
        <Card className="shadow-sm border-border/50 w-full">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="text-lg lg:text-xl">
              <Skeleton className="h-6 lg:h-7 w-48" />
            </CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              <Skeleton className="h-4 w-96" />
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-dashed border-border/50 w-full overflow-hidden">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="text-lg lg:text-xl">
              <Skeleton className="h-6 lg:h-7 w-32" />
            </CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-0 lg:px-6">
            <div className="px-4 lg:px-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%] sm:w-[40%]">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                      <TableHead className="w-[30%] sm:w-[30%]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="w-[10%]">
                        <Skeleton className="h-4 w-12" />
                      </TableHead>
                      <TableHead className="w-[15%] sm:w-[20%]">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="w-[10%] text-right">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2 min-w-0">
                            <Skeleton className="h-4 flex-1 max-w-[200px]" />
                            <Skeleton className="h-4 w-4 flex-shrink-0" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-0">
                            <Skeleton className="h-4 flex-1 max-w-[150px]" />
                            <Skeleton className="h-8 w-8 flex-shrink-0" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <div className="hidden sm:flex gap-1">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                            <div className="sm:hidden">
                              <Skeleton className="h-8 w-8" />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Link Skeleton (conditionally shown) */}
        <div className="flex justify-center pt-2 lg:pt-4">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
