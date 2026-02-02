import type { Locale } from "./types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./constants";

/* ============================================================================
   🧠 Locale resolution helpers
============================================================================ */

function isSupportedLocale(x: string): x is Locale {
    return (SUPPORTED_LOCALES as readonly string[]).includes(x);
}

function normalizeLocale(x: string | null | undefined): Locale | null {
    if (!x) return null;

    const v = x.toLowerCase().trim();

    // Accept "en" / "fr"
    if (isSupportedLocale(v)) return v;

    // Accept "en-US", "fr-FR", etc.
    const base = v.split(",")[0]?.split(";")[0]?.split("-")[0]?.trim();
    if (base && isSupportedLocale(base)) return base;

    return null;
}

/* ============================================================================
   ✅ Public resolver
============================================================================ */

export function resolveLocaleFromRequest(input: {
    searchParamsLang: string | null;
    cookieLang: string | null;
    acceptLanguage: string | null;
}): { locale: Locale; reason: "query" | "cookie" | "accept-language" | "default" } {
    const fromQuery = normalizeLocale(input.searchParamsLang);
    if (fromQuery) return { locale: fromQuery, reason: "query" };

    const fromCookie = normalizeLocale(input.cookieLang);
    if (fromCookie) return { locale: fromCookie, reason: "cookie" };

    // Accept-Language: "fr-FR,fr;q=0.9,en;q=0.8"
    const fromHeader = normalizeLocale(input.acceptLanguage);
    if (fromHeader) return { locale: fromHeader, reason: "accept-language" };

    return { locale: DEFAULT_LOCALE, reason: "default" };
}
