"use client";

import { IntentSurface } from "intent-design-system";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type TileKind = "informed" | "empowered" | "warned" | "threatened" | "themed" | "glowed";

type TileProps = {
    label: string;
    hint: string;
    kind: TileKind;
};

function Tile({ label, hint, kind }: TileProps) {
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
            glow={kind === "glowed" ? "aurora" : true}
            className={cn("relative overflow-hidden rounded-2xl p-5")}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs tracking-[0.35em] uppercase">{label}</div>
            </div>
            <div className="mt-3 text-sm font-semibold opacity-90">{hint}</div>
        </IntentSurface>
    );
}

type PreviewTilesProps = {
    items: {
        informed: { label: string; hint: string };
        empowered: { label: string; hint: string };
        warned: { label: string; hint: string };
        threatened: { label: string; hint: string };
        themed: { label: string; hint: string };
        glowed: { label: string; hint: string };
    };
};

export default function PreviewTiles({ items }: PreviewTilesProps) {
    return (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Tile kind="informed" label={items.informed.label} hint={items.informed.hint} />
            <Tile kind="empowered" label={items.empowered.label} hint={items.empowered.hint} />
            <Tile kind="warned" label={items.warned.label} hint={items.warned.hint} />
            <Tile kind="threatened" label={items.threatened.label} hint={items.threatened.hint} />
            <Tile kind="themed" label={items.themed.label} hint={items.themed.hint} />
            <Tile kind="glowed" label={items.glowed.label} hint={items.glowed.hint} />
        </div>
    );
}
