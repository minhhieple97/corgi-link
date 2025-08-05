import { useMemo } from "react";
import { IUrl } from "../../urls/types";

type UseUrlStatsProps = {
  urls: IUrl[];
};

export const useUrlStats = ({ urls }: UseUrlStatsProps) => {
  const stats = useMemo(() => {
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const avgClicks =
      urls.length > 0 ? Math.round((totalClicks / urls.length) * 10) / 10 : 0;
    const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    return {
      totalUrls: urls.length,
      totalClicks,
      avgClicks,
      topUrls,
    };
  }, [urls]);

  const chartData = useMemo(() => {
    const barChartData = stats.topUrls.map(url => ({
      url: url.shortCode,
      clicks: url.clicks,
      originalUrl: url.originalUrl,
    }));

    const pieChartData = stats.topUrls.map((url, index) => ({
      browser: url.shortCode,
      visitors: url.clicks,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));

    return {
      barChartData,
      pieChartData,
    };
  }, [stats.topUrls]);

  return {
    ...stats,
    ...chartData,
  };
};
