// src/components/Preview.tsx

import React from "react";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";
import PreviewClientWrapper from "./PreviewClientWrapper";

export default async function Preview() {
    const locale = await getLocale();
    const copy = getCopy(locale);
    const p = copy.preview;

    return (
        <section className="container section">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs tracking-[0.35em] uppercase text-dim">{p.eyebrow}</p>
                <h2 className="mt-4">{p.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">
                    {p.lead[0]} {p.lead[1]}
                </p>
            </div>

            <PreviewClientWrapper items={p.tile.items} />

            <div className="mt-8 text-center">
                <a className="btn" href="/playground">
                    {p.cta.playground}
                </a>
            </div>
        </section>
    );
}
