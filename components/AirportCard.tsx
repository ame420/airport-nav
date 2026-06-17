"use client";

import { Star, Zap, Globe, ExternalLink } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { useLanguage } from "./LanguageProvider";
import { t, translateCategory } from "@/lib/i18n";

export interface Airport {
  id: string;
  name: string;
  category: "低价" | "性价比";
  tags: string[];
  price: number;
  traffic: string;
  speed: string;
  score: number;
  support: string[];
  description: string;
  affiliateUrl: string;
  officialUrl: string;
  officialUrls?: string[];
  reviewUrl?: string;
  bandwidth?: string;
}

export function AirportCard({ airport }: { airport: Airport }) {
  const { lang } = useLanguage();
  const extraUrls = airport.officialUrls?.slice(1) ?? [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{airport.name}</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              airport.category === "低价"
                ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            }`}
          >
            {translateCategory(lang, airport.category)}
          </span>
          {airport.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {airport.description}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, "card.monthlyFee")}</div>
          <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">¥{airport.price}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, "card.traffic")}</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{airport.traffic}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, "card.speed")}</div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{airport.speed}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, "card.score")}</div>
          <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {airport.score}
          </div>
        </div>
      </div>

      {airport.bandwidth && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded">
            {t(lang, "card.bandwidth")}: {airport.bandwidth}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {t(lang, "card.unlock")}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {airport.support.map((item) => (
            <span
              key={item}
              className="px-2 py-1 text-xs bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <a
          href={airport.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Zap className="w-4 h-4" />
          {t(lang, "card.register")}
          <ExternalLink className="w-4 h-4" />
        </a>

        <CopyButton text={airport.affiliateUrl} />

        {extraUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {extraUrls.map((url, idx) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline"
              >
                {t(lang, "card.backup")}{idx + 1}
              </a>
            ))}
          </div>
        )}

        {airport.reviewUrl && (
          <a
            href={airport.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            {t(lang, "card.review")} →
          </a>
        )}
      </div>
    </div>
  );
}
