"use client";

// src/app/playground/components/intent-theme-preview/PlaygroundIntentThemePreviewClient.tsx
// PlaygroundIntentThemePreviewClient
// - Uses PlaygroundComponentShell to test IntentThemePreview
// - Uses DS exports: Identity + PropsTable
// - ✅ adds scope="tones"

import React, { useMemo, useState } from "react";

import {
    IntentThemePreview,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Glow,
    type Intensity,
    type ToneStep,
    type Tone,

    // ✅ docs exports from DS
    IntentThemePreviewIdentity,
    IntentThemePreviewPropsTable,
    AESTHETIC_GLOW_VALUES,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type PreviewScope = "intents" | "glows" | "tones";
type PreviewDensity = "compact" | "comfortable";
type GlowMode = "false" | "true";
type GlowSet = "all" | "core" | "new";
type Columns = 2 | 3 | 4 | 5 | 6;

const ALL_AESTHETIC_GLOWS: Glow[] = [
    "aurora",
    "ember",
    "cosmic",
    "mythic",
    "royal",
    "mono",
    "boreal",
    "solstice",
    "nebula",
    "verdant",
    "nocturne",
] as any;

const CORE_AESTHETIC_GLOWS: Glow[] = [
    "aurora",
    "ember",
    "cosmic",
    "mythic",
    "royal",
    "mono",
] as any;

const NEW_AESTHETIC_GLOWS: Glow[] = ["boreal", "solstice", "nebula", "verdant", "nocturne"] as any;

const ALL_TONES: Tone[] = [
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
] as any;

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

function scopeLabel(scope: PreviewScope) {
    if (scope === "glows") return "Aesthetic glows";
    if (scope === "tones") return "Tones";
    return "Intents";
}

function pickGlows(set: GlowSet): Glow[] {
    // if (set === "core") return CORE_AESTHETIC_GLOWS;
    // if (set === "new") return NEW_AESTHETIC_GLOWS;
    return [...AESTHETIC_GLOW_VALUES];
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentThemePreviewClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [variant, setVariant] = useState<Variant>("elevated");
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [toneStep, setToneStep] = useState<ToneStep>(500);

    const [scope, setScope] = useState<PreviewScope>("intents");
    const [glowMode, setGlowMode] = useState<GlowMode>("false");
    const [glowSet, setGlowSet] = useState<GlowSet>("all");

    // ✅ optional: allow overriding which tones are shown (scope=tones)
    const [tonesMode, setTonesMode] = useState<"all" | "core">("all");

    const [columns, setColumns] = useState<Columns>(4);
    const [density, setDensity] = useState<PreviewDensity>("comfortable");
    const [showMeta, setShowMeta] = useState(true);

    const [withTitle, setWithTitle] = useState(true);
    const [withDescription, setWithDescription] = useState(true);

    const [disabled, setDisabled] = useState(false);

    // Debug intent only for resolvedJson/warnings (shell needs one)
    const [debugIntent, setDebugIntent] = useState<Intent>("informed");

    const glows = useMemo(() => pickGlows(glowSet), [glowSet]);

    const tones = useMemo(() => {
        if (tonesMode === "core") return ["slate", "gray", "zinc", "neutral", "stone"] as any;
        return ALL_TONES;
    }, [tonesMode]);

    const dsInput = useMemo(() => {
        return {
            mode: previewMode,
            variant,
            intensity,
            toneStep,
            disabled,
            glow: scope === "intents" ? (glowMode === "true" ? true : undefined) : undefined,
        } as const;
    }, [previewMode, variant, intensity, toneStep, disabled, scope, glowMode]);

    const resolvedWithWarnings = useMemo(() => {
        return resolveIntentWithWarnings({
            intent: debugIntent,
            ...dsInput,
        });
    }, [debugIntent, dsInput]);

    const titleString = useMemo(() => {
        if (!withTitle) return undefined;
        return `Theme preview (${scopeLabel(scope)})`;
    }, [withTitle, scope]);

    const descriptionString = useMemo(() => {
        if (!withDescription) return undefined;
        return "Sanity-check: mode / variant / intensity / toneStep, and glow/tone surfaces at a glance.";
    }, [withDescription]);

    const codeString = useMemo(() => {
        const titleLine = withTitle ? `      title="Theme preview (${scopeLabel(scope)})"\n` : "";
        const descLine = withDescription
            ? `      description="Sanity-check: mode / variant / intensity / toneStep, and glow/tone surfaces at a glance."\n`
            : "";

        const glowLine =
            scope === "intents"
                ? glowMode === "true"
                    ? `      glow\n`
                    : ""
                : scope === "glows"
                  ? `      // scope="glows" forces intent="glowed" per tile\n`
                  : `      // scope="tones" forces intent="toned" per tile\n`;

        const glowsLine =
            scope === "glows"
                ? `      glows={[${pickGlows(glowSet)
                      .map((g) => `"${String(g)}"`)
                      .join(", ")}]}\n`
                : "";

        const tonesLine =
            scope === "tones"
                ? `      tones={[${tones.map((t: any) => `"${String(t)}"`).join(", ")}]}\n`
                : "";

        return `import React from "react";
import { IntentThemePreview } from "intent-design-system";

export function Example() {
  return (
    <IntentThemePreview
      mode="${previewMode}"
      variant="${variant}"
      intensity="${intensity}"
      toneStep={${toneStep}}
${glowLine}      scope="${scope}"
      columns={${columns}}
      density="${density}"
      showMeta={${showMeta}}
${titleLine}${descLine}${glowsLine}${tonesLine}    />
  );
}`;
    }, [
        previewMode,
        variant,
        intensity,
        toneStep,
        scope,
        columns,
        density,
        showMeta,
        withTitle,
        withDescription,
        glowMode,
        glowSet,
        tones,
    ]);

    const dsControls = (
        <>
            <SelectRow label="mode">
                <Select
                    value={previewMode}
                    onChange={(v) => setPreviewMode(v as PreviewMode)}
                    options={["dark", "light"]}
                />
            </SelectRow>

            <SelectRow label="Variant">
                <Select
                    value={variant}
                    onChange={(v) => setVariant(v as Variant)}
                    options={["flat", "outlined", "elevated", "ghost"]}
                />
            </SelectRow>

            <SelectRow label="Intensity">
                <Select
                    value={intensity}
                    onChange={(v) => setIntensity(v as Intensity)}
                    options={["soft", "medium", "strong"]}
                />
            </SelectRow>

            <SelectRow label="ToneStep">
                <Select
                    value={String(toneStep)}
                    onChange={(v) => setToneStep(Number(v) as ToneStep)}
                    options={[
                        "50",
                        "100",
                        "200",
                        "300",
                        "400",
                        "500",
                        "600",
                        "700",
                        "800",
                        "900",
                        "950",
                    ]}
                />
                <div className="text-[11px] opacity-40">
                    Knob global. Référence canonique: <span className="font-mono">500</span>.
                </div>
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
            <SelectRow label="Scope">
                <Select
                    value={scope}
                    onChange={(v) => setScope(v as PreviewScope)}
                    options={["intents", "glows", "tones"]}
                />
            </SelectRow>

            {scope === "intents" ? (
                <SelectRow label="Implicit glow (scope=intents)">
                    <Select
                        value={glowMode}
                        onChange={(v) => setGlowMode(v as GlowMode)}
                        options={["false", "true"]}
                    />
                    <div className="text-[11px] opacity-40">
                        <span className="font-mono">glow=true</span> applique le glow implicite.
                    </div>
                </SelectRow>
            ) : scope === "glows" ? (
                <SelectRow label="Glows set (scope=glows)">
                    <Select
                        value={glowSet}
                        onChange={(v) => setGlowSet(v as GlowSet)}
                        options={["all", "core", "new"]}
                    />
                    <div className="text-[11px] opacity-40">
                        Tiles = <span className="font-mono">intent=&quot;glowed&quot;</span> + glow
                        aesthetic.
                    </div>
                </SelectRow>
            ) : (
                <SelectRow label="Tones set (scope=tones)">
                    <Select
                        value={tonesMode}
                        onChange={(v) => setTonesMode(v as "all" | "core")}
                        options={["all", "core"]}
                    />
                    <div className="text-[11px] opacity-40">
                        Tiles = <span className="font-mono">intent=&quot;toned&quot;</span> +{" "}
                        <span className="font-mono">tone</span> par tuile.
                    </div>
                </SelectRow>
            )}

            <SelectRow label="Grid">
                <div className="space-y-3">
                    <Select
                        value={String(columns)}
                        onChange={(v) => setColumns(Number(v) as Columns)}
                        options={["2", "3", "4", "5", "6"]}
                    />
                    <Select
                        value={density}
                        onChange={(v) => setDensity(v as PreviewDensity)}
                        options={["compact", "comfortable"]}
                    />
                    <CheckboxRow label="showMeta" checked={showMeta} onChange={setShowMeta} />
                </div>
            </SelectRow>

            <SelectRow label="Header">
                <div className="space-y-2">
                    <CheckboxRow label="title" checked={withTitle} onChange={setWithTitle} />
                    <CheckboxRow
                        label="description"
                        checked={withDescription}
                        onChange={setWithDescription}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Debug (resolvedJson)">
                <Select
                    value={debugIntent}
                    onChange={(v) => setDebugIntent(v as Intent)}
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
                <div className="text-[11px] opacity-40">
                    Alimente <span className="font-mono">resolvedJson</span> du shell.
                </div>
            </SelectRow>
        </>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentThemePreviewIdentity}
            propsTable={IntentThemePreviewPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <IntentThemePreview
                        {...dsInput}
                        mode={mode}
                        scope={scope}
                        columns={columns}
                        density={density}
                        showMeta={showMeta}
                        // 👇 IMPORTANT: title/description must be strings in your DS typings
                        title={titleString}
                        description={descriptionString}
                        glows={scope === "glows" ? glows : undefined}
                        tones={scope === "tones" ? tones : undefined}
                    />

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, scope=
                        <span className="font-mono"> {scope}</span>, variant=
                        <span className="font-mono"> {variant}</span>, cols=
                        <span className="font-mono"> {columns}</span>, density=
                        <span className="font-mono"> {density}</span>, toneStep=
                        <span className="font-mono"> {toneStep}</span>
                        {scope === "intents" && glowMode === "true" ? (
                            <>
                                , glow=<span className="font-mono">true</span>
                            </>
                        ) : null}
                        {scope === "glows" ? (
                            <>
                                , glows=<span className="font-mono">{glowSet}</span>
                            </>
                        ) : null}
                        {scope === "tones" ? (
                            <>
                                , tones=<span className="font-mono">{tonesMode}</span>
                            </>
                        ) : null}
                        {disabled ? (
                            <>
                                , disabled=<span className="font-mono">true</span>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        />
    );
}
