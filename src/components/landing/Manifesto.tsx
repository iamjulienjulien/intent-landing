// src/components/Manifesto.tsx

import React from "react";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

export default async function Manifesto() {
    const locale = await getLocale();
    const copy = getCopy(locale);
    const m = copy.manifesto;

    return (
        <section className="container section">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 p-8 md:p-10">
                    <p className="text-xs tracking-[0.35em] uppercase text-dim">{m.eyebrow}</p>

                    <h2 className="mt-4">{m.title}</h2>

                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
                        <p className="text-white/80">{m.paragraphs.opening}</p>

                        <p>
                            {m.paragraphs.intent.replace("intent", "")}
                            <strong>intent</strong>.
                        </p>

                        <div className="rounded-2xl border border-white/10 bg-black/25 p-6">
                            <p className="text-xs tracking-[0.35em] uppercase text-dim">
                                {m.directive.eyebrow}
                            </p>
                            <p className="mt-3 text-white/85">
                                {m.directive.line1}
                                <br />
                                They are <strong>{m.directive.line2Strong}</strong>.
                            </p>
                        </div>

                        <p>{m.paragraphs.restraint}</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a className="btn" href="/playground">
                            {m.actions.playground}
                        </a>
                        <a
                            className="btn btn-ghost"
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {m.actions.github}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
