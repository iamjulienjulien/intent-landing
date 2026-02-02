"use client";

// src/app/playground/components/intent-picker-tone/PlaygroundIntentPickerToneClient.tsx
// PlaygroundIntentPickerToneClient
// - Uses PlaygroundComponentShell to test IntentPickerTone
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentPickerTone,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentPickerToneIdentity,
    IntentPickerTonePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type ToneValue = ToneName | "themed" | "ink";

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

export default function PlaygroundIntentPickerToneClient() {
    // ✅ preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS controls
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [dsDisabled, setDsDisabled] = useState(false);

    // Local controls
    const [value, setValue] = useState<ToneValue>("emerald");

    const [includeThemed, setIncludeThemed] = useState(false);
    const [includeInk, setIncludeInk] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const [compact, setCompact] = useState(false);
    const [padded, setPadded] = useState(true);

    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    // If user disables includeThemed/includeInk, ensure current value still exists
    React.useEffect(() => {
        if (!includeThemed && value === "themed") setValue("emerald");
        if (!includeInk && value === "ink") setValue("emerald");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [includeThemed, includeInk]);

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
            disabled: dsDisabled,
        } as const;
    }, [intent, variant, toneEnabled, tone, aestheticEnabled, glow, intensity, dsDisabled]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const glowOptions = aestheticEnabled
        ? (["aurora", "ember", "cosmic", "mythic", "royal", "mono"] as const)
        : (["false", "true"] as const);

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const controlsDs = (
        <>
            <SelectRow label="mode">
                <Select
                    value={previewMode}
                    onChange={(v) => setPreviewMode(v as PreviewMode)}
                    options={["dark", "light"]}
                />
            </SelectRow>

            <SelectRow label="Intent">
                <Select
                    value={intent}
                    onChange={(v) => setIntent(v as IntentName)}
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
                    onChange={(v) => setVariant(v as VariantName)}
                    options={["flat", "outlined", "elevated", "ghost"]}
                />
            </SelectRow>

            {toneEnabled ? (
                <SelectRow label="Tone (DS)">
                    <Select
                        value={tone}
                        onChange={(v) => setTone(v as ToneName)}
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
                        if (aestheticEnabled) return setGlow(v as GlowName);
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

            <SelectRow label="State (DS)">
                <div className="space-y-2">
                    <CheckboxRow label="dsDisabled" checked={dsDisabled} onChange={setDsDisabled} />
                </div>
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Value (Picker)">
                <Select
                    value={String(value)}
                    onChange={(v) => setValue(v as ToneValue)}
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
                        ...(includeThemed ? ["themed"] : []),
                        ...(includeInk ? ["ink"] : []),
                    ]}
                />
            </SelectRow>

            <SelectRow label="Options">
                <div className="space-y-2">
                    <CheckboxRow
                        label="includeThemed"
                        checked={includeThemed}
                        onChange={setIncludeThemed}
                    />
                    <CheckboxRow label="includeInk" checked={includeInk} onChange={setIncludeInk} />
                </div>
            </SelectRow>

            <SelectRow label="Field state">
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                </div>
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                    <CheckboxRow label="padded" checked={padded} onChange={setPadded} />
                </div>
            </SelectRow>

            <SelectRow label="Slots">
                <div className="space-y-2">
                    <CheckboxRow label="leading" checked={withLeading} onChange={setWithLeading} />
                    <CheckboxRow
                        label="trailing"
                        checked={withTrailing}
                        onChange={setWithTrailing}
                    />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: active <span className="font-mono">intent="toned"</span> puis change{" "}
                <span className="font-mono">tone</span> pour voir le picker “vivre” 😄
            </div>
        </>
    );

    /* ============================================================================
       🧾 Code snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const leadingLine = withLeading ? `    leading={<span aria-hidden>🎨</span>}\n` : "";
        const trailingLine = withTrailing ? `    trailing={<span aria-hidden>⌄</span>}\n` : "";

        const themedLine = includeThemed ? `    includeThemed\n` : "";
        const inkLine = includeInk ? `    includeInk\n` : "";

        const hintLine = invalid
            ? `    error="Invalid tone"\n`
            : `    hint="Pick a tone from the DS palette"\n`;

        return `import * as React from "react";
import { IntentPickerTone } from "intent-design-system";

export function Example() {
  const [value, setValue] = React.useState("${String(value)}");

  return (
    <IntentPickerTone
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      invalid={${invalid}}
      compact={${compact}}
      padded={${padded}}
${themedLine}${inkLine}${leadingLine}${trailingLine}${hintLine}      value={value}
      onChange={setValue}
      label="Tone"
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
        compact,
        padded,
        includeThemed,
        includeInk,
        withLeading,
        withTrailing,
        value,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    return (
        <PlaygroundComponentShell
            identity={IntentPickerToneIdentity}
            propsTable={IntentPickerTonePropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className="w-full min-w-0">
                        <IntentPickerTone
                            {...dsInput}
                            mode={mode}
                            value={value}
                            onChange={setValue}
                            includeThemed={includeThemed}
                            includeInk={includeInk}
                            disabled={disabled}
                            invalid={invalid}
                            compact={compact}
                            padded={padded}
                            label="Tone"
                            hint={
                                invalid ? undefined : (
                                    <span className="opacity-85">
                                        Pick a tone from the DS palette
                                    </span>
                                )
                            }
                            error={invalid ? "Invalid tone" : undefined}
                            leading={withLeading ? <span aria-hidden>🎨</span> : undefined}
                            trailing={withTrailing ? <span aria-hidden>⌄</span> : undefined}
                        />
                    </div>

                    {/* Tiny readout */}
                    <div className="mt-3 text-xs opacity-60">
                        value: <span className="font-mono opacity-85">{String(value)}</span>
                    </div>
                </div>
            )}
        />
    );
}
