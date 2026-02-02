import type { Locale } from "./types";

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "fr"] as const;

export const LOCALE_COOKIE = "ids_locale";
export const LOCALE_QUERY_PARAM = "lang";
