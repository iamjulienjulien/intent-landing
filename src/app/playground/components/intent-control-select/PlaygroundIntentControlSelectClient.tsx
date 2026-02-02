"use client";

// src/app/playground/components/intent-control-select/PlaygroundIntentControlSelectClient.tsx
// PlaygroundIntentControlSelectClient
// - Uses PlaygroundComponentShell to test IntentControlSelect
// - Uses DS exports: Identity + PropsTable
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlSelect,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlSelectIdentity,
    IntentControlSelectPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";
type PreviewMode = "dark" | "light";

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

type DemoOption = { value: string; label: string; disabled?: boolean };

const DEMO_OPTIONS: DemoOption[] = [
    { value: "loire", label: "Loire" },
    { value: "mayenne", label: "Mayenne" },
    { value: "maine", label: "Maine" },
    { value: "authion", label: "Authion" },
    { value: "layon", label: "Layon", disabled: true },
];

export default function PlaygroundIntentControlSelectClient() {
    // ✅ preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (select)
    const [size, setSize] = useState<SelectSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [placeholder, setPlaceholder] = useState("Choisir une rivière…");
    const [value, setValue] = useState<string | null>(null);

    const [clearable, setClearable] = useState(true);
    const [withDisabledOption, setWithDisabledOption] = useState(true);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    const options = useMemo(() => {
        return withDisabledOption
            ? DEMO_OPTIONS
            : DEMO_OPTIONS.map((o) => ({ ...o, disabled: false }));
    }, [withDisabledOption]);

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
                <SelectRow label="Tone">
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

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                </div>
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as SelectSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="Data">
                <div className="space-y-2">
                    <CheckboxRow
                        label="with disabled option"
                        checked={withDisabledOption}
                        onChange={setWithDisabledOption}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Ajoute une option disabled (ex: Layon) pour tester l’état.
                </div>
            </SelectRow>

            <SelectRow label="Value">
                <Select
                    value={value ?? ""}
                    onChange={(v) => setValue(v ? v : null)}
                    options={["", ...options.map((o) => o.value)]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Ce select “Value” sert juste à changer rapidement la valeur depuis le
                    playground.
                </div>
            </SelectRow>

            <SelectRow label="Placeholder">
                <input
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    className={cn(
                        "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                        "px-3 py-2 text-sm opacity-85",
                        "focus:outline-none focus:ring-2 focus:ring-white/15"
                    )}
                />
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="clearable" checked={clearable} onChange={setClearable} />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: teste le clavier (↑ ↓ Enter Escape) et le focus pour valider
                combobox/listbox.
            </div>
        </>
    );

    /* ============================================================================
       🧾 Code drawer string
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const valueLine = value ? `      value="${value}"\n` : `      value={null}\n`;

        return `import * as React from "react";
import { IntentControlSelect } from "intent-design-system";

const options = [
  { value: "loire", label: "Loire" },
  { value: "mayenne", label: "Mayenne" },
  { value: "maine", label: "Maine" },
  { value: "authion", label: "Authion" },
  { value: "layon", label: "Layon", disabled: true },
];

export function Example() {
  const [value, setValue] = React.useState<string | null>(${value ? `"${value}"` : "null"});

  return (
    <IntentControlSelect
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      clearable={${clearable}}
${valueLine}      onValueChange={setValue}
      options={options}
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
        size,
        fullWidth,
        placeholder,
        clearable,
        value,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    return (
        <PlaygroundComponentShell
            identity={IntentControlSelectIdentity}
            propsTable={IntentControlSelectPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className={cn("w-full min-w-0", fullWidth ? "" : "flex items-start")}>
                        <IntentControlSelect
                            {...dsInput}
                            mode={mode}
                            size={size}
                            fullWidth={fullWidth}
                            disabled={disabled}
                            placeholder={placeholder}
                            clearable={clearable}
                            value={value}
                            onValueChange={setValue}
                            options={options}
                        />
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, size=
                        <span className="font-mono"> {size}</span>, value=
                        <span className="font-mono"> {value ?? "null"}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Astuce: <span className="font-mono">clearable=true</span> permet de revenir
                        à <span className="font-mono">null</span>.
                    </div>
                </div>
            )}
        />
    );
}
