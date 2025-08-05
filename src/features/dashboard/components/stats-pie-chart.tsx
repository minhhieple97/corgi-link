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
import { Label, Pie, PieChart } from "recharts";
import { IUrl } from "../../urls/types";

type StatsPieChartProps = {
  pieChartData: Array<{
    browser: string;
    visitors: number;
    fill: string;
  }>;
  topUrls: IUrl[];
  totalClicks: number;
  avgClicks: number;
};

export const StatsPieChart = ({
  pieChartData,
  topUrls,
  totalClicks,
  avgClicks,
}: StatsPieChartProps) => {
  const pieChartConfig: ChartConfig = {
    visitors: {
      label: "Clicks",
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>URL Clicks Distribution</CardTitle>
        <CardDescription>
          Top {topUrls.length} URLs with most clicks
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieChartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieChartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClicks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 20) + 20}
                          className="fill-muted-foreground text-xs mb-2"
                        >
                          Total Clicks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {topUrls.length > 0 && (
            <>
              {avgClicks > 5 ? (
                <>
                  Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this
                  month <TrendingUp className="size-4 text-green-500" />
                </>
              ) : (
                <>
                  Could improve with only {5 - avgClicks} more clicks{" "}
                  <TrendingDown className="size-4 text-amber-500" />
                </>
              )}
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
