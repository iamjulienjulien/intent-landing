import type { Locale } from "./types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./constants";

/**
 * Very small Accept-Language parser:
 * - handles: "fr-CH,fr;q=0.9,en;q=0.8"
 * - picks first supported locale by q weight (desc).
 */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
    if (!header) return DEFAULT_LOCALE;

    const candidates = header
        .split(",")
        .map((part) => part.trim())
        .map((part) => {
            const [tagRaw, ...params] = part.split(";").map((x) => x.trim());
            const tag = tagRaw.toLowerCase();
            const qParam = params.find((p) => p.startsWith("q="));
            const q = qParam ? Number(qParam.slice(2)) : 1;
            const base = tag.split("-")[0]; // fr-CA -> fr
            return { base, q: Number.isFinite(q) ? q : 1 };
        })
        .sort((a, b) => b.q - a.q);

    for (const c of candidates) {
        if ((SUPPORTED_LOCALES as readonly string[]).includes(c.base)) {
            return c.base as Locale;
        }
    }

    return DEFAULT_LOCALE;
}
