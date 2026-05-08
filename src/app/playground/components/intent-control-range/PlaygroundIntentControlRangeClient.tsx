// src/app/playground/components/intent-control-range/PlaygroundIntentControlRangeClient.tsx
// PlaygroundIntentControlRangeClient
// - Uses PlaygroundComponentShell to test IntentControlRange
// - Uses DS exports: Identity + PropsTable
// - Mock theme: Game of Thrones influence / allegiance slider
// - Covers standalone / naked, labels, value formatting, slots and states
// - Uses split controls: dsControls / extraControls
// - Adds previewMode toggle + codeString for the Code drawer

"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentControlRange,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentControlRangeIdentity,
    IntentControlRangePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type RangeSize = "xs" | "sm" | "md" | "lg" | "xl";
type RangeThemeKey = "stark" | "targaryen" | "lannister";

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
   🐺 GOT MOCKS
============================================================================ */

const HOUSE_OPTIONS = [
    {
        key: "stark",
        emoji: "🐺",
        title: "Maison Stark",
        eyebrow: "North",
        subtitle: "Winter is Coming",
        label: "Loyauté du Nord",
        caption: "Mesure l’adhésion des bannerets à Winterfell.",
        suffix: "%",
        leading: "❄️",
        trailing: "🧊",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 65,
    },
    {
        key: "targaryen",
        emoji: "🐉",
        title: "Maison Targaryen",
        eyebrow: "Dragonstone",
        subtitle: "Fire and Blood",
        label: "Pression de conquête",
        caption: "Niveau de feu politique et militaire sur Westeros.",
        suffix: "%",
        leading: "🔥",
        trailing: "👑",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 88,
    },
    {
        key: "lannister",
        emoji: "🦁",
        title: "Maison Lannister",
        eyebrow: "Casterly Rock",
        subtitle: "Hear Me Roar",
        label: "Influence à la cour",
        caption: "Quantifie le levier d’or, d’alliances et d’intrigues.",
        suffix: "%",
        leading: "💰",
        trailing: "🦁",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 81,
    },
] as const;

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlRangeClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [themeKey, setThemeKey] = useState<RangeThemeKey>("stark");

    const [size, setSize] = useState<RangeSize>("md");
    const [fullWidth, setFullWidth] = useState(true);
    const [naked, setNaked] = useState(false);

    const [invalid, setInvalid] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    const [withLabel, setWithLabel] = useState(true);
    const [withCaption, setWithCaption] = useState(true);
    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    const [showValue, setShowValue] = useState(true);
    const [customValueLabel, setCustomValueLabel] = useState(false);
    const [formattedValue, setFormattedValue] = useState(false);

    const [min, setMin] = useState("0");
    const [max, setMax] = useState("100");
    const [step, setStep] = useState("5");
    const [value, setValue] = useState(65);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
    }, [aestheticEnabled, glow]);

    const activeHouse = useMemo(() => {
        return HOUSE_OPTIONS.find((house) => house.key === themeKey) ?? HOUSE_OPTIONS[0];
    }, [themeKey]);

    useEffect(() => {
        setMin(String(activeHouse.min));
        setMax(String(activeHouse.max));
        setStep(String(activeHouse.step));
        setValue(activeHouse.defaultValue);
    }, [activeHouse]);

    const numericMin = Number(min);
    const numericMax = Number(max);
    const numericStep = Number(step);

    const safeMin = Number.isFinite(numericMin) ? numericMin : 0;
    const safeMax =
        Number.isFinite(numericMax) && numericMax > safeMin ? numericMax : safeMin + 100;
    const safeStep = Number.isFinite(numericStep) && numericStep > 0 ? numericStep : 1;
    const clampedValue = Math.max(safeMin, Math.min(value, safeMax));

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

    const resolvedValueLabel = customValueLabel
        ? `${activeHouse.emoji} ${clampedValue}${activeHouse.suffix}`
        : undefined;

    const formatValue = formattedValue
        ? (current: number) => `${current}${activeHouse.suffix}`
        : undefined;

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
                        if (aestheticEnabled) {
                            setGlow(v as Glow);
                            return;
                        }
                        setGlow(v === "true");
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
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>
        </>
    );

    const extraControls = (
        <>
            <SelectRow label="Theme">
                <Select
                    value={themeKey}
                    onChange={(v) => setThemeKey(v as RangeThemeKey)}
                    options={HOUSE_OPTIONS.map((house) => house.key)}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="naked" checked={naked} onChange={setNaked} />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Size</div>
                    <Select
                        value={size}
                        onChange={(v) => setSize(v as RangeSize)}
                        options={["xs", "sm", "md", "lg", "xl"]}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="withLabel" checked={withLabel} onChange={setWithLabel} />
                    <CheckboxRow
                        label="withCaption"
                        checked={withCaption}
                        onChange={setWithCaption}
                    />
                    <CheckboxRow
                        label="withLeading"
                        checked={withLeading}
                        onChange={setWithLeading}
                    />
                    <CheckboxRow
                        label="withTrailing"
                        checked={withTrailing}
                        onChange={setWithTrailing}
                    />
                    <CheckboxRow label="showValue" checked={showValue} onChange={setShowValue} />
                    <CheckboxRow
                        label="customValueLabel"
                        checked={customValueLabel}
                        onChange={setCustomValueLabel}
                    />
                    <CheckboxRow
                        label="formattedValue"
                        checked={formattedValue}
                        onChange={setFormattedValue}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Range">
                <div className="grid grid-cols-3 gap-2">
                    <label className="space-y-1">
                        <div className="text-[11px] opacity-40">Min</div>
                        <input
                            type="number"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            className="w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85"
                        />
                    </label>

                    <label className="space-y-1">
                        <div className="text-[11px] opacity-40">Max</div>
                        <input
                            type="number"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            className="w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85"
                        />
                    </label>

                    <label className="space-y-1">
                        <div className="text-[11px] opacity-40">Step</div>
                        <input
                            type="number"
                            min="1"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            className="w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85"
                        />
                    </label>
                </div>

                <div className="mt-3 space-y-1">
                    <div className="text-[11px] opacity-40">Value</div>
                    <input
                        type="range"
                        min={safeMin}
                        max={safeMax}
                        step={safeStep}
                        value={clampedValue}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-[11px] opacity-55">
                        Current value: <span className="font-mono">{clampedValue}</span>
                    </div>
                </div>
            </SelectRow>
        </>
    );

    /* ============================================================================
       ✅ Code panel snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const labelLine = withLabel ? `    label="${activeHouse.label}"\n` : "";
        const captionLine = withCaption ? `    caption="${activeHouse.caption}"\n` : "";
        const leadingLine = withLeading
            ? `    leading={<span>${activeHouse.leading}</span>}\n`
            : "";
        const trailingLine = withTrailing
            ? `    trailing={<span>${activeHouse.trailing}</span>}\n`
            : "";

        const valueLabelLine = customValueLabel
            ? `    valueLabel="${activeHouse.emoji} ${clampedValue}${activeHouse.suffix}"\n`
            : "";

        const formatValueLine = formattedValue
            ? `    formatValue={(value) => \`\${value}${activeHouse.suffix}\`}\n`
            : "";

        return `import React from "react";
import { IntentControlRange } from "intent-design-system";

export function Example() {
    const [value, setValue] = React.useState(${clampedValue});

    return (
        <IntentControlRange
            mode="${previewMode}"
            intent="${intent}"
            variant="${variant}"
${toneLine}${glowLine}            intensity="${intensity}"
            disabled={${disabled}}
            invalid={${invalid}}
            readOnly={${readOnly}}
            size="${size}"
            fullWidth={${fullWidth}}
            naked={${naked}}
${labelLine}${captionLine}${valueLabelLine}${formatValueLine}${leadingLine}${trailingLine}            min={${safeMin}}
            max={${safeMax}}
            step={${safeStep}}
            value={value}
            showValue={${showValue}}
            onChange={(e) => setValue(Number(e.target.value))}
        />
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
        invalid,
        readOnly,
        size,
        fullWidth,
        naked,
        withLabel,
        withCaption,
        withLeading,
        withTrailing,
        customValueLabel,
        formattedValue,
        showValue,
        activeHouse,
        clampedValue,
        safeMin,
        safeMax,
        safeStep,
    ]);

    /* ============================================================================
       🖼 Preview
    ============================================================================ */

    const previewBody = (
        <div className="w-full space-y-6">
            <div className="rounded-3xl p-5 ring-1 ring-white/10 bg-black/20 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-xs tracking-[0.18em] opacity-55">
                            {activeHouse.eyebrow}
                        </div>
                        <div className="mt-1 text-sm font-semibold opacity-90">
                            {activeHouse.emoji} {activeHouse.title}
                        </div>
                        <div className="mt-1 text-xs opacity-70">{activeHouse.subtitle}</div>
                    </div>

                    <div className="text-right">
                        <div className="text-[11px] opacity-55">Current</div>
                        <div className="mt-1 text-lg font-semibold opacity-90">
                            {clampedValue}
                            {activeHouse.suffix}
                        </div>
                    </div>
                </div>

                <IntentControlRange
                    {...dsInput}
                    mode={previewMode}
                    size={size}
                    fullWidth={fullWidth}
                    naked={naked}
                    invalid={invalid}
                    readOnly={readOnly}
                    min={safeMin}
                    max={safeMax}
                    step={safeStep}
                    value={clampedValue}
                    onChange={(e) => setValue(Number(e.target.value))}
                    label={withLabel ? activeHouse.label : undefined}
                    caption={withCaption ? activeHouse.caption : undefined}
                    leading={withLeading ? <span>{activeHouse.leading}</span> : undefined}
                    trailing={withTrailing ? <span>{activeHouse.trailing}</span> : undefined}
                    showValue={showValue}
                    valueLabel={resolvedValueLabel}
                    formatValue={formatValue}
                    className={cn("w-full")}
                />

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                        <div className="text-[11px] tracking-[0.18em] opacity-55">MIN</div>
                        <div className="mt-2 text-sm font-semibold opacity-90">{safeMin}</div>
                    </div>

                    <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                        <div className="text-[11px] tracking-[0.18em] opacity-55">STEP</div>
                        <div className="mt-2 text-sm font-semibold opacity-90">{safeStep}</div>
                    </div>

                    <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                        <div className="text-[11px] tracking-[0.18em] opacity-55">MAX</div>
                        <div className="mt-2 text-sm font-semibold opacity-90">{safeMax}</div>
                    </div>
                </div>

                <div className="text-[11px] opacity-55">
                    Tip: en mode <span className="font-mono">naked</span>, le composant devient une
                    lame nue, sans armure visuelle. Pratique pour l’insérer dans un field ou une
                    composition plus dense 🗡️
                </div>
            </div>
        </div>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentControlRangeIdentity}
            propsTable={IntentControlRangePropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={() => <div className="w-full min-w-0">{previewBody}</div>}
        />
    );
}
