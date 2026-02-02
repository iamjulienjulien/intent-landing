import type { Locale } from "./types";
import { SUPPORTED_LOCALES } from "./constants";

export function isLocale(x: unknown): x is Locale {
    return typeof x === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(x);
}
