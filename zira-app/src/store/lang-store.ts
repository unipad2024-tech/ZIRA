import { create } from "zustand";
import { persist } from "zustand/middleware";

type Lang = "en" | "ar";

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === "en" ? "ar" : "en" }),
    }),
    { name: "zira-lang" }
  )
);

/* Tiny translation helper */
export function t(
  key: string,
  strings: Record<string, Record<Lang, string>>,
  lang: Lang
): string {
  return strings[key]?.[lang] ?? key;
}
