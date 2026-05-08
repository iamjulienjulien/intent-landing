"use client";

// src/app/playground/components/intent-control-button-group/PlaygroundIntentControlButtonGroupClient.tsx
// PlaygroundIntentControlButtonGroupClient
// - Uses PlaygroundComponentShell to test IntentControlButtonGroup
// - Covers single / multiple / none selection
// - Covers horizontal / vertical / attached / wrap / equalWidth
// - Covers mixed button + link items
// - Includes copy/paste-ready code snippet

import React, { useMemo, useState } from "react";

import {
    IntentControlButtonGroup,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type IntentControlButtonGroupItem,
    type IntentControlButtonGroupSelectionMode,
    type IntentControlButtonGroupOrientation,
    type IntentControlButtonGroupJustify,
    type IntentControlButtonGroupValue,

    // docs exports
    IntentControlButtonGroupIdentity,
    IntentControlButtonGroupPropsTable,
    // IntentPickerTone,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type GroupSize = "xs" | "sm" | "md" | "lg" | "xl";
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

function valueToLabel(v: IntentControlButtonGroupValue) {
    if (Array.isArray(v)) return `[${v.join(", ")}]`;
    return v ?? "null";
}

function normalizeDemoValue(
    value: IntentControlButtonGroupValue,
    selectionMode: IntentControlButtonGroupSelectionMode
): IntentControlButtonGroupValue {
    if (selectionMode === "multiple") {
        return Array.isArray(value) ? value : [];
    }

    if (selectionMode === "none") {
        return null;
    }

    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
}

function nextPresetValue(
    selectionMode: IntentControlButtonGroupSelectionMode
): IntentControlButtonGroupValue {
    if (selectionMode === "multiple") return ["stark", "north"];
    if (selectionMode === "none") return null;
    return "stark";
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlButtonGroupClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props
    const [size, setSize] = useState<GroupSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [selectionMode, setSelectionMode] =
        useState<IntentControlButtonGroupSelectionMode>("single");
    const [allowDeselect, setAllowDeselect] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    const [orientation, setOrientation] =
        useState<IntentControlButtonGroupOrientation>("horizontal");
    const [attached, setAttached] = useState(false);
    const [wrap, setWrap] = useState(false);
    const [equalWidth, setEqualWidth] = useState(false);
    const [justify, setJustify] = useState<IntentControlButtonGroupJustify>("start");

    const [withLinks, setWithLinks] = useState(true);
    const [withDisabledItem, setWithDisabledItem] = useState(true);
    const [withIcons, setWithIcons] = useState(true);

    const [value, setValue] = useState<IntentControlButtonGroupValue>("stark");

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
    }, [aestheticEnabled, glow]);

    React.useEffect(() => {
        setValue((prev) => normalizeDemoValue(prev, selectionMode));
    }, [selectionMode]);

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

    const items = useMemo<IntentControlButtonGroupItem[]>(() => {
        const icon = (emoji: string) => (withIcons ? <span aria-hidden>{emoji}</span> : undefined);

        const base: IntentControlButtonGroupItem[] = [
            {
                value: "stark",
                label: "House Stark",
                leftIcon: icon("🐺"),
            },
            {
                value: "targaryen",
                label: "Targaryen",
                leftIcon: icon("🐉"),
            },
            {
                value: "north",
                label: "The North",
                leftIcon: icon("❄️"),
                disabled: withDisabledItem,
            },
        ];

        if (withLinks) {
            base.push({
                kind: "link",
                value: "wall",
                label: "The Wall",
                href: "#wall",
                leftIcon: icon("🧱"),
            });
            base.push({
                kind: "link",
                value: "kings-landing",
                label: "King's Landing",
                href: "#kings-landing",
                leftIcon: icon("👑"),
            });
        } else {
            base.push({
                value: "wall",
                label: "The Wall",
                leftIcon: icon("🧱"),
            });
            base.push({
                value: "kings-landing",
                label: "King's Landing",
                leftIcon: icon("👑"),
            });
        }

        return base;
    }, [withLinks, withDisabledItem, withIcons]);

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
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Selection">
                <div className="space-y-3">
                    <Select
                        value={selectionMode}
                        onChange={(v) =>
                            setSelectionMode(v as IntentControlButtonGroupSelectionMode)
                        }
                        options={["none", "single", "multiple"]}
                    />

                    {selectionMode === "single" ? (
                        <CheckboxRow
                            label="allowDeselect"
                            checked={allowDeselect}
                            onChange={setAllowDeselect}
                        />
                    ) : null}
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as GroupSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-3">
                    <Select
                        value={orientation}
                        onChange={(v) => setOrientation(v as IntentControlButtonGroupOrientation)}
                        options={["horizontal", "vertical"]}
                    />

                    <Select
                        value={justify}
                        onChange={(v) => setJustify(v as IntentControlButtonGroupJustify)}
                        options={["start", "center", "end", "stretch"]}
                    />

                    <div className="space-y-2">
                        <CheckboxRow
                            label="fullWidth"
                            checked={fullWidth}
                            onChange={setFullWidth}
                        />
                        <CheckboxRow label="attached" checked={attached} onChange={setAttached} />
                        <CheckboxRow label="wrap" checked={wrap} onChange={setWrap} />
                        <CheckboxRow
                            label="equalWidth"
                            checked={equalWidth}
                            onChange={setEqualWidth}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Demo data">
                <div className="space-y-2">
                    <CheckboxRow label="withLinks" checked={withLinks} onChange={setWithLinks} />
                    <CheckboxRow
                        label="withDisabledItem"
                        checked={withDisabledItem}
                        onChange={setWithDisabledItem}
                    />
                    <CheckboxRow label="withIcons" checked={withIcons} onChange={setWithIcons} />
                </div>
            </SelectRow>

            <SelectRow label="Value">
                <div className="space-y-2">
                    <button
                        type="button"
                        className={cn(
                            "rounded-xl px-3 py-2 text-sm",
                            "bg-black/25 ring-1 ring-white/10",
                            "hover:bg-black/35 transition"
                        )}
                        onClick={() => setValue(nextPresetValue(selectionMode))}
                    >
                        Set preset value
                    </button>

                    <button
                        type="button"
                        className={cn(
                            "rounded-xl px-3 py-2 text-sm",
                            "bg-black/25 ring-1 ring-white/10",
                            "hover:bg-black/35 transition"
                        )}
                        onClick={() => setValue(selectionMode === "multiple" ? [] : null)}
                    >
                        Reset value
                    </button>
                </div>

                <div className="mt-2 text-[11px] opacity-40">
                    Valeur actuelle: <span className="font-mono">{valueToLabel(value)}</span>
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: teste <span className="font-mono">Arrow</span>,{" "}
                <span className="font-mono">Home</span> et <span className="font-mono">End</span>{" "}
                pour la navigation clavier.
            </div>
        </>
    );

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const itemsCode = withLinks
            ? `const items = [
  { value: "stark", label: "House Stark", leftIcon: <span aria-hidden>🐺</span> },
  { value: "targaryen", label: "Targaryen", leftIcon: <span aria-hidden>🐉</span> },
  { value: "north", label: "The North", leftIcon: <span aria-hidden>❄️</span>, disabled: ${withDisabledItem} },
  { kind: "link", value: "wall", label: "The Wall", href: "#wall", leftIcon: <span aria-hidden>🧱</span> },
  { kind: "link", value: "kings-landing", label: "King's Landing", href: "#kings-landing", leftIcon: <span aria-hidden>👑</span> },
];`
            : `const items = [
  { value: "stark", label: "House Stark", leftIcon: <span aria-hidden>🐺</span> },
  { value: "targaryen", label: "Targaryen", leftIcon: <span aria-hidden>🐉</span> },
  { value: "north", label: "The North", leftIcon: <span aria-hidden>❄️</span>, disabled: ${withDisabledItem} },
  { value: "wall", label: "The Wall", leftIcon: <span aria-hidden>🧱</span> },
  { value: "kings-landing", label: "King's Landing", leftIcon: <span aria-hidden>👑</span> },
];`;

        const initialValue =
            selectionMode === "multiple"
                ? JSON.stringify(Array.isArray(value) ? value : [])
                : value === null
                  ? "null"
                  : `"${Array.isArray(value) ? (value[0] ?? "") : value}"`;

        return `import * as React from "react";
import { IntentControlButtonGroup } from "intent-design-system";

${itemsCode}

export function Example() {
  const [value, setValue] = React.useState(${initialValue});

  return (
    <IntentControlButtonGroup
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      size="${size}"
      fullWidth={${fullWidth}}
      selectionMode="${selectionMode}"
      allowDeselect={${allowDeselect}}
      orientation="${orientation}"
      attached={${attached}}
      wrap={${wrap}}
      equalWidth={${equalWidth}}
      justify="${justify}"
      value={value}
      onValueChange={setValue}
      items={items}
    />
  );
}`.trim();
    }, [
        withLinks,
        withDisabledItem,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        readOnly,
        size,
        fullWidth,
        selectionMode,
        allowDeselect,
        orientation,
        attached,
        wrap,
        equalWidth,
        justify,
        value,
        previewMode,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlButtonGroupIdentity}
            propsTable={IntentControlButtonGroupPropsTable}
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
                        <IntentControlButtonGroup
                            {...dsInput}
                            mode={mode}
                            size={size}
                            fullWidth={fullWidth}
                            selectionMode={selectionMode}
                            allowDeselect={allowDeselect}
                            readOnly={readOnly}
                            orientation={orientation}
                            attached={attached}
                            wrap={wrap}
                            equalWidth={equalWidth}
                            justify={justify}
                            value={value}
                            onValueChange={setValue}
                            items={items}
                        />
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        selectionMode=<span className="font-mono">{selectionMode}</span>, value=
                        <span className="font-mono"> {valueToLabel(value)}</span>, orientation=
                        <span className="font-mono"> {orientation}</span>, attached=
                        <span className="font-mono"> {String(attached)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Mélange boutons et liens, ou passe en{" "}
                        <span className="font-mono">multiple</span> pour voir le groupe changer de
                        logique comme une petite bannière de guerre 🐺
                    </div>
                </div>
            )}
        />
    );
}
