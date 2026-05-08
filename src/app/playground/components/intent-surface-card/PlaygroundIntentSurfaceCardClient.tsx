"use client";

// src/app/playground/components/intent-surface-card/PlaygroundIntentSurfaceCardClient.tsx
// PlaygroundIntentSurfaceCardClient
// - Uses PlaygroundComponentShell to test IntentSurfaceCard
// - Uses DS exports: Identity + PropsTable
// - ✅ Updated for PlaygroundComponentShell split controls (dsControls / extraControls)
// - ✅ Adds previewMode toggle + codeString for the Code drawer

import React, { useMemo, useState } from "react";

import {
    IntentSurfaceCard,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentSurfaceCardIdentity,
    IntentSurfaceCardPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

function isAestheticGlow(glow: Glow): boolean {
    return (
        glow === "aurora" ||
        glow === "ember" ||
        glow === "cosmic" ||
        glow === "mythic" ||
        glow === "royal" ||
        glow === "mono"
    );
}

function SelectRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <div className="text-xs tracking-[0.18em] opacity-55">{label}</div>
            {children}
        </div>
    );
}

function Select({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                "px-3 py-2 text-sm opacity-85",
                "focus:outline-none focus:ring-2 focus:ring-white/15"
            )}
        >
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

function CheckboxRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-3 text-sm opacity-85">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentSurfaceCardClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Card extras
    const [padded, setPadded] = useState<"none" | "xs" | "sm" | "md">("sm");
    const [bleed, setBleed] = useState(false);
    const [divider, setDivider] = useState(true);
    const [fullWidth, setFullWidth] = useState(true);

    const [interactive, setInteractive] = useState(true);
    const [pressed, setPressed] = useState(false);

    const [withMedia, setWithMedia] = useState(true);
    const [withHeader, setWithHeader] = useState(true);
    const [headerMode, setHeaderMode] = useState<"auto" | "custom">("auto");
    const [withFooter, setWithFooter] = useState(false);

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
            mode: previewMode,
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
    }, [
        previewMode,
        intent,
        variant,
        toneEnabled,
        tone,
        aestheticEnabled,
        glow,
        intensity,
        disabled,
    ]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const glowOptions = aestheticEnabled
        ? (["aurora", "ember", "cosmic", "mythic", "royal", "mono"] as const)
        : (["false", "true"] as const);

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const dsControls = (
        <>
            <SelectRow label="Mode">
                <Select
                    value={previewMode}
                    onChange={(v) => setPreviewMode(v as PreviewMode)}
                    options={["dark", "light"]}
                />
            </SelectRow>

            <SelectRow label="Intent">
                <Select
                    value={intent}
                    onChange={(v) => setIntent(v as Intent)}
                    options={[
                        "informed",
                        "empowered",
                        "warned",
                        "threatened",
                        "themed",
                        "toned",
                        "glowed",
                    ]}
                />
            </SelectRow>

            <SelectRow label="Variant">
                <Select
                    value={variant}
                    onChange={(v) => setVariant(v as Variant)}
                    options={["flat", "outlined", "elevated", "ghost"]}
                />
            </SelectRow>

            {toneEnabled ? (
                <SelectRow label="Tone">
                    <Select
                        value={tone}
                        onChange={(v) => setTone(v as Tone)}
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
                        ]}
                    />
                    <div className="text-[11px] opacity-40">
                        tone est appliqué uniquement quand{" "}
                        <span className="font-mono">intent="toned"</span>
                    </div>
                </SelectRow>
            ) : null}

            <SelectRow label="Glow">
                <Select
                    value={
                        aestheticEnabled
                            ? typeof glow === "string"
                                ? glow
                                : "aurora"
                            : glow === true
                              ? "true"
                              : "false"
                    }
                    onChange={(v) => {
                        if (aestheticEnabled) return setGlow(v as Glow);
                        return setGlow(v === "true");
                    }}
                    options={[...glowOptions]}
                />
            </SelectRow>

            <SelectRow label="Intensity">
                <Select
                    value={intensity}
                    onChange={(v) => setIntensity(v as Intensity)}
                    options={["soft", "medium", "strong"]}
                />
            </SelectRow>

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                </div>
            </SelectRow>
        </>
    );

    const extraControls = (
        <>
            <SelectRow label="Card">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="bleed" checked={bleed} onChange={setBleed} />
                    <CheckboxRow label="divider" checked={divider} onChange={setDivider} />
                    <CheckboxRow
                        label="interactive"
                        checked={interactive}
                        onChange={setInteractive}
                    />
                    <CheckboxRow label="pressed" checked={pressed} onChange={setPressed} />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Padding</div>
                    <Select
                        value={padded}
                        onChange={(v) => setPadded(v as any)}
                        options={["none", "xs", "sm", "md"]}
                    />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Structure</div>
                    <div className="space-y-2">
                        <CheckboxRow
                            label="withMedia"
                            checked={withMedia}
                            onChange={setWithMedia}
                        />
                        <CheckboxRow
                            label="withHeader"
                            checked={withHeader}
                            onChange={setWithHeader}
                        />
                        <CheckboxRow
                            label="withFooter"
                            checked={withFooter}
                            onChange={setWithFooter}
                        />
                    </div>

                    {withHeader ? (
                        <div className="mt-3 space-y-2">
                            <div className="text-[11px] opacity-40">Header mode</div>
                            <Select
                                value={headerMode}
                                onChange={(v) => setHeaderMode(v as any)}
                                options={["auto", "custom"]}
                            />
                            <div className="text-[11px] opacity-40">
                                <span className="font-mono">auto</span> utilise
                                eyebrow/title/subtitle/meta/actions.
                                <br />
                                <span className="font-mono">custom</span> passe un node via{" "}
                                <span className="font-mono">header</span>.
                            </div>
                        </div>
                    ) : null}
                </div>
            </SelectRow>
        </>
    );

    /* ============================================================================
       ✅ Code panel snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const mediaBlock = !withMedia
            ? ""
            : `      media={
        <div className="h-28 w-full rounded-[inherit] bg-black/25 ring-1 ring-white/10" />
      }\n`;

        const headerBlock = !withHeader
            ? ""
            : headerMode === "custom"
              ? `      header={<div className="text-sm font-semibold">Custom header</div>}\n`
              : `      eyebrow="Item"\n      title="IntentSurfaceCard"\n      subtitle="Card = item container (rythme compact)"\n      meta={<span className="text-[11px] opacity-70">2 min</span>}\n      actions={<button className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85">⋯</button>}\n`;

        const footerBlock = withFooter
            ? `      footer={<div className="text-xs opacity-70">Footer: tags, stats, CTA…</div>}\n`
            : "";

        return `import React from "react";
import { IntentSurfaceCard } from "intent-design-system";

export function Example() {
  return (
    <IntentSurfaceCard
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      fullWidth={${fullWidth}}
      padded="${padded}"
      bleed={${bleed}}
      divider={${divider}}
      interactive={${interactive}}
      pressed={${pressed}}
${mediaBlock}${headerBlock}${footerBlock}    >
      <div className="space-y-2">
        <div className="text-sm font-semibold opacity-90">Contenu</div>
        <div className="text-xs opacity-70">
          Une card pour un item: POI, quest, media, person, record…
        </div>
      </div>
    </IntentSurfaceCard>
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        fullWidth,
        padded,
        bleed,
        divider,
        interactive,
        pressed,
        withMedia,
        withHeader,
        headerMode,
        withFooter,
    ]);

    /* ============================================================================
       🎛 Build header/media/footer nodes
    ============================================================================ */

    const mediaNode = withMedia ? (
        <div className="h-28 w-full rounded-[inherit] bg-black/25 ring-1 ring-white/10">
            <div className="h-full w-full p-4">
                <div className="text-xs tracking-[0.18em] opacity-55">MEDIA</div>
                <div className="mt-1 text-[11px] opacity-55">
                    image, video, cover, map snapshot…
                </div>
            </div>
        </div>
    ) : null;

    const headerProps = !withHeader
        ? {}
        : headerMode === "custom"
          ? {
                header: (
                    <div className="flex items-start justify-between gap-4 min-w-0">
                        <div className="min-w-0">
                            <div className="text-xs tracking-[0.18em] opacity-60">CUSTOM</div>
                            <div className="mt-1 text-sm font-semibold opacity-90">
                                IntentSurfaceCard
                            </div>
                            <div className="mt-1 text-xs opacity-70">
                                header prop remplace le header auto
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85">
                                Open
                            </button>
                        </div>
                    </div>
                ),
            }
          : {
                eyebrow: "Item",
                title: "IntentSurfaceCard",
                subtitle: "Card = item container (rythme compact)",
                meta: <span className="text-[11px] opacity-70">2 min</span>,
                actions: (
                    <button
                        className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
                        aria-label="More"
                    >
                        ⋯
                    </button>
                ),
            };

    const footerNode = withFooter ? (
        <div className="flex items-center justify-between gap-3 text-xs opacity-70">
            <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
                    Tag
                </span>
                <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
                    House Stark
                </span>
            </div>
            <button className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85">
                CTA
            </button>
        </div>
    ) : null;

    return (
        <PlaygroundComponentShell
            identity={IntentSurfaceCardIdentity}
            propsTable={IntentSurfaceCardPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <IntentSurfaceCard
                        {...dsInput}
                        mode={mode}
                        fullWidth={fullWidth}
                        padded={padded}
                        bleed={bleed}
                        divider={divider}
                        interactive={interactive}
                        pressed={pressed}
                        media={mediaNode}
                        {...(headerProps as any)}
                        footer={footerNode}
                        className={cn("w-full min-w-0 rounded-2xl")}
                    >
                        <div className="space-y-2">
                            <div className="text-sm font-semibold opacity-90">Contenu</div>

                            <div className="text-xs opacity-70">
                                mode=<span className="font-mono">{mode}</span>, variant=
                                <span className="font-mono"> {variant}</span>, intent=
                                <span className="font-mono"> {intent}</span>, padded=
                                <span className="font-mono"> {padded}</span>, interactive=
                                <span className="font-mono"> {String(interactive)}</span>, pressed=
                                <span className="font-mono"> {String(pressed)}</span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                                    <div className="text-xs font-semibold opacity-85">Bloc A</div>
                                    <div className="mt-1 text-[11px] opacity-60">
                                        Détail secondaire
                                    </div>
                                </div>

                                <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                                    <div className="text-xs font-semibold opacity-85">Bloc B</div>
                                    <div className="mt-1 text-[11px] opacity-60">
                                        Détail secondaire
                                    </div>
                                </div>
                            </div>

                            <div className="text-[11px] opacity-55">
                                Tip: une Card = un item. Un Panel = une section. Tu peux empiler des
                                Cards dans un Panel, comme des constellations dans une galaxie 🪐
                            </div>
                        </div>
                    </IntentSurfaceCard>
                </div>
            )}
        />
    );
}
