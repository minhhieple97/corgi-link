"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { IUrl } from "../../urls/types";

type StatsBarChartProps = {
  barChartData: Array<{
    url: string;
    clicks: number;
    originalUrl: string;
  }>;
  topUrls: IUrl[];
  avgClicks: number;
};

export const StatsBarChart = ({
  barChartData,
  topUrls,
  avgClicks,
}: StatsBarChartProps) => {
  const barChartConfig: ChartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--chart-1))",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.shortCode,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Performance</CardTitle>
        <CardDescription>Top 5 URLs with most clicks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="url"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  labelFormatter={label => `URL: ${label}`}
                />
              }
            />
            <Bar dataKey="clicks" radius={4}>
              {barChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--chart-${index + 1}))`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {avgClicks > 5 ? (
            <>
              Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this month{" "}
              <TrendingUp className="size-4 text-green-500" />
            </>
          ) : (
            <>
              Could improve with only {5 - avgClicks} more clicks{" "}
              <TrendingDown className="size-4 text-amber-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing click count for your top {topUrls.length} URLs
        </div>
      </CardFooter>
    </Card>
  );
};
