"use client";

// src/app/playground/components/intent-picker-glow/PlaygroundIntentPickerGlowClient.tsx
// PlaygroundIntentPickerGlowClient
// - Uses PlaygroundComponentShell to test IntentPickerGlow
// - DS exports: Identity + PropsTable
// - GoT-flavored labels + hints

import React, { useMemo, useState } from "react";

import {
    IntentPickerGlow,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentPickerGlowIdentity,
    IntentPickerGlowPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type PickerMode = "toggle" | "select";

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

export default function PlaygroundIntentPickerGlowClient() {
    // ✅ preview mode (controls tile bg + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS controls
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [dsDisabled, setDsDisabled] = useState(false);

    // Local controls
    const [pickerMode, setPickerMode] = useState<PickerMode>("toggle");

    // - toggle value (on/off)
    const [valueToggle, setValueToggle] = useState<boolean>(false);

    // - select value (aesthetic glow)
    const [valueSelect, setValueSelect] = useState<GlowName>("aurora");

    const [disabled, setDisabled] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const [compact, setCompact] = useState(false);
    const [padded, setPadded] = useState(true);

    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    // Picker UI (if supported by your component, otherwise ignore/remove)
    const [size, setSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
    const [fullWidth, setFullWidth] = useState(true);
    const [clearable, setClearable] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    // Keep DS glow state consistent when intent changes
    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    // If pickerMode is "select", ensure it stays meaningful
    React.useEffect(() => {
        if (pickerMode === "select") {
            setValueToggle(false);
            if (!valueSelect) setValueSelect("aurora");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickerMode]);

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

            <SelectRow label="Glow (DS)">
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
            <SelectRow label="Picker mode">
                <Select
                    value={pickerMode}
                    onChange={(v) => setPickerMode(v as PickerMode)}
                    options={["toggle", "select"]}
                />
            </SelectRow>

            {pickerMode === "toggle" ? (
                <SelectRow label="Value (toggle)">
                    <div className="space-y-2">
                        <CheckboxRow
                            label="glowEnabled"
                            checked={valueToggle}
                            onChange={setValueToggle}
                        />
                    </div>
                </SelectRow>
            ) : (
                <SelectRow label="Value (select)">
                    <Select
                        value={valueSelect}
                        onChange={(v) => setValueSelect(v as GlowName)}
                        options={["aurora", "ember", "cosmic", "mythic", "royal", "mono"]}
                    />
                </SelectRow>
            )}

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

            <SelectRow label="Select UI (optional)">
                <div className="space-y-2">
                    <SelectRow label="size">
                        <Select
                            value={size}
                            onChange={(v) => setSize(v as any)}
                            options={["xs", "sm", "md", "lg", "xl"]}
                        />
                    </SelectRow>

                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="clearable" checked={clearable} onChange={setClearable} />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: passe en <span className="font-mono">intent="glowed"</span> pour tester les
                glows aesthetic façon “Citadelle” ✨
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

        const leadingLine = withLeading ? `    leading={<span aria-hidden>🐉</span>}\n` : "";
        const trailingLine = withTrailing ? `    trailing={<span aria-hidden>🗡️</span>}\n` : "";

        const hintLine = invalid
            ? `    error="The maesters reject this glow."\n`
            : `    hint="Choose your omen: subtle aura or full dragonfire."\n`;

        const pickerModeLine = `    mode="${pickerMode}"\n`;

        const valueLine =
            pickerMode === "toggle"
                ? `      value={${valueToggle}}\n      onChange={setValue}\n`
                : `      value={"${valueSelect}"}\n      onChange={setValue}\n`;

        // keep TS valid in snippet (we fake `setValue` below)
        const stateInit =
            pickerMode === "toggle"
                ? `  const [value, setValue] = React.useState<boolean>(${valueToggle});`
                : `  const [value, setValue] = React.useState<GlowName>("${valueSelect}");`;

        const selectUiLines =
            pickerMode === "select"
                ? `      size="${size}"\n      fullWidth={${fullWidth}}\n      clearable={${clearable}}\n`
                : "";

        return `import * as React from "react";
import { IntentPickerGlow, type GlowName } from "intent-design-system";

export function Example() {
${stateInit}

  return (
    <IntentPickerGlow
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      invalid={${invalid}}
      compact={${compact}}
      padded={${padded}}
${leadingLine}${trailingLine}${pickerModeLine}${selectUiLines}${hintLine}      value={value}
      onChange={setValue}
      label="Maester Glow"
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
        withLeading,
        withTrailing,
        pickerMode,
        valueToggle,
        valueSelect,
        size,
        fullWidth,
        clearable,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    const liveValue = pickerMode === "toggle" ? valueToggle : valueSelect;

    return (
        <PlaygroundComponentShell
            identity={IntentPickerGlowIdentity}
            propsTable={IntentPickerGlowPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <IntentPickerGlow
                        {...dsInput}
                        mode={mode}
                        // local props
                        pickerMode={pickerMode as any} // rename to `mode` if your component uses `mode` already
                        value={liveValue as any}
                        onChange={(next: any) => {
                            if (pickerMode === "toggle") setValueToggle(Boolean(next));
                            else setValueSelect(next as GlowName);
                        }}
                        disabled={disabled}
                        invalid={invalid}
                        compact={compact}
                        padded={padded}
                        label="Maester Glow"
                        hint={
                            invalid ? undefined : (
                                <span className="opacity-85">
                                    Choose your omen: subtle aura or full dragonfire.
                                </span>
                            )
                        }
                        error={invalid ? "The maesters reject this glow." : undefined}
                        leading={withLeading ? <span aria-hidden>🐉</span> : undefined}
                        trailing={withTrailing ? <span aria-hidden>🗡️</span> : undefined}
                        // select UI (optional)
                        size={size as any}
                        fullWidth={fullWidth as any}
                        clearable={clearable as any}
                    />

                    {/* Tiny readout */}
                    <div className="mt-3 text-xs opacity-60">
                        value:{" "}
                        <span className="font-mono opacity-85">
                            {typeof liveValue === "boolean" ? String(liveValue) : liveValue}
                        </span>
                    </div>
                </div>
            )}
        />
    );
}
