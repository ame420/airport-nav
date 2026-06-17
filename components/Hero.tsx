"use client";

import { AlertTriangle } from "lucide-react";
import { BookmarkButton } from "./BookmarkButton";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t(lang, "site.title")}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              {t(lang, "site.description")}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <BookmarkButton />
            <a
              href="https://github.com/KaWaIDeSuNe/dijiajichang"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
              aria-label={t(lang, "github.button")}
              title="GitHub: dijiajichang"
            >
              <img
                src="https://github.com/KaWaIDeSuNe.png"
                alt=""
                className="w-6 h-6 rounded-full"
                loading="lazy"
              />
              <span className="hidden sm:inline">{t(lang, "github.button")}</span>
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold mb-1">{t(lang, "hero.riskTitle")}</p>
            <p className="dark:text-yellow-100">{t(lang, "hero.riskText")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
