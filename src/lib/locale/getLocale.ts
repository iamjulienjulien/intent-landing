import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE } from "./constants";
import { resolveLocaleFromRequest } from "./resolve";

export async function getLocale() {
    const cookieLang = (await cookies()).get(LOCALE_COOKIE)?.value ?? null;
    const acceptLanguage = (await headers()).get("accept-language");

    // Pas de searchParams ici (server component) -> on gère ?lang= via middleware
    return resolveLocaleFromRequest({
        searchParamsLang: null,
        cookieLang,
        acceptLanguage,
    }).locale;
}
