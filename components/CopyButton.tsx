"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { t } from "@/lib/i18n";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for environments without clipboard API
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // ignore
      }
    }
  };

  const label = copied ? t(lang, "card.copied") : t(lang, "card.copy");

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          {label}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}
