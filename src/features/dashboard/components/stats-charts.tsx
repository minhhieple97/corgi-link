"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { IUrl } from "../../urls/types";
import { StatsBarChart } from "./stats-bar-chart";
import { StatsPieChart } from "./stats-pie-chart";

type StatsChartsProps = {
  barChartData: Array<{
    url: string;
    clicks: number;
    originalUrl: string;
  }>;
  pieChartData: Array<{
    browser: string;
    visitors: number;
    fill: string;
  }>;
  topUrls: IUrl[];
  totalClicks: number;
  avgClicks: number;
};

export const StatsCharts = ({
  barChartData,
  pieChartData,
  topUrls,
  totalClicks,
  avgClicks,
}: StatsChartsProps) => {
  if (barChartData.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Top Performing URLs</CardTitle>
          <CardDescription>Top 5 URLs with most clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No URL data available yet. Create some short URLs to see the stats.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Top Performing URLs</CardTitle>
        <CardDescription>Top 5 URLs with most clicks</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="min-h-[400px] mt-4">
            <StatsBarChart
              barChartData={barChartData}
              topUrls={topUrls}
              avgClicks={avgClicks}
            />
          </TabsContent>
          <TabsContent value="pie" className="min-h-[400px] mt-4">
            <StatsPieChart
              pieChartData={pieChartData}
              topUrls={topUrls}
              totalClicks={totalClicks}
              avgClicks={avgClicks}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
