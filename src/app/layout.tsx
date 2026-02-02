import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "intent-design-system/styles";

import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const copy = getCopy(locale);

    return {
        title: copy.meta.title,
        description: copy.meta.description,
    };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <head>
                <Script id="plausible-stub" strategy="beforeInteractive">
                    {`
                      window.plausible = window.plausible || function() {
                        (window.plausible.q = window.plausible.q || []).push(arguments)
                      }
                    `}
                </Script>
                <Script
                    strategy="afterInteractive"
                    defer
                    data-domain="intent.julienjulien.fr"
                    src="https://plausible.io/js/script.js"
                />
            </head>
            <body className="min-h-dvh bg-black text-white">
                <div className="ids-page-bg" />
                {children}
            </body>
        </html>
    );
}
