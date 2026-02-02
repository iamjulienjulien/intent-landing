import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LOCALE_COOKIE, LOCALE_QUERY_PARAM, SUPPORTED_LOCALES } from "@/lib/locale/constants";
import { resolveLocaleFromRequest } from "@/lib/locale/resolve";

/* ============================================================================
   🌍 Locale middleware
   Order:
   1) ?lang=
   2) cookie
   3) accept-language
============================================================================ */

export function middleware(req: NextRequest) {
    const url = req.nextUrl;

    const searchParamsLang = url.searchParams.get(LOCALE_QUERY_PARAM);
    const cookieLang = req.cookies.get(LOCALE_COOKIE)?.value ?? null;
    const acceptLanguage = req.headers.get("accept-language");

    const { locale, reason } = resolveLocaleFromRequest({
        searchParamsLang,
        cookieLang,
        acceptLanguage,
    });

    const isQuerySupported =
        typeof searchParamsLang === "string" &&
        (SUPPORTED_LOCALES as readonly string[]).includes(searchParamsLang);

    const cookieOptions = {
        path: "/",
        sameSite: "lax" as const,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
    };

    /* ============================================================================
       ✅ 1) ?lang= → set cookie + (optional) clean URL
       Important: cookie must be set on the SAME response we return.
    ============================================================================ */

    if (isQuerySupported) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.searchParams.delete(LOCALE_QUERY_PARAM);

        const res = NextResponse.redirect(redirectUrl);
        res.cookies.set(LOCALE_COOKIE, locale, cookieOptions);
        return res;
    }

    /* ============================================================================
       ✅ 2/3) No query param → normal response
    ============================================================================ */

    const res = NextResponse.next();

    // ✅ 3) If no cookie yet, persist accept-language result (one-time)
    if (!cookieLang && reason === "accept-language") {
        res.cookies.set(LOCALE_COOKIE, locale, cookieOptions);
    }

    return res;
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
