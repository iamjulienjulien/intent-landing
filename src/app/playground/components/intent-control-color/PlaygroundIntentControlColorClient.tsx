"use client";

// src/app/playground/components/intent-control-color/PlaygroundIntentControlColorClient.tsx
// PlaygroundIntentControlColorClient
// - Uses PlaygroundComponentShell to test IntentControlColor
// - Demonstrates standalone mode and IntentControlField wrapper mode
// - Covers layouts, shapes, sets, labels/hex, custom color picker
// - Code drawer snippet is copy/paste ready

import React, { useMemo, useState } from "react";

import {
    IntentControlColor,
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,
    type IntentControlColorSetName,

    // docs exports
    IntentControlColorIdentity,
    IntentControlColorPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type ColorSize = "xs" | "sm" | "md" | "lg" | "xl";
type ColorLayout = "swatches" | "grid" | "list";
type ColorShape = "circle" | "square" | "pill";

function isAestheticGlow(glow: Glow): boolean {
    return (
        glow === "aurora" ||
        glow === "ember" ||
        glow === "cosmic" ||
        glow === "mythic" ||
        glow === "royal" ||
        glow === "mono" ||
        glow === "boreal" ||
        glow === "solstice" ||
        glow === "nebula" ||
        glow === "verdant" ||
        glow === "nocturne"
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
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                "px-3 py-2 text-sm opacity-85",
                "focus:outline-none focus:ring-2 focus:ring-white/15"
            )}
        />
    );
}

function normalizeHex(input?: string | null) {
    const raw = String(input ?? "")
        .trim()
        .toLowerCase();

    if (!raw) return "";

    if (/^#[0-9a-f]{3}$/i.test(raw)) {
        const r = raw[1];
        const g = raw[2];
        const b = raw[3];
        return `#${r}${r}${g}${g}${b}${b}`;
    }

    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
    return "";
}

/* ============================================================================
   🧪 MOCK OPTIONS
============================================================================ */

const customPalette = [
    { value: "#e11d48", label: "House Stark", description: "Winter warning crimson." },
    { value: "#1d4ed8", label: "House Targaryen", description: "Dragonfire blue twist." },
    { value: "#f59e0b", label: "House Lannister", description: "Golden treasury flare." },
    { value: "#065f46", label: "House Tyrell", description: "Garden emerald bloom." },
    { value: "#7c3aed", label: "House Martell", description: "Dorne dusk violet." },
];

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlColorClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props
    const [size, setSize] = useState<ColorSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [layout, setLayout] = useState<ColorLayout>("swatches");
    const [shape, setShape] = useState<ColorShape>("circle");
    const [columns, setColumns] = useState<"2" | "3" | "4" | "5" | "6" | "7" | "8">("6");

    const [colorSet, setColorSet] = useState<IntentControlColorSetName>("core");
    const [includeSetColorsFirst, setIncludeSetColorsFirst] = useState(true);
    const [useCustomOptions, setUseCustomOptions] = useState(false);

    const [showLabels, setShowLabels] = useState(false);
    const [showHex, setShowHex] = useState(false);

    const [invalid, setInvalid] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [deselectable, setDeselectable] = useState(false);
    const [allowCustom, setAllowCustom] = useState(true);
    const [customLabel, setCustomLabel] = useState("Personnalisée");

    // Standalone vs Field wrapper demo
    const [wrapInField, setWrapInField] = useState(true);
    const insideField = wrapInField;

    // Standalone slots
    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    // Value model
    const [value, setValue] = useState<string | null>("#10b981");

    // Field wrapper options
    const [fieldLabel, setFieldLabel] = useState("Couleur");
    const [fieldHint, setFieldHint] = useState(
        "Choisis une teinte canonique ou ouvre le picker personnalisé."
    );
    const [fieldError, setFieldError] = useState("Couleur invalide");
    const [showError, setShowError] = useState(false);

    const [fieldPadded, setFieldPadded] = useState(true);
    const [fieldCompact, setFieldCompact] = useState(false);
    const [fieldLeading, setFieldLeading] = useState(false);
    const [fieldTrailing, setFieldTrailing] = useState(false);
    const [fieldDirection, setFieldDirection] = useState<"vertical" | "horizontal">("vertical");

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
            toneStep,
            disabled,
        } as const;
    }, [intent, variant, toneEnabled, tone, aestheticEnabled, glow, intensity, toneStep, disabled]);

    const resolvedWithWarnings = useMemo(() => {
        return resolveIntentWithWarnings({
            ...dsInput,
            mode: previewMode,
        } as any);
    }, [dsInput, previewMode]);

    const glowOptions = aestheticEnabled
        ? ([
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
          ] as const)
        : (["false", "true"] as const);

    const optionsProp = useMemo(() => {
        return useCustomOptions ? customPalette : undefined;
    }, [useCustomOptions]);

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
                    Référence canonique: <span className="font-mono">500</span>.
                </div>
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
            <SelectRow label="Layout">
                <div className="space-y-3">
                    <Select
                        value={layout}
                        onChange={(v) => setLayout(v as ColorLayout)}
                        options={["swatches", "grid", "list"]}
                    />
                    <Select
                        value={shape}
                        onChange={(v) => setShape(v as ColorShape)}
                        options={["circle", "square", "pill"]}
                    />
                    {layout === "grid" ? (
                        <Select
                            value={columns}
                            onChange={(v) => setColumns(v as any)}
                            options={["2", "3", "4", "5", "6", "7", "8"]}
                        />
                    ) : null}
                </div>

                <div className="mt-3 space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow
                        label="wrapInField"
                        checked={wrapInField}
                        onChange={setWrapInField}
                    />
                </div>

                <div className="mt-2 text-[11px] opacity-40">
                    <span className="font-mono">wrapInField=true</span> démontre{" "}
                    <span className="font-mono">IntentControlField</span> avec{" "}
                    <span className="font-mono">insideField</span>.
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as ColorSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Palette">
                <div className="space-y-3">
                    <Select
                        value={colorSet}
                        onChange={(v) => setColorSet(v as IntentControlColorSetName)}
                        options={[
                            "core",
                            "pastel",
                            "earth",
                            "ocean",
                            "sunset",
                            "forest",
                            "royal",
                            "mono",
                            "neon",
                        ]}
                    />

                    <div className="space-y-2">
                        <CheckboxRow
                            label="use custom options"
                            checked={useCustomOptions}
                            onChange={setUseCustomOptions}
                        />
                        <CheckboxRow
                            label="includeSetColorsFirst"
                            checked={includeSetColorsFirst}
                            onChange={setIncludeSetColorsFirst}
                        />
                        <CheckboxRow
                            label="allowCustom"
                            checked={allowCustom}
                            onChange={setAllowCustom}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Display">
                <div className="space-y-2">
                    <CheckboxRow label="showLabels" checked={showLabels} onChange={setShowLabels} />
                    <CheckboxRow label="showHex" checked={showHex} onChange={setShowHex} />
                    <CheckboxRow
                        label="deselectable"
                        checked={deselectable}
                        onChange={setDeselectable}
                    />
                </div>

                {allowCustom ? (
                    <div className="mt-3">
                        <div className="text-[11px] opacity-55 mb-1">customLabel</div>
                        <TextInput value={customLabel} onChange={setCustomLabel} />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Validation">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>

            <SelectRow label="Value (hex)">
                <div className="space-y-2">
                    <TextInput
                        value={value ?? ""}
                        onChange={(v) => setValue(v.trim() ? v : null)}
                        placeholder="#10b981"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setValue("#10b981")}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85",
                                "hover:opacity-100"
                            )}
                        >
                            set: #10b981
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue("#8b5cf6")}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85",
                                "hover:opacity-100"
                            )}
                        >
                            set: #8b5cf6
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue("#ffffff")}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85",
                                "hover:opacity-100"
                            )}
                        >
                            set: #ffffff
                        </button>

                        <button
                            type="button"
                            onClick={() => setValue(null)}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85",
                                "hover:opacity-100"
                            )}
                        >
                            clear
                        </button>
                    </div>

                    <div className="text-[11px] opacity-40">
                        (Contrôlé) Ce champ pilote <span className="font-mono">value</span>.
                    </div>
                </div>
            </SelectRow>

            {!wrapInField ? (
                <SelectRow label="Standalone slots">
                    <div className="space-y-2">
                        <CheckboxRow
                            label="leading"
                            checked={withLeading}
                            onChange={setWithLeading}
                        />
                        <CheckboxRow
                            label="trailing"
                            checked={withTrailing}
                            onChange={setWithTrailing}
                        />
                    </div>
                    <div className="mt-2 text-[11px] opacity-40">
                        En mode field, préfère les slots du Field.
                    </div>
                </SelectRow>
            ) : (
                <SelectRow label="Field wrapper">
                    <div className="space-y-2">
                        <CheckboxRow
                            label="field.padded"
                            checked={fieldPadded}
                            onChange={setFieldPadded}
                        />
                        <CheckboxRow
                            label="field.compact"
                            checked={fieldCompact}
                            onChange={setFieldCompact}
                        />
                        <CheckboxRow
                            label="field.leading"
                            checked={fieldLeading}
                            onChange={setFieldLeading}
                        />
                        <CheckboxRow
                            label="field.trailing"
                            checked={fieldTrailing}
                            onChange={setFieldTrailing}
                        />
                        <CheckboxRow
                            label="show error"
                            checked={showError}
                            onChange={setShowError}
                        />
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3">
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.label</div>
                            <TextInput value={fieldLabel} onChange={setFieldLabel} />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.hint</div>
                            <TextInput value={fieldHint} onChange={setFieldHint} />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.error</div>
                            <TextInput value={fieldError} onChange={setFieldError} />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.direction</div>
                            <Select
                                value={fieldDirection}
                                onChange={(v) => setFieldDirection(v as any)}
                                options={["vertical", "horizontal"]}
                            />
                        </div>
                    </div>
                </SelectRow>
            )}

            <div className="text-[11px] opacity-55">
                Astuce: active <span className="font-mono">list</span> +{" "}
                <span className="font-mono">showLabels/showHex</span> pour une lecture plus
                documentaire.
            </div>
        </>
    );

    /* ============================================================================
       🧾 Code drawer string
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const optionsLine = useCustomOptions ? `      options={customOptions}\n` : "";

        const baseProps = `      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      toneStep={${toneStep}}
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      readOnly={${readOnly}}
      layout="${layout}"
      shape="${shape}"
      columns={${Number(columns)}}
      colorSet="${colorSet}"
      includeSetColorsFirst={${includeSetColorsFirst}}
      showLabels={${showLabels}}
      showHex={${showHex}}
      allowCustom={${allowCustom}}
      customLabel="${customLabel.replaceAll('"', '\\"')}"
      deselectable={${deselectable}}
${optionsLine}      value={value}
      onValueChange={(next) => setValue(next)}
`;

        const standaloneSlots = !wrapInField
            ? `      leading={${withLeading ? "<span aria-hidden>🎨</span>" : "undefined"}}
      trailing={${withTrailing ? "<span aria-hidden>✦</span>" : "undefined"}}
      insideField={false}
`
            : `      insideField
`;

        const optionsConst = useCustomOptions
            ? `const customOptions = [
    { value: "#e11d48", label: "House Stark", description: "Winter warning crimson." },
    { value: "#1d4ed8", label: "House Targaryen", description: "Dragonfire blue twist." },
    { value: "#f59e0b", label: "House Lannister", description: "Golden treasury flare." },
    { value: "#065f46", label: "House Tyrell", description: "Garden emerald bloom." },
    { value: "#7c3aed", label: "House Martell", description: "Dorne dusk violet." },
];

`
            : "";

        const block = `import * as React from "react";
import { IntentControlColor, IntentControlField } from "intent-design-system";

${optionsConst}export function Example() {
  const [value, setValue] = React.useState<string | null>(${value ? `"${normalizeHex(value)}"` : "null"});

  return (
${
    wrapInField
        ? `    <IntentControlField
      label="${fieldLabel.replaceAll('"', '\\"')}"
      hint="${fieldHint.replaceAll('"', '\\"')}"
      ${showError ? `error="${fieldError.replaceAll('"', '\\"')}"` : ""}
      padded={${fieldPadded}}
      compact={${fieldCompact}}
      direction="${fieldDirection}"
      leading={${fieldLeading ? "<span aria-hidden>✦</span>" : "undefined"}}
      trailing={${fieldTrailing ? "<span aria-hidden>⌘</span>" : "undefined"}}
      ${invalid ? "invalid" : ""}
      ${disabled ? "disabled" : ""}
      intent="${intent}"
      variant="${variant}"
      mode="${previewMode}"
      intensity="${intensity}"
    >
      <IntentControlColor
${baseProps}${standaloneSlots}      />
    </IntentControlField>`
        : `    <IntentControlColor
${baseProps}${standaloneSlots}    />`
}
  );
}`;
        return block;
    }, [
        wrapInField,
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        toneStep,
        disabled,
        size,
        fullWidth,
        invalid,
        readOnly,
        layout,
        shape,
        columns,
        colorSet,
        includeSetColorsFirst,
        showLabels,
        showHex,
        allowCustom,
        customLabel,
        deselectable,
        useCustomOptions,
        value,
        withLeading,
        withTrailing,
        fieldLabel,
        fieldHint,
        fieldError,
        showError,
        fieldPadded,
        fieldCompact,
        fieldLeading,
        fieldTrailing,
        fieldDirection,
    ]);

    /* ============================================================================
       ✅ Preview render
    ============================================================================ */

    const preview = useMemo(() => {
        const colorEl = (
            <IntentControlColor
                {...dsInput}
                mode={previewMode}
                size={size}
                fullWidth={fullWidth}
                invalid={invalid}
                readOnly={readOnly}
                insideField={insideField}
                layout={layout}
                shape={shape}
                columns={Number(columns) as 2 | 3 | 4 | 5 | 6 | 7 | 8}
                colorSet={colorSet}
                options={optionsProp}
                includeSetColorsFirst={includeSetColorsFirst}
                showLabels={showLabels}
                showHex={showHex}
                allowCustom={allowCustom}
                customLabel={customLabel}
                deselectable={deselectable}
                value={value}
                onValueChange={(next) => setValue(next)}
                leading={!wrapInField && withLeading ? <span aria-hidden>🎨</span> : undefined}
                trailing={!wrapInField && withTrailing ? <span aria-hidden>✦</span> : undefined}
            />
        );

        if (!wrapInField) return colorEl;

        return (
            <IntentControlField
                {...dsInput}
                mode={previewMode}
                label={fieldLabel}
                hint={fieldHint}
                error={showError ? fieldError : undefined}
                padded={fieldPadded}
                compact={fieldCompact}
                direction={fieldDirection}
                leading={fieldLeading ? <span aria-hidden>✦</span> : undefined}
                trailing={fieldTrailing ? <span aria-hidden>⌘</span> : undefined}
                invalid={invalid}
                disabled={disabled}
                labelFor="ids-color-demo"
            >
                {React.cloneElement(colorEl as any, {
                    id: "ids-color-demo",
                    insideField: true,
                    leading: undefined,
                    trailing: undefined,
                })}
            </IntentControlField>
        );
    }, [
        dsInput,
        previewMode,
        size,
        fullWidth,
        invalid,
        readOnly,
        insideField,
        layout,
        shape,
        columns,
        colorSet,
        optionsProp,
        includeSetColorsFirst,
        showLabels,
        showHex,
        allowCustom,
        customLabel,
        deselectable,
        value,
        wrapInField,
        withLeading,
        withTrailing,
        fieldLabel,
        fieldHint,
        fieldError,
        showError,
        fieldPadded,
        fieldCompact,
        fieldLeading,
        fieldTrailing,
        fieldDirection,
        disabled,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlColorIdentity}
            propsTable={IntentControlColorPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={() => (
                <div className="w-full min-w-0">
                    <div className={cn("w-full min-w-0", fullWidth ? "" : "flex items-start")}>
                        {preview}
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{previewMode}</span>, layout=
                        <span className="font-mono"> {layout}</span>, shape=
                        <span className="font-mono"> {shape}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, size=
                        <span className="font-mono"> {size}</span>, value=
                        <span className="font-mono"> {value ?? "null"}</span>
                        {readOnly ? (
                            <>
                                , readOnly=<span className="font-mono">true</span>
                            </>
                        ) : null}
                        {invalid ? (
                            <>
                                , invalid=<span className="font-mono">true</span>
                            </>
                        ) : null}
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Tip: essaie <span className="font-mono">grid</span> +{" "}
                        <span className="font-mono">square</span> pour une vibe palette tool, ou{" "}
                        <span className="font-mono">list</span> +{" "}
                        <span className="font-mono">showHex</span> pour une lecture plus précise.
                    </div>
                </div>
            )}
        />
    );
}
