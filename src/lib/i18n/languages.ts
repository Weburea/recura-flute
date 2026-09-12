export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  countryCode: string;
  flagUrl: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English (US)",
    countryCode: "us",
    flagUrl: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    countryCode: "fr",
    flagUrl: "https://flagcdn.com/w40/fr.png",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    countryCode: "es",
    flagUrl: "https://flagcdn.com/w40/es.png",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    countryCode: "de",
    flagUrl: "https://flagcdn.com/w40/de.png",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    countryCode: "pt",
    flagUrl: "https://flagcdn.com/w40/pt.png",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    countryCode: "jp",
    flagUrl: "https://flagcdn.com/w40/jp.png",
  },
];
