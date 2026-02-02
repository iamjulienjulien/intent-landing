"use client";

// src/app/playground/_components/PlaygroundClient.tsx
import React, { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
    IntentSurface,
    IntentControlButton,
    IntentControlSelect,
    IntentControlField,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,
} from "intent-design-system";

import { COMPONENT_LINKS } from "../components/_data/componentsLinks";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PlaygroundCopy = {
    controlsTitle: string;

    intent: string;
    variant: string;
    tone: string;
    glow: string;
    intensity: string;
    state: string;

    disabled: string;

    previewDark: string;
    previewLight: string;

    buttonLabel: string;
    surfaceTitle: string;
    surfaceBody: string;

    resolvedTitle: string;
    warningsTitle: string;

    hintToneOnly: string;
    hintGlowNormal: string;
    hintGlowGlowed: string;
};

type ComponentLink = {
    title: string;
    description: string;
    href: string;
    badge?: string;
};

function isAestheticGlow(glow: GlowName): boolean {
    return (
        glow === "aurora" ||
        glow === "ember" ||
        glow === "cosmic" ||
        glow === "mythic" ||
        glow === "royal" ||
        glow === "mono"
    );
}

function WarningsCard({
    title,
    items,
}: {
    title: string;
    items: Array<{ code: string; message: string }>;
}) {
    if (items.length === 0) return null;

    return (
        <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs tracking-[0.18em] opacity-55">{title.toUpperCase()}</div>
                <div className="text-[11px] opacity-45">
                    {items.length} warning{items.length > 1 ? "s" : ""}
                </div>
            </div>

            <div className="mt-3 space-y-2">
                {items.map((w) => (
                    <div
                        key={w.code}
                        className="rounded-xl bg-black/20 ring-1 ring-white/10 px-3 py-2 text-sm"
                    >
                        <div className="flex items-start gap-2">
                            <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-mono opacity-90">
                                {w.code}
                            </span>
                            <div className="opacity-75 leading-relaxed">{w.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function badgeEmoji(badge: string) {
    const b = badge.toLowerCase();
    if (b === "surface") return "🧱";
    if (b === "control") return "🕹️";
    if (b === "layout") return "🧭";
    if (b === "indicator") return "🚦";
    if (b === "feedback") return "🔔";
    if (b === "data") return "🧬";
    return "✨";
}

function ComponentsSection({ items }: { items: ComponentLink[] }) {
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return items;
        return items.filter((x) => {
            const hay = `${x.title} ${x.description} ${x.badge ?? ""} ${x.href}`.toLowerCase();
            return hay.includes(needle);
        });
    }, [items, q]);

    const grouped = useMemo(() => {
        const order = ["Surface", "Control", "Data", "Feedback", "Layout", "Indicator"] as const;

        const map = new Map<string, ComponentLink[]>();
        for (const it of filtered) {
            const k = it.badge ?? "Other";
            const arr = map.get(k) ?? [];
            arr.push(it);
            map.set(k, arr);
        }

        const keys = Array.from(map.keys()).sort((a, b) => {
            const ia = order.indexOf(a as any);
            const ib = order.indexOf(b as any);
            const sa = ia === -1 ? 999 : ia;
            const sb = ib === -1 ? 999 : ib;
            if (sa !== sb) return sa - sb;
            return a.localeCompare(b);
        });

        const groups = keys.map((k) => ({
            key: k,
            emoji: badgeEmoji(k),
            items: (map.get(k) ?? []).slice().sort((a, b) => a.title.localeCompare(b.title)),
        }));

        return groups;
    }, [filtered]);

    return (
        <section className="mt-10">
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs tracking-[0.18em] opacity-55">COMPONENTS</div>
                        <div className="mt-2 text-sm opacity-80">
                            Browse components and jump to dedicated playground pages.
                        </div>
                    </div>

                    <div className="w-full sm:w-85">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search: surface, toggle, tabs…"
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                        <div className="mt-1 flex items-center justify-between text-[11px] opacity-45">
                            <span>
                                {filtered.length}/{items.length} shown
                            </span>
                            <span className="hidden sm:inline">
                                Tip: <span className="font-mono">Ctrl/⌘ + K</span> (CommandPalette)
                            </span>
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-black/20 ring-1 ring-white/10 p-6">
                        <div className="text-sm font-semibold opacity-90">No results</div>
                        <div className="mt-2 text-xs opacity-65">
                            Try a broader query like <span className="font-mono">control</span> or{" "}
                            <span className="font-mono">intent</span>.
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 space-y-6">
                        {grouped.map((group) => (
                            <div key={group.key}>
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{group.emoji}</span>
                                        <div className="text-xs tracking-[0.18em] opacity-55">
                                            {group.key.toUpperCase()}
                                        </div>
                                        <span className="text-[11px] opacity-45">
                                            ({group.items.length})
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.items.map((x) => {
                                        const hrefShort = x.href.replace(
                                            "/playground/components/",
                                            ""
                                        );
                                        return (
                                            <a
                                                key={x.href}
                                                href={x.href}
                                                className={cn(
                                                    "group rounded-2xl bg-black/25 ring-1 ring-white/10 p-4",
                                                    "transition hover:bg-black/30 hover:ring-white/15",
                                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm font-semibold opacity-90">
                                                                {x.title}
                                                            </div>
                                                            {x.badge ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 ring-1 ring-white/10 px-2 py-0.5 text-[11px] opacity-75">
                                                                    <span aria-hidden>
                                                                        {badgeEmoji(x.badge)}
                                                                    </span>
                                                                    {x.badge}
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        <div className="mt-2 text-xs leading-relaxed opacity-70">
                                                            {x.description}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-1 opacity-45 group-hover:opacity-70">
                                                        <span className="text-[11px]">Open</span>
                                                        <span className="text-lg leading-none">
                                                            →
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* <div className="mt-4 flex items-center justify-between text-[11px]">
                                                    <span className="opacity-45">
                                                        /playground/components/
                                                    </span>
                                                    <span className="font-mono opacity-70 group-hover:opacity-90">
                                                        {hrefShort}
                                                    </span>
                                                </div> */}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

type PresetKey = "default" | "glow" | "toned" | "warning-demo";

const PRESETS: Record<
    PresetKey,
    {
        intent: IntentName;
        variant: VariantName;
        tone?: ToneName;
        glow?: boolean | GlowName;
        intensity: Intensity;
        disabled: boolean;
    }
> = {
    default: {
        intent: "informed",
        variant: "elevated",
        intensity: "medium",
        disabled: false,
        glow: false,
    },
    glow: {
        intent: "empowered",
        variant: "elevated",
        intensity: "medium",
        disabled: false,
        glow: true,
    },
    toned: {
        intent: "toned",
        variant: "outlined",
        tone: "emerald",
        intensity: "medium",
        disabled: false,
        glow: false,
    },
    "warning-demo": {
        // tone provided but intent not toned -> warning
        intent: "informed",
        variant: "flat",
        tone: "rose",
        intensity: "soft",
        disabled: false,
        glow: false,
    },
};

export default function PlaygroundClient({ copy }: { copy: PlaygroundCopy }) {
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");
    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [showBothModes, setShowBothModes] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    const dsInput = useMemo(() => {
        return {
            intent,
            variant,
            tone: toneEnabled ? tone : undefined,
            glow: aestheticEnabled
                ? typeof glow === "string"
                    ? glow
                    : "aurora"
                : glow === true
                  ? true
                  : undefined,
            intensity,
            disabled,
        } as const;
    }, [intent, variant, toneEnabled, tone, aestheticEnabled, glow, intensity, disabled]);

    const resolved = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const glowOptions = aestheticEnabled
        ? (["aurora", "ember", "cosmic", "mythic", "royal", "mono"] as const)
        : (["false", "true"] as const);

    const componentLinks: ComponentLink[] = [
        {
            title: "IntentSurface",
            description: "Semantic surface container with ring, bg, and optional glow layers.",
            href: "/playground/components/intent-surface",
            badge: "Surface",
        },
        {
            title: "IntentCommandPalette",
            description:
                "Command palette (⌘K/Ctrl+K): overlay + panel + search + list, keyboard nav, glow-ready.",
            href: "/playground/components/intent-command-palette",
            badge: "Surface",
        },
        {
            title: "IntentToast",
            description:
                "Intent-first toast notification: auto-dismiss, optional action, dismissible, placements.",
            href: "/playground/components/intent-toast",
            badge: "Feedback",
        },
        {
            title: "IntentCodeViewer",
            description:
                "Intent-first code/data viewer: highlight tokens reflect intent, optional header/meta, copy, wrap, line numbers.",
            href: "/playground/components/intent-code-viewer",
            badge: "Data",
        },
        {
            title: "IntentJourney",
            description:
                "Intent-first journey (stepper/timeline): vertical or horizontal, statuses, clickable steps, keyboard nav.",
            href: "/playground/components/intent-journey",
            badge: "Layout",
        },
        {
            title: "IntentControlButton",
            description: "Primary control button: intent-driven visuals, glow-ready, stable hooks.",
            href: "/playground/components/intent-control-button",
            badge: "Control",
        },
        {
            title: "IntentControlSelect",
            description:
                "Intent-first custom select: combobox + listbox, keyboard nav, glow-ready.",
            href: "/playground/components/intent-control-select",
            badge: "Control",
        },
        {
            title: "IntentControlField",
            description:
                "Intent-first field wrapper: label/description/error, optional leading/trailing slots, layout variants.",
            href: "/playground/components/intent-control-field",
            badge: "Control",
        },
        {
            title: "IntentControlToggle",
            description:
                "Intent-first toggle switch: track + thumb, optional label/description, glow-ready.",
            href: "/playground/components/intent-control-toggle",
            badge: "Control",
        },
        {
            title: "IntentControlTabs",
            description:
                "Intent-first tabs (segmented control): keyboard nav, optional equal/fullWidth, glow-ready.",
            href: "/playground/components/intent-control-tabs",
            badge: "Control",
        },
        {
            title: "IntentControlLink",
            description: "Navigation/link control with the same intent mechanics as buttons.",
            href: "/playground/components/intent-control-link",
            badge: "Control",
        },
        {
            title: "IntentIndicator",
            description: "Small semantic indicator for statuses, steps, or system states.",
            href: "/playground/components/intent-indicator",
            badge: "Indicator",
        },
        {
            title: "IntentDivider",
            description:
                "Intent-first layout divider: horizontal or vertical line with optional label.",
            href: "/playground/components/intent-divider",
            badge: "Layout",
        },
    ];

    const applyPreset = (key: PresetKey) => {
        const p = PRESETS[key];
        setIntent(p.intent);
        setVariant(p.variant);
        setIntensity(p.intensity);
        setDisabled(p.disabled);

        if (p.intent === "toned" && p.tone) setTone(p.tone);
        if (p.glow !== undefined) setGlow(p.glow);
        else setGlow(false);
    };

    async function copyResolvedJson() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(resolved, null, 2));
        } catch {
            // ignore
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="text-xs tracking-[0.18em] opacity-55">PLAYGROUND</div>
                        <div className="mt-2 text-sm opacity-80">
                            Explore intents, variants, tones, glow, intensity and see the resolver
                            output.
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] opacity-45 mr-1">Presets</span>
                        {(
                            [
                                ["default", "Default"],
                                ["glow", "Glow"],
                                ["toned", "Toned"],
                                ["warning-demo", "Warnings"],
                            ] as const
                        ).map(([k, label]) => (
                            <button
                                key={k}
                                onClick={() => applyPreset(k)}
                                className={cn(
                                    "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-xs opacity-85",
                                    "hover:bg-black/30 hover:ring-white/15",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                        {/* <div className="w-px h-6 bg-white/10 mx-1" />
                        <button
                            onClick={() => setShowBothModes((v) => !v)}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-xs opacity-85",
                                "hover:bg-black/30 hover:ring-white/15",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        >
                            {showBothModes ? "Show one mode" : "Show both modes"}
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                {/* Controls */}
                <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4 space-y-4">
                    <div className="text-xs tracking-[0.18em] opacity-55">
                        {copy.controlsTitle.toUpperCase()}
                    </div>

                    <IntentControlField
                        intent="informed"
                        variant="ghost"
                        padded={false}
                        label={copy.intent}
                        hint={undefined}
                    >
                        <IntentControlSelect
                            intent="toned"
                            variant="outlined"
                            tone="neutral"
                            fullWidth
                            value={intent}
                            onValueChange={(v) => setIntent(v as IntentName)}
                            options={[
                                { value: "informed", label: "informed" },
                                { value: "empowered", label: "empowered" },
                                { value: "warned", label: "warned" },
                                { value: "threatened", label: "threatened" },
                                { value: "themed", label: "themed" },
                                { value: "toned", label: "toned" },
                                { value: "glowed", label: "glowed" },
                            ]}
                        />
                    </IntentControlField>

                    <IntentControlField
                        intent="informed"
                        variant="ghost"
                        padded={false}
                        label={copy.variant}
                    >
                        <IntentControlSelect
                            intent="toned"
                            variant="outlined"
                            tone="neutral"
                            fullWidth
                            value={variant}
                            onValueChange={(v) => setVariant(v as VariantName)}
                            options={[
                                { value: "flat", label: "flat" },
                                { value: "outlined", label: "outlined" },
                                { value: "elevated", label: "elevated" },
                                { value: "ghost", label: "ghost" },
                            ]}
                        />
                    </IntentControlField>

                    {toneEnabled ? (
                        <IntentControlField
                            intent="informed"
                            variant="ghost"
                            padded={false}
                            label={copy.tone}
                            hint={copy.hintToneOnly}
                        >
                            <IntentControlSelect
                                intent="toned"
                                variant="outlined"
                                tone="neutral"
                                fullWidth
                                value={tone}
                                onValueChange={(v) => setTone(v as ToneName)}
                                options={[
                                    "slate",
                                    "gray",
                                    "zinc",
                                    "neutral",
                                    "stone",
                                    "red",
                                    "orange",
                                    "amber",
                                    "yellow",
                                    "lime",
                                    "green",
                                    "emerald",
                                    "teal",
                                    "cyan",
                                    "sky",
                                    "blue",
                                    "indigo",
                                    "violet",
                                    "purple",
                                    "fuchsia",
                                    "pink",
                                    "rose",
                                    "theme",
                                    "black",
                                ].map((t) => ({ value: t, label: t }))}
                            />
                        </IntentControlField>
                    ) : null}

                    <IntentControlField
                        intent="informed"
                        variant="ghost"
                        padded={false}
                        label={copy.glow}
                        // hint={aestheticEnabled ? copy.hintGlowGlowed : copy.hintGlowNormal}
                    >
                        <IntentControlSelect
                            intent="toned"
                            variant="outlined"
                            tone="neutral"
                            fullWidth
                            value={
                                aestheticEnabled
                                    ? typeof glow === "string"
                                        ? glow
                                        : "aurora"
                                    : glow === true
                                      ? "true"
                                      : "false"
                            }
                            onValueChange={(v) => {
                                if (aestheticEnabled) return setGlow(v as GlowName);
                                return setGlow(v === "true");
                            }}
                            options={[...glowOptions].map((g) => ({ value: g, label: g }))}
                        />
                    </IntentControlField>

                    <IntentControlField
                        intent="informed"
                        variant="ghost"
                        padded={false}
                        label={copy.intensity}
                    >
                        <IntentControlSelect
                            intent="toned"
                            variant="outlined"
                            tone="neutral"
                            fullWidth
                            value={intensity}
                            onValueChange={(v) => setIntensity(v as Intensity)}
                            options={[
                                { value: "soft", label: "soft" },
                                { value: "medium", label: "medium" },
                                { value: "strong", label: "strong" },
                            ]}
                        />
                    </IntentControlField>

                    {/* <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-3">
                        <div className="text-xs tracking-[0.18em] opacity-55">{copy.state}</div>
                        <label className="mt-2 flex items-center gap-3 text-sm opacity-85">
                            <input
                                type="checkbox"
                                checked={disabled}
                                onChange={(e) => setDisabled(e.target.checked)}
                            />
                            {copy.disabled}
                        </label>
                    </div> */}
                </div>

                {/* Preview + debug */}
                <div className="space-y-4 min-w-0">
                    {/* Previews */}
                    <div
                        className={cn(
                            "grid gap-4",
                            showBothModes ? "lg:grid-cols-2" : "lg:grid-cols-1"
                        )}
                    >
                        {/* Dark */}
                        <div className="rounded-2xl ring-1 ring-white/10 bg-black/30 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-xs tracking-[0.18em] opacity-60">
                                    {copy.previewDark}
                                </div>
                                <div className="text-[11px] opacity-40">mode="dark"</div>
                            </div>

                            <IntentSurface
                                {...dsInput}
                                mode="dark"
                                className="w-full min-w-0 box-border p-6 rounded-2xl"
                            >
                                <div className="text-sm font-semibold">{copy.surfaceTitle}</div>
                                <div className="text-xs opacity-70">{copy.surfaceBody}</div>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <IntentControlButton {...dsInput} mode="dark">
                                        {copy.buttonLabel}
                                    </IntentControlButton>
                                    <span className="text-[11px] opacity-55 font-mono">
                                        intent={intent} · variant={variant} · intensity={intensity}
                                    </span>
                                </div>
                            </IntentSurface>
                        </div>

                        {/* Light */}
                        {showBothModes ? (
                            <div className="rounded-2xl ring-1 ring-black/10 bg-white p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="text-xs tracking-[0.18em] opacity-60">
                                        {copy.previewLight}
                                    </div>
                                    <div className="text-[11px] opacity-40">mode="light"</div>
                                </div>

                                <IntentSurface
                                    {...dsInput}
                                    mode="light"
                                    className="w-full min-w-0 box-border p-6 rounded-2xl"
                                >
                                    <div className="text-sm font-semibold">{copy.surfaceTitle}</div>
                                    <div className="text-xs opacity-70">{copy.surfaceBody}</div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <IntentControlButton {...dsInput} mode="light">
                                            {copy.buttonLabel}
                                        </IntentControlButton>
                                        <span className="text-[11px] opacity-55 font-mono">
                                            intent={intent} · variant={variant} · intensity=
                                            {intensity}
                                        </span>
                                    </div>
                                </IntentSurface>
                            </div>
                        ) : null}
                    </div>

                    {/* Warnings */}
                    <WarningsCard title={copy.warningsTitle} items={resolved.warnings} />

                    {/* Resolved */}
                    <div className="rounded-2xl bg-black/45 ring-1 ring-white/10 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 bg-black/30 flex items-center justify-between gap-3">
                            <div className="text-xs tracking-[0.18em] opacity-55">
                                {copy.resolvedTitle.toUpperCase()}
                            </div>
                            <button
                                onClick={copyResolvedJson}
                                className={cn(
                                    "rounded-xl bg-black/20 ring-1 ring-white/10 px-3 py-2 text-xs opacity-85",
                                    "hover:bg-black/30 hover:ring-white/15",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            >
                                Copy JSON
                            </button>
                        </div>

                        <div className="overflow-auto text-xs opacity-80">
                            <SyntaxHighlighter
                                language="json"
                                style={oneDark} // ✅ si tu utilises déjà un style sur les autres pages
                                customStyle={{
                                    margin: 0,
                                    background: "transparent",
                                    padding: "16px",
                                    fontSize: "12px",
                                    lineHeight: "1.5",
                                    minWidth: "max-content",
                                }}
                                codeTagProps={{ style: { whiteSpace: "pre" } }}
                                wrapLongLines={false}
                                showLineNumbers={false}
                            >
                                {JSON.stringify(resolved, null, 2)}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </div>

            {/* Components */}
            <ComponentsSection items={COMPONENT_LINKS} />
        </div>
    );
}
