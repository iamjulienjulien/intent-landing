import type { Metadata } from "next";
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
            <body className="min-h-dvh bg-black text-white">
                <div className="ids-page-bg" />
                {children}
            </body>
        </html>
    );
}
