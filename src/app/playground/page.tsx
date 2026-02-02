// src/app/playground/page.tsx
import React from "react";

import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

import PlaygroundClient from "./_components/PlaygroundClient";

export default async function PlaygroundPage() {
    const locale = await getLocale();
    const copy = getCopy(locale);

    return (
        <main className="min-h-screen text-white relative z-10">
            <section className="container section">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs tracking-[0.35em] uppercase text-dim">
                        {copy.playground.eyebrow}
                    </p>
                    <h1 className="mt-4">{copy.playground.title}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed">
                        {copy.playground.lead}
                    </p>
                </div>

                <div className="mt-10">
                    <PlaygroundClient copy={copy.playground.ui} />
                </div>
            </section>
        </main>
    );
}
