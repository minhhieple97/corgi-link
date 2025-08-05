"use client";

import { IUrl } from "../../urls/types";
import { StatsOverviewCards } from "./stats-overview-cards";
import { StatsCharts } from "./stats-charts";
import { useUrlStats } from "../hooks/use-url-stats";

type StatsContentProps = {
  urls: IUrl[];
};

export const StatsContent = ({ urls }: StatsContentProps) => {
  const {
    totalUrls,
    totalClicks,
    avgClicks,
    topUrls,
    barChartData,
    pieChartData,
  } = useUrlStats({
    urls,
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">URL Statistics</h1>

      <StatsOverviewCards
        totalUrls={totalUrls}
        totalClicks={totalClicks}
        avgClicks={avgClicks}
      />

      <StatsCharts
        barChartData={barChartData}
        pieChartData={pieChartData}
        topUrls={topUrls}
        totalClicks={totalClicks}
        avgClicks={avgClicks}
      />
    </>
  );
};
