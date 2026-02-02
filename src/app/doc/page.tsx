// src/app/doc/page.tsx

import type { Metadata } from "next";

import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

/* ============================================================================
   UI bits
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function Anchor({ id }: { id: string }) {
    return <span id={id} className="block scroll-mt-24" aria-hidden="true" />;
}

function SectionHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="mx-auto max-w-3xl">
            <p className="text-xs tracking-[0.35em] uppercase text-dim">{eyebrow}</p>
            <h2 className="mt-4">{title}</h2>
            {description ? (
                <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
            ) : null}
        </div>
    );
}

function Block({
    id,
    eyebrow,
    title,
    description,
    children,
}: {
    id: string;
    eyebrow: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="container section">
            <Anchor id={id} />
            <SectionHeader eyebrow={eyebrow} title={title} description={description} />
            <div className="mx-auto mt-6 max-w-3xl">{children}</div>
        </section>
    );
}

function CodeCard({ title, code, note }: { title: string; code: string; note?: string }) {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl bg-black/25 ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/30 px-4 py-3">
                <div className="text-xs tracking-[0.18em] opacity-70">{title.toUpperCase()}</div>

                {/* Optional copy hint (no JS here; keeps server component safe) */}
                <div className="text-[11px] opacity-40">⌘C</div>
            </div>

            <pre className="p-4 overflow-auto text-xs opacity-85">
                <code>{code}</code>
            </pre>

            {note ? <div className="px-4 pb-4 text-xs opacity-55">{note}</div> : null}
        </div>
    );
}

function Toc({
    items,
    title = "On this page",
}: {
    title?: string;
    items: Array<{ href: string; label: string; sub?: string }>;
}) {
    return (
        <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/3 p-4">
                <div className="text-xs tracking-[0.35em] uppercase text-dim">{title}</div>
                <nav className="mt-3 space-y-2 text-sm">
                    {items.map((it) => (
                        <a
                            key={it.href}
                            href={it.href}
                            className={cn(
                                "block rounded-xl px-3 py-2",
                                "text-muted hover:text-white",
                                "hover:bg-white/4 transition"
                            )}
                        >
                            <div className="opacity-90">{it.label}</div>
                            {it.sub ? (
                                <div className="text-xs opacity-50 mt-0.5">{it.sub}</div>
                            ) : null}
                        </a>
                    ))}
                </nav>

                <div className="mt-4 h-px bg-white/10" />

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <a className="btn btn-ghost" href="/playground">
                        Playground
                    </a>
                    <a className="btn btn-ghost" href="#top">
                        ↑ Top
                    </a>
                </div>
            </div>
        </aside>
    );
}

/* ============================================================================
   Metadata
============================================================================ */

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const copy = getCopy(locale);

    return {
        title: copy.doc.meta.title,
        description: copy.doc.meta.description,
    };
}

/* ============================================================================
   Page
============================================================================ */

export default async function DocPage() {
    const locale = await getLocale();
    const copy = getCopy(locale);

    const tocItems = [
        {
            href: "#quickstart",
            label: copy.doc.quickstart.title,
            sub: copy.doc.quickstart.eyebrow,
        },
        {
            href: "#concepts",
            label: copy.doc.concepts.title,
            sub: copy.doc.concepts.eyebrow,
        },
        {
            href: "#links",
            label: copy.doc.links.title,
            sub: copy.doc.links.eyebrow,
        },
    ];

    return (
        <main className="min-h-dvh relative z-10">
            <span id="top" className="block scroll-mt-24" aria-hidden="true" />

            {/* Hero */}
            <section className="container section">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mb-4 text-xs tracking-[0.35em] uppercase text-dim">
                        {copy.doc.eyebrow}
                    </p>

                    <h1 className="mx-auto max-w-3xl">{copy.doc.title}</h1>

                    <div className="mx-auto mt-8 h-px w-16 bg-white/10" />

                    <p className="mx-auto mt-8 max-w-2xl text-lg text-muted leading-relaxed">
                        {copy.doc.lead}
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <a className="btn" href="/playground">
                            {copy.doc.ctaPlayground}
                        </a>
                        <a
                            className="btn btn-ghost"
                            href={copy.doc.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {copy.doc.ctaGithub}
                        </a>
                    </div>

                    {/* tiny doc hints */}
                    <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2 text-xs opacity-55">
                        <span className="rounded-full bg-white/5 py-1 ring-1 ring-white/10">
                            ⌘K / Ctrl+K
                        </span>
                        <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                            Stable hooks
                        </span>
                        <span className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                            Intent-first
                        </span>
                    </div>
                </div>
            </section>

            {/* Content + TOC */}
            <section className="container section">
                <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                    <div className="min-w-0">
                        {/* Quickstart */}
                        <Block
                            id="quickstart"
                            eyebrow={copy.doc.quickstart.eyebrow}
                            title={copy.doc.quickstart.title}
                            description={copy.doc.quickstart.body}
                        >
                            <CodeCard
                                title={copy.doc.quickstart.installTitle}
                                code={copy.doc.quickstart.installCode}
                            />

                            <CodeCard
                                title={copy.doc.quickstart.usageTitle}
                                code={copy.doc.quickstart.usageCode}
                                note={copy.doc.quickstart.note}
                            />
                        </Block>

                        {/* Concepts */}
                        <Block
                            id="concepts"
                            eyebrow={copy.doc.concepts.eyebrow}
                            title={copy.doc.concepts.title}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {copy.doc.concepts.cards.map((c) => (
                                    <div
                                        key={c.title}
                                        className={cn(
                                            "rounded-2xl border border-white/10 bg-white/3 p-6",
                                            "transition hover:bg-white/5 hover:border-white/15"
                                        )}
                                    >
                                        <div className="text-xs tracking-[0.35em] uppercase text-dim">
                                            {c.eyebrow}
                                        </div>
                                        <h3 className="mt-3 text-xl font-semibold leading-snug">
                                            {c.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-muted">
                                            {c.body}
                                        </p>
                                        <p className="mt-3 text-xs opacity-55">{c.rule}</p>
                                    </div>
                                ))}
                            </div>
                        </Block>

                        {/* Links */}
                        <Block
                            id="links"
                            eyebrow={copy.doc.links.eyebrow}
                            title={copy.doc.links.title}
                        >
                            <div className="mt-2 flex flex-wrap gap-3 text-xs">
                                <a className="link" href="/playground">
                                    {copy.doc.links.playground}
                                </a>
                                <a
                                    className="link"
                                    href={copy.doc.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {copy.doc.links.github}
                                </a>
                                <a
                                    className="link"
                                    href={copy.doc.npmUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {copy.doc.links.npm}
                                </a>
                            </div>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                                <p className="text-xs tracking-[0.35em] uppercase text-dim">
                                    {copy.doc.links.noteEyebrow}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-muted">
                                    {copy.doc.links.noteBody}
                                </p>
                            </div>
                        </Block>
                    </div>

                    <Toc items={tocItems} />
                </div>
            </section>
        </main>
    );
}
