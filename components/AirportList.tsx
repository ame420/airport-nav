"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AirportCard } from "./AirportCard";
import { FilterBar } from "./FilterBar";
import type { Airport } from "./AirportCard";
import { useFavorites } from "@/hooks/useFavorites";
import airportsData from "@/data/airports.json";

const airports = airportsData as Airport[];

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "score-desc"
  | "traffic-desc";

function parseTraffic(traffic: string): number {
  const match = traffic.match(/(\d+(?:\.\d+)?)\s*[GT]B?/i);
  return match ? parseFloat(match[1]) : 0;
}

export function AirportList() {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const { favorites, toggleFavorite, isFavorite, ready } = useFavorites();

  const normalizedQuery = query.trim().toLowerCase();

  const filteredAirports = useMemo(() => {
    let result = airports;

    // 1. Filter by category / tags / favorites
    if (filter !== "全部") {
      result = result.filter((airport) => {
        switch (filter) {
          case "我的收藏":
            return favorites.includes(airport.id);
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
          airport.tags.some((tag) =>
            tag.toLowerCase().includes(normalizedQuery)
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
        case "score-desc":
          return b.score - a.score;
        case "traffic-desc":
          return parseTraffic(b.traffic) - parseTraffic(a.traffic);
        case "default":
        default:
          // recommend first, then score desc
          if (a.recommend !== b.recommend) return a.recommend ? -1 : 1;
          return b.score - a.score;
      }
    });

    return result;
  }, [filter, normalizedQuery, sort, favorites]);

  const hasActiveFilter =
    filter !== "全部" || normalizedQuery !== "" || sort !== "default";

  return (
    <>
      <FilterBar onFilterChange={setFilter} />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索机场名称、标签或描述..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative flex-shrink-0">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="default">默认推荐</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="score-desc">评分从高到低</option>
            <option value="traffic-desc">流量从大到小</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {hasActiveFilter
            ? `找到 ${filteredAirports.length} 家机场`
            : `共收录 ${filteredAirports.length} 家机场`}
        </h2>
        {filter === "我的收藏" && ready && favorites.length === 0 && (
          <p className="text-sm text-gray-500">点击卡片上的 ❤️ 收藏机场</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAirports.map((airport) => (
          <AirportCard
            key={airport.id}
            airport={airport}
            isFavorite={isFavorite(airport.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filteredAirports.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">没有找到匹配的机场</p>
          <button
            onClick={() => {
              setFilter("全部");
              setQuery("");
              setSort("default");
            }}
            className="mt-4 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            清除筛选
          </button>
        </div>
      )}
    </>
  );
}
