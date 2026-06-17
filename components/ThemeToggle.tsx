"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
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
        aria-label="切换主题"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px]"
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
      title={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
