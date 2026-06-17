"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    setLang(lang === "zh" ? "en" : "zh");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 min-h-[44px]"
        aria-label={t("zh", "language.switch")}
      >
        <Languages className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">中文</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
      aria-label={t(lang, "language.switch")}
      title={t(lang, "language.switch")}
    >
      <Languages className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">
        {t(lang, lang === "zh" ? "language.zh" : "language.en")}
      </span>
    </button>
  );
}
