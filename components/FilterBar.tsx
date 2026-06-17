"use client";

import { useState } from "react";

interface FilterBarProps {
  onFilterChange?: (filter: string) => void;
}

const filters = [
  "全部",
  "低价",
  "性价比",
  "月付",
  "中转",
  "专线",
  "大流量",
  "解锁流媒体",
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [active, setActive] = useState("全部");

  const handleClick = (filter: string) => {
    setActive(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {filters.map((item) => (
        <button
          key={item}
          onClick={() => handleClick(item)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium border rounded-full transition-colors cursor-pointer min-h-[44px] ${
            active === item
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-200 dark:hover:border-gray-500"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
