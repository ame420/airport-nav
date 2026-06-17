"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { t, type TranslationKey } from "@/lib/i18n";

interface FilterBarProps {
  onFilterChange?: (filter: string) => void;
}

const FILTERS = [
  { value: "全部", key: "filter.all" as TranslationKey },
  { value: "低价", key: "filter.lowPrice" as TranslationKey },
  { value: "性价比", key: "filter.value" as TranslationKey },
  { value: "月付", key: "filter.monthly" as TranslationKey },
  { value: "中转", key: "filter.relay" as TranslationKey },
  { value: "专线", key: "filter.dedicated" as TranslationKey },
  { value: "大流量", key: "filter.bigTraffic" as TranslationKey },
  { value: "解锁流媒体", key: "filter.streaming" as TranslationKey },
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const { lang } = useLanguage();
  const [active, setActive] = useState(FILTERS[0].value);

  const handleClick = (filter: string) => {
    setActive(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
      {FILTERS.map((item) => (
        <button
          key={item.value}
          onClick={() => handleClick(item.value)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium border rounded-full transition-colors cursor-pointer min-h-[44px] ${
            active === item.value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-200 dark:hover:border-gray-500"
          }`}
        >
          {t(lang, item.key)}
        </button>
      ))}
    </div>
  );
}
