"use client";

import { useState, useCallback } from "react";
import { Bookmark, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function BookmarkButton() {
  const { lang } = useLanguage();
  const [showTip, setShowTip] = useState(false);

  const handleClick = useCallback(async () => {
    // Legacy IE
    if (typeof window !== "undefined" && "external" in window) {
      try {
        // @ts-expect-error legacy IE API
        await window.external.addFavorite(window.location.href, document.title);
        return;
      } catch {
        // fall through
      }
    }

    // Mobile share sheet
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        return;
      } catch {
        // fall through
      }
    }

    // Show keyboard shortcut tip
    setShowTip(true);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors min-h-[44px]"
        aria-label={t(lang, "bookmark.button")}
        title={t(lang, "bookmark.button")}
      >
        <Bookmark className="w-4 h-4" />
        <span className="hidden sm:inline">{t(lang, "bookmark.button")}</span>
      </button>

      {showTip && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowTip(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{t(lang, "bookmark.title")}</h4>
              <button
                onClick={() => setShowTip(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={lang === "en" ? "Close" : "关闭"}
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {t(lang, "bookmark.tip")}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">{t(lang, "bookmark.windows")}</span>
                <span className="font-mono font-medium text-gray-900 dark:text-white">Ctrl + D</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">{t(lang, "bookmark.mac")}</span>
                <span className="font-mono font-medium text-gray-900 dark:text-white">⌘ + D</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
