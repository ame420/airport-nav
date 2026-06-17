"use client";

import { useState, useMemo } from "react";
import { AirportCard } from "./AirportCard";
import { FilterBar } from "./FilterBar";
import type { Airport } from "./AirportCard";
import airportsData from "@/data/airports.json";

const airports = airportsData as Airport[];

export function AirportList() {
  const [filter, setFilter] = useState("全部");

  const filteredAirports = useMemo(() => {
    if (filter === "全部") return airports;

    return airports.filter((airport) => {
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
  }, [filter]);

  return (
    <>
      <FilterBar onFilterChange={setFilter} />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          共收录 {filteredAirports.length} 家机场
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAirports.map((airport) => (
          <AirportCard key={airport.id} airport={airport} />
        ))}
      </div>
    </>
  );
}
