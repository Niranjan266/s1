"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, translate, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const t = useCallback((path: string) => translate(path), []);
  return <LanguageContext.Provider value={{ lang: DEFAULT_LANG, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext) ?? {
    lang: DEFAULT_LANG,
    t: (path) => translate(path),
  };
}
