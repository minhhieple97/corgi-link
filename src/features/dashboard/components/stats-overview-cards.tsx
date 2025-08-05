import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MousePointer, Link } from "lucide-react";

type StatsOverviewCardsProps = {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
};

export const StatsOverviewCards = ({
  totalUrls,
  totalClicks,
  avgClicks,
}: StatsOverviewCardsProps) => {
  const stats = [
    {
      title: "Total URLs",
      description: "Number of URLs you've created",
      value: totalUrls,
      icon: Link,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Clicks",
      description: "Total clicks across all URLs",
      value: totalClicks,
      icon: MousePointer,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Average Clicks",
      description: "Average clicks per URL",
      value: avgClicks,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`
              relative overflow-hidden transition-all duration-300 ease-in-out
              hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]
              border-l-4 ${stat.borderColor}
              group cursor-pointer
              flex-1 min-w-[280px]
            `}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div
                  className={`
                    p-3 rounded-xl ${stat.bgColor} 
                    transition-transform duration-300 group-hover:scale-110
                    flex-shrink-0
                  `}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {stat.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {stat.description}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p
                        className={`
                          text-2xl font-bold tracking-tight ${stat.color}
                          transition-all duration-300 group-hover:text-3xl
                        `}
                      >
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`
                        h-full rounded-full transition-all duration-1000 ease-out
                        ${stat.color.replace("text-", "bg-")}
                      `}
                      style={{
                        width: `${Math.min(
                          (stat.value /
                            Math.max(totalUrls, totalClicks, avgClicks)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="absolute top-2 right-2 w-16 h-16 opacity-5">
              <Icon className="w-full h-full" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
