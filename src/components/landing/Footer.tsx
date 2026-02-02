// src/components/Footer.tsx

import React from "react";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

export default async function Footer() {
    const locale = await getLocale();
    const copy = getCopy(locale);
    const f = copy.footer;

    return (
        <footer className="container section pt-10">
            <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="text-sm font-semibold text-white/85">{f.brand}</div>
                        <div className="mt-1 text-xs text-dim">{f.tagline}</div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs">
                        <a className="link" href="/playground">
                            {f.links.playground}
                        </a>
                        <a className="link" href="/doc">
                            Doc
                        </a>
                        <a
                            className="link"
                            href="https://github.com/iamjulienjulien/intent-design-system"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {f.links.github}
                        </a>
                        <a
                            className="link"
                            href="https://www.npmjs.com/package/intent-design-system"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {f.links.npm}
                        </a>
                    </div>
                </div>

                <div className="mt-6 h-px bg-white/10" />

                <div className="mt-4 flex flex-col gap-2 text-xs text-dim md:flex-row md:items-center md:justify-between">
                    <span>
                        {f.bottom.copyrightPrefix} {new Date().getFullYear()} {f.bottom.author}
                    </span>
                    <span className="text-white/40">{f.bottom.note}</span>
                </div>
            </div>
        </footer>
    );
}
