"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render a neutral placeholder until mount.
  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 min-h-[44px] min-w-[44px]"
        aria-label={t("zh", "theme.light")}
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  const label = t(lang, theme === "dark" ? "theme.light" : "theme.dark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px]"
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
