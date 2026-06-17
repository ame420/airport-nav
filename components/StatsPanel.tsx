import type { Airport } from "./AirportCard";
import { Plane, Zap, Route } from "lucide-react";

interface StatsPanelProps {
  airports: Airport[];
}

export function StatsPanel({ airports }: StatsPanelProps) {
  const total = airports.length;
  const dedicated = airports.filter((a) =>
    a.tags.some((tag) => tag.includes("专线") || tag.includes("IPLC"))
  ).length;
  const relay = airports.filter((a) =>
    a.tags.some((tag) => tag.includes("中转"))
  ).length;

  const stats = [
    { label: "收录机场", value: `${total}家`, icon: Plane },
    { label: "专线机场", value: `${dedicated}家`, icon: Zap },
    { label: "中转机场", value: `${relay}家`, icon: Route },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 flex items-center gap-3"
        >
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
