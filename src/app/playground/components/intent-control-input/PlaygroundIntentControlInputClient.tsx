"use client";

// src/app/playground/components/intent-control-input/PlaygroundIntentControlInputClient.tsx
// PlaygroundIntentControlInputClient
// - Uses PlaygroundComponentShell to test IntentControlInput (input + textarea)
// - Demonstrates both standalone mode and IntentControlField wrapper mode
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlInput,
    IntentControlField,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlInputIdentity,
    IntentControlInputPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

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

type AsKind = "input" | "textarea";

export default function PlaygroundIntentControlInputClient() {
    // Preview mode (controls tile background + mode passed to DS)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");
    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (Input)
    const [as, setAs] = useState<AsKind>("input");
    const [size, setSize] = useState<InputSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [placeholder, setPlaceholder] = useState("Nom de la quête…");
    const [value, setValue] = useState<string>("");

    const [invalid, setInvalid] = useState(false);

    // Standalone vs Field wrapper demo
    const [wrapInField, setWrapInField] = useState(true);

    // When wrapped: input should be naked inside the field frame
    const insideField = wrapInField;

    // Standalone slots (only used when NOT wrapped)
    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    // Textarea-only
    const [autoSize, setAutoSize] = useState(true);
    const [minRows, setMinRows] = useState(2);
    const [maxRows, setMaxRows] = useState(8);

    // Field wrapper options (only used when wrapped)
    const [fieldLabel, setFieldLabel] = useState("Titre");
    const [fieldHint, setFieldHint] = useState(
        "Un intitulé clair aide le MJ à suivre ton fil narratif."
    );
    const [fieldError, setFieldError] = useState("Champ requis");
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
            <SelectRow label="Type">
                <Select
                    value={as}
                    onChange={(v) => setAs(v as AsKind)}
                    options={["input", "textarea"]}
                />
            </SelectRow>

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
                    <span className="font-mono">wrapInField=true</span> démontre l’intégration avec{" "}
                    <span className="font-mono">IntentControlField</span> (input en mode{" "}
                    <span className="font-mono">insideField</span>).
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as InputSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Validation">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
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

            <SelectRow label="Value">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={cn(
                        "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                        "px-3 py-2 text-sm opacity-85",
                        "focus:outline-none focus:ring-2 focus:ring-white/15"
                    )}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    (Contrôlé) Utilise ce champ pour éditer la valeur du composant dans le preview.
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
                        En mode standalone, les slots du composant input sont utiles. En mode field,
                        préfère les slots du Field.
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
                            <input
                                value={fieldLabel}
                                onChange={(e) => setFieldLabel(e.target.value)}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
                        </div>

                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.hint</div>
                            <input
                                value={fieldHint}
                                onChange={(e) => setFieldHint(e.target.value)}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
                        </div>

                        <div>
                            <div className="text-[11px] opacity-55 mb-1">field.error</div>
                            <input
                                value={fieldError}
                                onChange={(e) => setFieldError(e.target.value)}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
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

            {as === "textarea" ? (
                <SelectRow label="Textarea">
                    <div className="space-y-2">
                        <CheckboxRow label="autoSize" checked={autoSize} onChange={setAutoSize} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">minRows</div>
                            <input
                                type="number"
                                value={minRows}
                                min={1}
                                onChange={(e) => setMinRows(Number(e.target.value))}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
                        </div>
                        <div>
                            <div className="text-[11px] opacity-55 mb-1">maxRows</div>
                            <input
                                type="number"
                                value={maxRows}
                                min={1}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
                        </div>
                    </div>
                </SelectRow>
            ) : null}

            <div className="text-[11px] opacity-55">
                Astuce: teste tab/focus + placeholder + invalid + insideField pour valider les
                hooks.
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

        const baseProps = `      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      value={value}
      onChange={(e) => setValue(e.target.value)}
`;

        const textareaProps =
            as === "textarea"
                ? `      as="textarea"
      autoSize={${autoSize}}
      minRows={${minRows}}
      maxRows={${maxRows}}
`
                : "";

        const standaloneSlots = !wrapInField
            ? `      leading={${withLeading ? "<span aria-hidden>✦</span>" : "undefined"}}
      trailing={${withTrailing ? "<span aria-hidden>⌘</span>" : "undefined"}}
      insideField={false}
`
            : `      insideField
`;

        const inputBlock = `import * as React from "react";
import { IntentControlInput, IntentControlField } from "intent-design-system";

export function Example() {
  const [value, setValue] = React.useState("");

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
      <IntentControlInput
${baseProps}${textareaProps}${standaloneSlots}      />
    </IntentControlField>`
        : `    <IntentControlInput
${baseProps}${textareaProps}${standaloneSlots}    />`
}
  );
}`;

        return inputBlock;
    }, [
        wrapInField,
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        size,
        fullWidth,
        invalid,
        placeholder,
        value,
        as,
        autoSize,
        minRows,
        maxRows,
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
        const inputEl =
            as === "textarea" ? (
                <IntentControlInput
                    {...dsInput}
                    mode={previewMode}
                    as="textarea"
                    autoSize={autoSize}
                    minRows={minRows}
                    maxRows={maxRows}
                    size={size}
                    fullWidth={fullWidth}
                    invalid={invalid}
                    insideField={insideField}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue((e.target as HTMLTextAreaElement).value)}
                />
            ) : (
                <IntentControlInput
                    {...dsInput}
                    mode={previewMode}
                    size={size}
                    fullWidth={fullWidth}
                    invalid={invalid}
                    insideField={insideField}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue((e.target as HTMLInputElement).value)}
                    leading={!wrapInField && withLeading ? <span aria-hidden>✦</span> : undefined}
                    trailing={!wrapInField && withTrailing ? <span aria-hidden>⌘</span> : undefined}
                />
            );

        if (!wrapInField) return inputEl;

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
                labelFor="ids-input-demo"
            >
                {React.cloneElement(inputEl as any, {
                    id: "ids-input-demo",
                    // When wrapped: always naked
                    insideField: true,
                    // Prefer field slots when wrapped
                    leading: undefined,
                    trailing: undefined,
                })}
            </IntentControlField>
        );
    }, [
        as,
        dsInput,
        previewMode,
        autoSize,
        minRows,
        maxRows,
        size,
        fullWidth,
        invalid,
        insideField,
        placeholder,
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
            identity={IntentControlInputIdentity}
            propsTable={IntentControlInputPropsTable}
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
                        as=<span className="font-mono">{as}</span>, wrapInField=
                        <span className="font-mono"> {String(wrapInField)}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, size=
                        <span className="font-mono"> {size}</span>, invalid=
                        <span className="font-mono"> {String(invalid)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Astuce: mets <span className="font-mono">wrapInField=true</span> pour
                        valider le contrat “Field owns the frame”.
                    </div>
                </div>
            )}
        />
    );
}
