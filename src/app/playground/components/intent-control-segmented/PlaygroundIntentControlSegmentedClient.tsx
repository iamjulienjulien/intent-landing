"use client";

// src/app/playground/components/intent-control-segmented/PlaygroundIntentControlSegmentedClient.tsx
// PlaygroundIntentControlSegmentedClient
// - Uses PlaygroundComponentShell to test IntentControlSegmented
// - Uses DS exports: Identity + PropsTable
// - Demonstrates single + multi mode, allowEmpty, per-segment variants, disabled options

import React, { useMemo, useState } from "react";

import {
    IntentControlSegmented,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlSegmentedIdentity,
    IntentControlSegmentedPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type SegSize = "xs" | "sm" | "md" | "lg" | "xl";
type SegVariant = "ghost" | "outlined" | "flat" | "elevated";

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

function arrayToggle(arr: string[], value: string) {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlSegmentedClient() {
    // Preview mode (controls preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS controls
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated"); // not used by component, but used for warnings exploration

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [dsDisabled, setDsDisabled] = useState(false);

    // Local controls
    const [multiple, setMultiple] = useState(false);
    const [allowEmpty, setAllowEmpty] = useState(true);

    const [size, setSize] = useState<SegSize>("md");
    const [fullWidth, setFullWidth] = useState(false);

    const [inactiveVariant, setInactiveVariant] = useState<SegVariant>("ghost");
    const [activeVariant, setActiveVariant] = useState<SegVariant>("elevated");

    const [disabled, setDisabled] = useState(false);

    const [disableOneOption, setDisableOneOption] = useState(true);

    // Values (we keep both, and feed the right one depending on mode)
    const [valueSingle, setValueSingle] = useState<string | null>("dragons");
    const [valueMulti, setValueMulti] = useState<string[]>(["wolves"]);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    // When switching modes, keep selections sane
    React.useEffect(() => {
        if (multiple) {
            // seed multi from single (if any)
            if (valueSingle && !valueMulti.includes(valueSingle)) {
                setValueMulti((prev) => [...prev, valueSingle]);
            }
        } else {
            // seed single from first multi if single is null
            if (valueSingle === null && valueMulti.length > 0) {
                setValueSingle(valueMulti[0] ?? null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multiple]);

    const dsInput = useMemo(() => {
        return {
            intent,
            variant, // included for warnings / resolved panel
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

    const options = useMemo(() => {
        return [
            { value: "dragons", label: "Dragons 🐉" },
            { value: "wolves", label: "Wolves 🐺" },
            { value: "lions", label: "Lions 🦁", disabled: disableOneOption },
            { value: "kraken", label: "Kraken 🐙" },
        ] as const;
    }, [disableOneOption]);

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

            {/* Even if Segmented does not use parent variant, we keep it to see warnings/resolved behavior */}
            <SelectRow label="Variant (DS)">
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
            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="multiple" checked={multiple} onChange={setMultiple} />
                    <CheckboxRow
                        label="allowEmpty (single)"
                        checked={allowEmpty}
                        onChange={setAllowEmpty}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as SegSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="Variants (segments)">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <div className="text-[11px] tracking-[0.18em] opacity-55">
                                inactiveVariant
                            </div>
                            <Select
                                value={inactiveVariant}
                                onChange={(v) => setInactiveVariant(v as SegVariant)}
                                options={["ghost", "outlined", "flat", "elevated"]}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="text-[11px] tracking-[0.18em] opacity-55">
                                activeVariant
                            </div>
                            <Select
                                value={activeVariant}
                                onChange={(v) => setActiveVariant(v as SegVariant)}
                                options={["ghost", "outlined", "flat", "elevated"]}
                            />
                        </div>
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Options">
                <div className="space-y-2">
                    <CheckboxRow
                        label="disableOneOption (Lions)"
                        checked={disableOneOption}
                        onChange={setDisableOneOption}
                    />
                </div>
            </SelectRow>

            <SelectRow label="State (local)">
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: en <span className="font-mono">multiple=true</span>, chaque segment devient
                un toggle (aria-pressed). En single, <span className="font-mono">allowEmpty</span>{" "}
                autorise un “unselect”.
            </div>
        </>
    );

    /* ============================================================================
       🧾 Code snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const optionsStr = `const options = [
  { value: "dragons", label: "Dragons 🐉" },
  { value: "wolves", label: "Wolves 🐺" },
  { value: "lions", label: "Lions 🦁", disabled: ${disableOneOption} },
  { value: "kraken", label: "Kraken 🐙" },
];`;

        const valueInit = multiple
            ? `const [value, setValue] = React.useState<string[]>(["wolves"]);`
            : `const [value, setValue] = React.useState<string | null>("dragons");`;

        const valueProp = multiple ? `value={value}` : `value={value}`;
        const onChange = `onValueChange={(next) => setValue(next as any)}`;

        return `import React from "react";
import { IntentControlSegmented } from "intent-design-system";

${optionsStr}

export function Example() {
  ${valueInit}

  return (
    <IntentControlSegmented
      mode="${previewMode}"
      intent="${intent}"
      intensity="${intensity}"
${toneLine}${glowLine}      disabled={${disabled}}
      multiple={${multiple}}
      allowEmpty={${allowEmpty}}
      size="${size}"
      fullWidth={${fullWidth}}
      inactiveVariant="${inactiveVariant}"
      activeVariant="${activeVariant}"
      options={options}
      ${valueProp}
      ${onChange}
      ariaLabel="House sigils"
    />
  );
}`;
    }, [
        previewMode,
        intent,
        tone,
        glow,
        intensity,
        disabled,
        multiple,
        allowEmpty,
        size,
        fullWidth,
        inactiveVariant,
        activeVariant,
        disableOneOption,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    return (
        <PlaygroundComponentShell
            identity={IntentControlSegmentedIdentity}
            propsTable={IntentControlSegmentedPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => {
                const value = multiple ? valueMulti : valueSingle;

                return (
                    <div className="w-full min-w-0">
                        <div className="w-full min-w-0">
                            <IntentControlSegmented
                                {...dsInput}
                                mode={mode}
                                options={[...options]}
                                multiple={multiple}
                                allowEmpty={allowEmpty}
                                size={size}
                                fullWidth={fullWidth}
                                inactiveVariant={inactiveVariant}
                                activeVariant={activeVariant}
                                disabled={disabled}
                                value={value as any}
                                onValueChange={(next) => {
                                    if (multiple) {
                                        const arr = Array.isArray(next) ? next : [];
                                        setValueMulti(arr);
                                    } else {
                                        setValueSingle(typeof next === "string" ? next : null);
                                    }
                                }}
                                ariaLabel="House sigils"
                            />
                        </div>

                        {/* Tiny readout */}
                        <div className="mt-3 text-xs opacity-60">
                            value:{" "}
                            <span className="font-mono opacity-85">
                                {multiple ? JSON.stringify(valueMulti) : String(valueSingle)}
                            </span>
                        </div>

                        {/* Quick helper row to poke multi values */}
                        {multiple ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {["dragons", "wolves", "lions", "kraken"].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        className={cn(
                                            "rounded-xl px-3 py-2 text-xs ring-1 transition",
                                            "bg-white/5 ring-white/10 hover:bg-white/10"
                                        )}
                                        onClick={() =>
                                            setValueMulti((prev) => arrayToggle(prev, k))
                                        }
                                    >
                                        toggle "{k}"
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className={cn(
                                        "rounded-xl px-3 py-2 text-xs ring-1 transition",
                                        "bg-white/5 ring-white/10 hover:bg-white/10"
                                    )}
                                    onClick={() => setValueMulti([])}
                                >
                                    clear
                                </button>
                            </div>
                        ) : null}
                    </div>
                );
            }}
        />
    );
}
