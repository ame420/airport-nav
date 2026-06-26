"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AirportCard } from "./AirportCard";
import { FilterBar } from "./FilterBar";
import { useLanguage } from "./LanguageProvider";
import { t, type TranslationKey } from "@/lib/i18n";
import type { Airport } from "./AirportCard";
import airportsData from "@/data/airports.json";

const airports = airportsData as Airport[];

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "traffic-desc";

const SORT_OPTIONS: { value: SortOption; key: TranslationKey }[] = [
  { value: "default", key: "sort.default" },
  { value: "price-asc", key: "sort.priceAsc" },
  { value: "price-desc", key: "sort.priceDesc" },
  { value: "traffic-desc", key: "sort.trafficDesc" },
];

function parseTraffic(traffic: string): number {
  const match = traffic.match(/(\d+(?:\.\d+)?)\s*[GT]B?/i);
  return match ? parseFloat(match[1]) : 0;
}

export function AirportList() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredAirports = useMemo(() => {
    let result = airports;

    // 1. Filter by category / tags
    if (filter !== "全部") {
      result = result.filter((airport) => {
        switch (filter) {
          case "低价":
            return airport.category === "低价";
          case "性价比":
            return airport.category === "性价比";
          case "月付":
            return airport.price <= 20;
          case "中转":
            return airport.tags.some((tag) => tag.includes("中转"));
          case "专线":
            return airport.tags.some(
              (tag) => tag.includes("专线") || tag.includes("IPLC")
            );
          case "大流量":
            return (
              airport.tags.includes("大流量") ||
              /(1000|2000|2048|5000)G/.test(airport.traffic)
            );
          case "解锁流媒体":
            return airport.support.some((item) =>
              ["Netflix", "Disney+", "TikTok"].includes(item)
            );
          default:
            return true;
        }
      });
    }

    // 2. Search by name / tags / description
    if (normalizedQuery) {
      result = result.filter(
        (airport) =>
          airport.name.toLowerCase().includes(normalizedQuery) ||
          airport.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)
          ) ||
          airport.description.toLowerCase().includes(normalizedQuery)
      );
    }

    // 3. Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "traffic-desc":
          return parseTraffic(b.traffic) - parseTraffic(a.traffic);
        case "default":
        default:
          return 0;
      }
    });

    return result;
  }, [filter, normalizedQuery, sort]);

  const hasActiveFilter =
    filter !== "全部" || normalizedQuery !== "" || sort !== "default";

  return (
    <>
      <FilterBar onFilterChange={setFilter} />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, "search.placeholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          />
        </div>

        <div className="relative flex-shrink-0">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-full sm:w-auto pl-10 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-h-[44px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(lang, option.key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
          {hasActiveFilter
            ? t(lang, "result.found", { count: filteredAirports.length })
            : t(lang, "result.total", { count: filteredAirports.length })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAirports.map((airport) => (
          <AirportCard key={airport.id} airport={airport} />
        ))}
      </div>

      {filteredAirports.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">{t(lang, "result.empty")}</p>
          <button
            onClick={() => {
              setFilter("全部");
              setQuery("");
              setSort("default");
            }}
            className="mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {t(lang, "result.clear")}
          </button>
        </div>
      )}
    </>
  );
}
