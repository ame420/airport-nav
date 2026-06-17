"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "airport-nav-lang";
const DEFAULT_LANG: Lang = "zh";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with default to match SSR/prerender, then switch to stored lang on
  // mount to avoid hydration mismatch.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = (next: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
