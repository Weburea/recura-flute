"use client";

import React, { createContext, useContext, useCallback, useMemo, useSyncExternalStore } from "react";
import { SUPPORTED_LANGUAGES, LanguageOption } from "@/lib/i18n/languages";
import { getTranslation, translateKey, TranslationDictionary } from "@/lib/i18n";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (path: string, fallback?: string) => string;
  dictionary: TranslationDictionary;
  currentLanguage: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "recura_preferred_language";
const LANGUAGE_EVENT = "recura_language_change";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_EVENT, callback);
  };
}

function getClientSnapshot(): string {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors
  }
  return "en";
}

function getServerSnapshot(): string {
  return "en";
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  // Handle setting language and caching in local storage
  const setLanguage = useCallback((newLang: string) => {
    const valid = SUPPORTED_LANGUAGES.find(
      (l) => l.code.toLowerCase() === newLang.toLowerCase() || l.name.toLowerCase() === newLang.toLowerCase()
    );
    const code = valid ? valid.code : "en";
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
        document.documentElement.lang = code;
        window.dispatchEvent(new Event(LANGUAGE_EVENT));
      } catch {
        // Storage fail fallback
      }
    }
  }, []);

  const dictionary = useMemo(() => getTranslation(language), [language]);

  const currentLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = useCallback(
    (path: string, fallback?: string) => {
      return translateKey(dictionary, path, fallback);
    },
    [dictionary]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dictionary,
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
