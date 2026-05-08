"use client";

// src/app/playground/components/intent-control-date/PlaygroundIntentControlDateClient.tsx
// PlaygroundIntentControlDateClient
// - Uses PlaygroundComponentShell to test IntentControlDate
// - Demonstrates both standalone mode and IntentControlField wrapper mode
// - Covers dateMode=single/split + singleVariant=native/text
// - Adds constraints (min/max), readOnly, invalid, etc.
// - Code drawer snippet is copy/paste ready

import React, { useMemo, useState } from "react";

import {
    IntentControlDate,
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,

    // ✅ docs exports from DS
    IntentControlDateIdentity,
    IntentControlDatePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type DateSize = "xs" | "sm" | "md" | "lg" | "xl";

type DateMode = "single" | "split";
type SingleVariant = "native" | "text";
type DateOrder = "DMY" | "MDY" | "YMD";
type SplitPart = "all" | "day" | "month" | "year";

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

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlDateClient() {
    // Preview mode (controls tile background + mode passed to DS)
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
    const [size, setSize] = useState<DateSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [dateMode, setDateMode] = useState<DateMode>("split");
    const [singleVariant, setSingleVariant] = useState<SingleVariant>("native");
    const [order, setOrder] = useState<DateOrder>("DMY");
    const [separator, setSeparator] = useState("/");
    const [splitPart, setSplitPart] = useState<SplitPart>("all");

    const [invalid, setInvalid] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    // Standalone vs Field wrapper demo
    const [wrapInField, setWrapInField] = useState(true);
    const insideField = wrapInField;

    // Standalone slots (only used when NOT wrapped)
    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    // Value model (controlled in playground)
    const [value, setValue] = useState<string | null>("2026-02-18");

    // Constraints
    const [useMinMax, setUseMinMax] = useState(false);
    const [min, setMin] = useState("2020-01-01");
    const [max, setMax] = useState("2030-12-31");

    // Split labels
    const [dayLabel, setDayLabel] = useState("Jour");
    const [monthLabel, setMonthLabel] = useState("Mois");
    const [yearLabel, setYearLabel] = useState("Année");

    // Field wrapper options
    const [fieldLabel, setFieldLabel] = useState("Date");
    const [fieldHint, setFieldHint] = useState(
        "Saisis une date valide. En split: tab, backspace et paste sont gérés."
    );
    const [fieldError, setFieldError] = useState("Date invalide");
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
        // Shell needs a stable input to show resolvedJson/warnings.
        // Here we pass the DS props + a "representative" date state.
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
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow
                        label="wrapInField"
                        checked={wrapInField}
                        onChange={setWrapInField}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    <span className="font-mono">wrapInField=true</span> démontre{" "}
                    <span className="font-mono">IntentControlField</span> (control en mode{" "}
                    <span className="font-mono">insideField</span>).
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as DateSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Date mode">
                <div className="space-y-3">
                    <Select
                        value={dateMode}
                        onChange={(v) => setDateMode(v as DateMode)}
                        options={["single", "split"]}
                    />
                    {dateMode === "single" ? (
                        <Select
                            value={singleVariant}
                            onChange={(v) => setSingleVariant(v as SingleVariant)}
                            options={["native", "text"]}
                        />
                    ) : (
                        <>
                            <Select
                                value={order}
                                onChange={(v) => setOrder(v as DateOrder)}
                                options={["DMY", "MDY", "YMD"]}
                            />

                            {/* ✅ NEW: splitPart */}
                            <Select
                                value={splitPart}
                                onChange={(v) => setSplitPart(v as SplitPart)}
                                options={["all", "day", "month", "year"]}
                            />

                            <TextInput
                                value={separator}
                                onChange={(v) => setSeparator(v.slice(0, 2))}
                                placeholder="/"
                            />
                        </>
                    )}
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    En <span className="font-mono">split</span>: teste paste{" "}
                    <span className="font-mono">18/02/2026</span> ou{" "}
                    <span className="font-mono">2026-02-18</span>.
                </div>
            </SelectRow>

            <SelectRow label="Validation">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>

            <SelectRow label="Value (ISO)">
                <div className="space-y-2">
                    <TextInput
                        value={value ?? ""}
                        onChange={(v) => setValue(v.trim() ? v : null)}
                        placeholder="YYYY-MM-DD"
                    />
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setValue("2026-02-18")}
                            className={cn(
                                "rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm opacity-85",
                                "hover:opacity-100"
                            )}
                        >
                            set: 2026-02-18
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

            <SelectRow label="Constraints (min/max)">
                <div className="space-y-2">
                    <CheckboxRow label="use min/max" checked={useMinMax} onChange={setUseMinMax} />
                </div>

                {useMinMax ? (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">min (ISO)</div>
                            <TextInput value={min} onChange={setMin} placeholder="2020-01-01" />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">max (ISO)</div>
                            <TextInput value={max} onChange={setMax} placeholder="2030-12-31" />
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 text-[11px] opacity-40">
                        Active pour tester le comportement navigateur en{" "}
                        <span className="font-mono">type=date</span>.
                    </div>
                )}
            </SelectRow>

            {dateMode === "split" ? (
                <SelectRow label="Split labels (a11y)">
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">dayLabel</div>
                            <TextInput value={dayLabel} onChange={setDayLabel} />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">monthLabel</div>
                            <TextInput value={monthLabel} onChange={setMonthLabel} />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">yearLabel</div>
                            <TextInput value={yearLabel} onChange={setYearLabel} />
                        </div>
                    </div>
                </SelectRow>
            ) : null}

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
                Astuce: en split, teste tab/backspace entre champs, et paste pour remplir d’un coup.
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

        const minMaxLines =
            useMinMax && singleVariant === "native"
                ? `      min="${min}"\n      max="${max}"\n`
                : useMinMax
                  ? `      min="${min}"\n      max="${max}"\n`
                  : "";

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
      dateMode="${dateMode}"
${
    dateMode === "split"
        ? `      splitPart="${splitPart}"
      order="${order}"
      separator="${separator.replaceAll('"', '\\"')}"
      dayLabel="${dayLabel.replaceAll('"', '\\"')}"
      monthLabel="${monthLabel.replaceAll('"', '\\"')}"
      yearLabel="${yearLabel.replaceAll('"', '\\"')}"
`
        : ""
}${minMaxLines}      value={value}
      onValueChange={(next) => setValue(next)}
`;

        const standaloneSlots = !wrapInField
            ? `      leading={${withLeading ? "<span aria-hidden>📅</span>" : "undefined"}}
      trailing={${withTrailing ? "<span aria-hidden>⌘</span>" : "undefined"}}
      insideField={false}
`
            : `      insideField
`;

        const block = `import * as React from "react";
import { IntentControlDate, IntentControlField } from "intent-design-system";

export function Example() {
  const [value, setValue] = React.useState<string | null>(${value ? `"${value}"` : "null"});

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
      <IntentControlDate
${baseProps}${standaloneSlots}      />
    </IntentControlField>`
        : `    <IntentControlDate
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
        dateMode,
        singleVariant,
        order,
        separator,
        dayLabel,
        monthLabel,
        yearLabel,
        useMinMax,
        min,
        max,
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
        const dateEl = (
            <IntentControlDate
                {...dsInput}
                mode={previewMode}
                size={size}
                fullWidth={fullWidth}
                invalid={invalid}
                readOnly={readOnly}
                insideField={insideField}
                dateMode={dateMode}
                singleVariant={singleVariant}
                splitPart={splitPart}
                order={order}
                separator={separator}
                dayLabel={dayLabel}
                monthLabel={monthLabel}
                yearLabel={yearLabel}
                min={useMinMax ? min : undefined}
                max={useMinMax ? max : undefined}
                value={value}
                onValueChange={(next) => setValue(next)}
                leading={!wrapInField && withLeading ? <span aria-hidden>📅</span> : undefined}
                trailing={!wrapInField && withTrailing ? <span aria-hidden>⌘</span> : undefined}
            />
        );

        if (!wrapInField) return dateEl;

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
                labelFor="ids-date-demo"
            >
                {React.cloneElement(dateEl as any, {
                    id: "ids-date-demo",
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
        dateMode,
        singleVariant,
        order,
        separator,
        dayLabel,
        monthLabel,
        splitPart,
        yearLabel,
        useMinMax,
        min,
        max,
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
            identity={IntentControlDateIdentity}
            propsTable={IntentControlDatePropsTable}
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
                        mode=<span className="font-mono">{previewMode}</span>, dateMode=
                        <span className="font-mono"> {dateMode}</span>
                        {dateMode === "split" ? (
                            <>
                                , splitPart=<span className="font-mono"> {splitPart}</span>
                            </>
                        ) : null}
                        , variant=
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
                        Tip: en <span className="font-mono">split</span>, colle{" "}
                        <span className="font-mono">18/02/2026</span> ou{" "}
                        <span className="font-mono">20260218</span> pour valider le parse.
                    </div>
                </div>
            )}
        />
    );
}
