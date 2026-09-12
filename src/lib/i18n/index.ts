import { en, TranslationDictionary } from "./translations/en";
import { fr } from "./translations/fr";
import { es } from "./translations/es";
import { de } from "./translations/de";
import { pt } from "./translations/pt";
import { ja } from "./translations/ja";

export * from "./languages";
export * from "./translations/en";

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  en,
  fr,
  es,
  de,
  pt,
  ja,
};

export function getTranslation(languageCode: string): TranslationDictionary {
  const normalized = (languageCode || "en").toLowerCase();
  return TRANSLATIONS[normalized] || TRANSLATIONS.en;
}

/**
 * Safe nested key resolver e.g. t('settings.adminProfile') or t('common.save')
 */
export function translateKey(
  langDict: TranslationDictionary,
  path: string,
  fallback?: string
): string {
  if (!path) return fallback || "";
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = langDict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return fallback !== undefined ? fallback : path;
    }
  }

  return typeof current === "string" ? current : fallback || path;
}
