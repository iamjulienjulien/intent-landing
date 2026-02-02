"use client";

// src/app/playground/components/intent-control-field/PlaygroundIntentControlFieldClient.tsx
// PlaygroundIntentControlFieldClient
// - Uses PlaygroundComponentShell to test IntentControlField
// - Uses DS exports: Identity + PropsTable
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlField,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlFieldIdentity,
    IntentControlFieldPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type FieldDirection = "vertical" | "horizontal";

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

function TextInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                "px-3 py-2 text-sm opacity-85",
                "focus:outline-none focus:ring-2 focus:ring-white/15"
            )}
        />
    );
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlFieldClient() {
    // ✅ preview mode (controls tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (field)
    const [label, setLabel] = useState("Nom du personnage");
    const [description, setDescription] = useState(
        "Ce nom sera affiché dans les quêtes et journaux."
    );
    const [error, setError] = useState("");
    const [required, setRequired] = useState(false);

    const [direction, setDirection] = useState<FieldDirection>("vertical");
    const [compact, setCompact] = useState(false);

    const [leading, setLeading] = useState(false);
    const [trailing, setTrailing] = useState(false);

    // Demo input inside the Field
    const [inputValue, setInputValue] = useState("Raoul Duke");

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
            <SelectRow label="Label">
                <TextInput value={label} onChange={setLabel} placeholder="Label…" />
            </SelectRow>

            <SelectRow label="Description">
                <TextInput
                    value={description}
                    onChange={setDescription}
                    placeholder="Description…"
                />
                <div className="mt-2 text-[11px] opacity-40">Vide = pas de description.</div>
            </SelectRow>

            <SelectRow label="Error">
                <TextInput
                    value={error}
                    onChange={setError}
                    placeholder="Ex: Ce champ est requis"
                />
                <div className="mt-2 text-[11px] opacity-40">Vide = pas d’erreur.</div>
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="required" checked={required} onChange={setRequired} />
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                </div>
            </SelectRow>

            <SelectRow label="Direction">
                <Select
                    value={direction}
                    onChange={(v) => setDirection(v as FieldDirection)}
                    options={["vertical", "horizontal"]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Horizontal sert à tester la version “label à gauche”.
                </div>
            </SelectRow>

            <SelectRow label="Slots">
                <div className="space-y-2">
                    <CheckboxRow label="leading" checked={leading} onChange={setLeading} />
                    <CheckboxRow label="trailing" checked={trailing} onChange={setTrailing} />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    leading/trailing sont des slots (icône, badge, bouton…).
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: mets une erreur + required + compact pour valider la hiérarchie visuelle.
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

        const descLine = description
            ? `      description="${description.replaceAll('"', '\\"')}"\n`
            : "";
        const errLine = error ? `      error="${error.replaceAll('"', '\\"')}"\n` : "";

        const leadingLine = leading ? `      leading={<span aria-hidden>✦</span>}\n` : "";
        const trailingLine = trailing ? `      trailing={<button type="button">⟲</button>}\n` : "";

        return `import * as React from "react";
import { IntentControlField } from "intent-design-system";

export function Example() {
  const [value, setValue] = React.useState("${inputValue.replaceAll('"', '\\"')}");

  return (
    <IntentControlField
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      label="${label.replaceAll('"', '\\"')}"
${descLine}      required={${required}}
      direction="${direction}"
      compact={${compact}}
${errLine}${leadingLine}${trailingLine}    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent outline-none"
        placeholder="Tape ici…"
      />
    </IntentControlField>
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
        label,
        description,
        required,
        direction,
        compact,
        error,
        leading,
        trailing,
        inputValue,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    return (
        <PlaygroundComponentShell
            identity={IntentControlFieldIdentity}
            propsTable={IntentControlFieldPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-4">
                    <IntentControlField
                        {...dsInput}
                        mode={mode}
                        disabled={disabled}
                        label={label}
                        // description={description || undefined}
                        error={error || undefined}
                        required={required}
                        direction={direction}
                        compact={compact}
                        leading={leading ? <span aria-hidden>✦</span> : undefined}
                        trailing={trailing ? <span aria-hidden>⟲</span> : undefined}
                    >
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className={cn(
                                "w-full bg-transparent outline-none",
                                "text-sm opacity-90"
                            )}
                            placeholder="Tape ici…"
                        />
                    </IntentControlField>

                    <div className="text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, direction=
                        <span className="font-mono"> {direction}</span>, compact=
                        <span className="font-mono"> {String(compact)}</span>
                    </div>
                </div>
            )}
        />
    );
}
