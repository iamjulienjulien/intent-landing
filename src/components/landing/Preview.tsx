// src/components/Preview.tsx

import React from "react";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";

// ✅ Real DS components
import { IntentSurface, IntentIndicator } from "intent-design-system";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type TileKind = "informed" | "empowered" | "warned" | "threatened" | "themed" | "glowed";

type TileProps = {
    label: string;
    hint: string;
    kind: TileKind;
    badge: string;
    notePrefix: string;
    playgroundPath: string;
};

function Tile({ label, hint, kind, badge, notePrefix, playgroundPath }: TileProps) {
    const intent =
        kind === "glowed"
            ? ("glowed" as const)
            : (kind as "informed" | "empowered" | "warned" | "threatened" | "themed");

    return (
        <IntentSurface
            mode="dark"
            intent={intent}
            variant="elevated"
            intensity="soft"
            glow={kind === "glowed" ? "aurora" : true} // ✅ real glow rules
            className={cn("relative overflow-hidden rounded-2xl p-5")}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs tracking-[0.35em] uppercase">{label}</div>

                {/* ✅ real badge (indicator) */}
                {/* <IntentIndicator
                    mode="dark"
                    intent={intent} // badge stays neutral-ish
                    variant="outlined"
                    intensity="soft"
                >
                    {badge}
                </IntentIndicator> */}
            </div>

            <div className="mt-3 text-sm font-semibold opacity-90">{hint}</div>

            {/* <div className="mt-3 text-xs leading-relaxed text-muted">
                {notePrefix} <span className="font-mono">{playgroundPath}</span>.
            </div> */}
        </IntentSurface>
    );
}

export default async function Preview() {
    const locale = await getLocale();
    const copy = getCopy(locale);
    const p = copy.preview;

    const items = p.tile.items;

    return (
        <section className="container section">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs tracking-[0.35em] uppercase text-dim">{p.eyebrow}</p>
                <h2 className="mt-4">{p.title}</h2>
                <p className="mt-4 text-muted leading-relaxed">
                    {p.lead[0]} {p.lead[1]}
                </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
                <Tile
                    kind="informed"
                    label={items.informed.label}
                    hint={items.informed.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
                <Tile
                    kind="empowered"
                    label={items.empowered.label}
                    hint={items.empowered.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
                <Tile
                    kind="warned"
                    label={items.warned.label}
                    hint={items.warned.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
                <Tile
                    kind="threatened"
                    label={items.threatened.label}
                    hint={items.threatened.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
                <Tile
                    kind="themed"
                    label={items.themed.label}
                    hint={items.themed.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
                <Tile
                    kind="glowed"
                    label={items.glowed.label}
                    hint={items.glowed.hint}
                    badge={p.tile.badge}
                    notePrefix={p.tile.notePrefix}
                    playgroundPath={p.tile.playgroundPath}
                />
            </div>

            <div className="mt-8 text-center">
                <a className="btn" href="/playground">
                    {p.cta.playground}
                </a>
            </div>
        </section>
    );
}
