import type { Airport } from "./AirportCard";
import {
  Plane,
  Wallet,
  Database,
  Zap,
  Route,
  ThumbsUp,
} from "lucide-react";

interface StatsPanelProps {
  airports: Airport[];
}

function parseTraffic(traffic: string): number {
  const match = traffic.match(/(\d+(?:\.\d+)?)\s*([GT])B?/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return unit === "T" ? value * 1024 : value;
}

function formatTotalTraffic(gb: number): string {
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)}TB`;
  return `${Math.round(gb)}GB`;
}

export function StatsPanel({ airports }: StatsPanelProps) {
  const total = airports.length;
  const lowCost = airports.filter((a) => a.category === "低价").length;
  const value = airports.filter((a) => a.category === "性价比").length;
  const avgPrice =
    Math.round(
      (airports.reduce((sum, a) => sum + a.price, 0) / total) * 10
    ) / 10;
  const totalTraffic = airports.reduce(
    (sum, a) => sum + parseTraffic(a.traffic),
    0
  );
  const dedicated = airports.filter(
    (a) => a.tags.some((tag) => tag.includes("专线") || tag.includes("IPLC"))
  ).length;
  const relay = airports.filter((a) =>
    a.tags.some((tag) => tag.includes("中转"))
  ).length;
  const recommended = airports.filter((a) => a.recommend).length;

  const stats = [
    { label: "收录机场", value: `${total}家`, icon: Plane },
    { label: "平均月费", value: `¥${avgPrice}`, icon: Wallet },
    { label: "总流量", value: formatTotalTraffic(totalTraffic), icon: Database },
    { label: "推荐机场", value: `${recommended}家`, icon: ThumbsUp },
    { label: "专线机场", value: `${dedicated}家`, icon: Zap },
    { label: "中转机场", value: `${relay}家`, icon: Route },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-3"
        >
          <div className="p-2 bg-blue-50 rounded-lg">
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
