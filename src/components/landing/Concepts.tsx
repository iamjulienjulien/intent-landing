// src/components/Concepts.tsx

import React from "react";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type ConceptCardProps = {
    eyebrow: string;
    title: string;
    body: React.ReactNode;
};

function ConceptCard({ eyebrow, title, body }: ConceptCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
            <div className="text-xs tracking-[0.35em] uppercase text-dim">{eyebrow}</div>
            <h3 className="mt-3 text-xl font-semibold leading-snug">{title}</h3>
            <div className="mt-3 text-sm leading-relaxed text-muted">{body}</div>
        </div>
    );
}

export default async function Concepts() {
    const locale = await getLocale();
    const copy = getCopy(locale);
    const c = copy.concepts;

    return (
        <section className="container section">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs tracking-[0.35em] uppercase text-dim">{c.eyebrow}</p>
                <h2 className="mt-4">{c.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">
                    {c.lead.line1} <span className="text-white/85">{c.lead.highlight}</span>{" "}
                    {c.lead.line2}
                </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
                <ConceptCard
                    eyebrow={c.cards.intent.eyebrow}
                    title={c.cards.intent.title}
                    body={
                        <>
                            {c.cards.intent.body.line1Prefix}
                            <strong>{c.cards.intent.body.strong}</strong>
                            {c.cards.intent.body.line1Suffix}
                            <div className="mt-3 text-xs text-dim">{c.cards.intent.body.rule}</div>
                        </>
                    }
                />

                <ConceptCard
                    eyebrow={c.cards.variants.eyebrow}
                    title={c.cards.variants.title}
                    body={
                        <>
                            {c.cards.variants.body.line1Prefix}
                            <strong>{c.cards.variants.body.strong}</strong>
                            {c.cards.variants.body.line1Suffix}
                            <div className="mt-3 text-xs text-dim">
                                {c.cards.variants.body.rule}
                            </div>
                        </>
                    }
                />

                <ConceptCard
                    eyebrow={c.cards.tone.eyebrow}
                    title={c.cards.tone.title}
                    body={
                        <>
                            {c.cards.tone.body.line1}
                            <div className="mt-3 text-xs text-dim">{c.cards.tone.body.rule}</div>
                        </>
                    }
                />

                <ConceptCard
                    eyebrow={c.cards.glow.eyebrow}
                    title={c.cards.glow.title}
                    body={
                        <>
                            {c.cards.glow.body.line1Prefix}
                            <strong>{c.cards.glow.body.strong}</strong>
                            {c.cards.glow.body.line1Suffix}
                            <div className="mt-3 text-xs text-dim">{c.cards.glow.body.rule}</div>
                        </>
                    }
                />
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                    <p className="text-xs tracking-[0.35em] uppercase text-dim">{c.note.eyebrow}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{c.note.body}</p>
                </div>
            </div>
        </section>
    );
}
