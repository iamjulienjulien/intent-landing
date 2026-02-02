// src/lib/copy/getCopy.ts
import { en } from "@/copy/en";
import { fr } from "@/copy/fr";

export type Locale = "en" | "fr";

export function getCopy(locale: Locale) {
    return locale === "fr" ? fr : en;
}
