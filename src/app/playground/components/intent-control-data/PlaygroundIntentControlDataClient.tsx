"use client";

// src/app/playground/components/intent-control-data/PlaygroundIntentControlDataClient.tsx
// PlaygroundIntentControlDataClient
// - Uses PlaygroundComponentShell to test IntentControlData
// - Demonstrates standalone mode and IntentControlField wrapper mode
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlData,
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type IntentControlDataFormat,

    // ✅ docs exports from DS
    IntentControlDataIdentity,
    IntentControlDataPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type DataSize = "xs" | "sm" | "md" | "lg" | "xl";

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
   ✅ MAIN
============================================================================ */

const SAMPLE: Record<IntentControlDataFormat, string> = {
    json: `{
  "adventure": {
    "title": "RPG Renaissance",
    "chapter": 14,
    "status": "active"
  },
  "quests": [
    { "id": "q_001", "title": "Serment de Renouveau", "done": false },
    { "id": "q_002", "title": "Nettoyer l'atelier", "done": true }
  ]
}
`,
    yaml: `adventure:
  title: RPG Renaissance
  chapter: 14
  status: active
quests:
  - id: q_001
    title: Serment de Renouveau
    done: false
  - id: q_002
    title: Nettoyer l'atelier
    done: true
`,
    toml: `title = "RPG Renaissance"
chapter = 14
status = "active"

[[quests]]
id = "q_001"
title = "Serment de Renouveau"
done = false
`,
    xml: `<!-- Minimal XML -->
<adventure title="RPG Renaissance" chapter="14">
  <quest id="q_001" done="false">Serment de Renouveau</quest>
  <quest id="q_002" done="true">Nettoyer l'atelier</quest>
</adventure>
`,
    ini: `; INI sample
[adventure]
title=RPG Renaissance
chapter=14
status=active
`,
    graphql: `query GetChapter {
  adventure {
    title
    chapter
    quests {
      id
      title
      done
    }
  }
}
`,
    sql: `SELECT id, title, done
FROM quests
WHERE chapter = 14
ORDER BY id ASC;
`,
    text: `Plain text data
- still readable
- no syntax tokens
`,
};

export default function PlaygroundIntentControlDataClient() {
    // Preview mode (controls tile background + mode passed to DS)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (Data)
    const [format, setFormat] = useState<IntentControlDataFormat>("json");
    const [size, setSize] = useState<DataSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [placeholder, setPlaceholder] = useState('{ "key": "value" }');
    const [value, setValue] = useState<string>(SAMPLE.json);

    const [invalid, setInvalid] = useState(false);

    // Standalone vs Field wrapper demo
    const [wrapInField, setWrapInField] = useState(true);
    const insideField = wrapInField;

    // Data-specific
    const [readOnly, setReadOnly] = useState(false);
    const [pretty, setPretty] = useState(true);
    const [indent, setIndent] = useState(2);
    const [showLineNumbers, setShowLineNumbers] = useState(false);

    // Field wrapper options (only used when wrapped)
    const [fieldLabel, setFieldLabel] = useState("Données");
    const [fieldHint, setFieldHint] = useState(
        "Colle ton JSON/YAML, édite, puis blur pour tester le pretty-print JSON."
    );
    const [fieldError, setFieldError] = useState("Données invalides");
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

    // When switching format, optionally load a sample (nice for demo)
    React.useEffect(() => {
        setValue((prev) => (prev.trim().length ? prev : SAMPLE[format]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [format]);

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

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                </div>
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Format">
                <Select
                    value={format}
                    onChange={(v) => setFormat(v as IntentControlDataFormat)}
                    options={["json", "yaml", "toml", "xml", "ini", "graphql", "sql", "text"]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Change le format pour voir la coloration évoluer (tokenizer léger).
                </div>
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
                    <span className="font-mono">IntentControlField</span> (data editor en mode{" "}
                    <span className="font-mono">insideField</span>).
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as DataSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Validation">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                </div>
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                    <CheckboxRow
                        label="showLineNumbers"
                        checked={showLineNumbers}
                        onChange={setShowLineNumbers}
                    />
                    <CheckboxRow label="pretty (JSON blur)" checked={pretty} onChange={setPretty} />
                </div>

                <div className="mt-3">
                    <div className="text-[11px] opacity-55 mb-1">indent</div>
                    <input
                        type="number"
                        value={indent}
                        min={0}
                        max={8}
                        onChange={(e) => setIndent(Number(e.target.value))}
                        className={cn(
                            "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                            "px-3 py-2 text-sm opacity-85",
                            "focus:outline-none focus:ring-2 focus:ring-white/15"
                        )}
                    />
                    <div className="mt-2 text-[11px] opacity-40">
                        Utilisé seulement pour le JSON quand{" "}
                        <span className="font-mono">pretty</span> est activé.
                    </div>
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

            <SelectRow label="Value (quick set)">
                <Select
                    value={format}
                    onChange={(v) => {
                        const f = v as IntentControlDataFormat;
                        setFormat(f);
                        setValue(SAMPLE[f]);
                    }}
                    options={["json", "yaml", "toml", "xml", "ini", "graphql", "sql", "text"]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Ce select sert à injecter un exemple propre dans l’éditeur.
                </div>
            </SelectRow>

            {wrapInField ? (
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
            ) : null}

            <div className="text-[11px] opacity-55">
                Astuce: active <span className="font-mono">showLineNumbers</span> puis scrolle pour
                valider la synchro overlay/textarea.
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

        const editorBlock = `import * as React from "react";
import { IntentControlData, IntentControlField } from "intent-design-system";

export function Example() {
  const [value, setValue] = React.useState<string>(${JSON.stringify(value)});

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
      <IntentControlData
        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
        disabled={${disabled}}
        size="${size}"
        fullWidth={${fullWidth}}
        insideField
        invalid={${invalid}}
        format="${format}"
        readOnly={${readOnly}}
        pretty={${pretty}}
        indent={${indent}}
        showLineNumbers={${showLineNumbers}}
        placeholder="${placeholder.replaceAll('"', '\\"')}"
        value={value}
        onValueChange={setValue}
      />
    </IntentControlField>`
        : `    <IntentControlData
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      format="${format}"
      readOnly={${readOnly}}
      pretty={${pretty}}
      indent={${indent}}
      showLineNumbers={${showLineNumbers}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      value={value}
      onValueChange={setValue}
    />`
}
  );
}`;
        return editorBlock;
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
        format,
        readOnly,
        pretty,
        indent,
        showLineNumbers,
        placeholder,
        value,
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
        const editor = (
            <IntentControlData
                {...dsInput}
                mode={previewMode}
                size={size}
                fullWidth={fullWidth}
                insideField={insideField}
                invalid={invalid}
                format={format}
                readOnly={readOnly}
                pretty={pretty}
                indent={indent}
                showLineNumbers={showLineNumbers}
                placeholder={placeholder}
                value={value}
                onValueChange={setValue}
            />
        );

        if (!wrapInField) return editor;

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
                labelFor="ids-data-demo"
            >
                {React.cloneElement(editor as any, { id: "ids-data-demo", insideField: true })}
            </IntentControlField>
        );
    }, [
        dsInput,
        previewMode,
        size,
        fullWidth,
        insideField,
        invalid,
        format,
        readOnly,
        pretty,
        indent,
        showLineNumbers,
        placeholder,
        value,
        wrapInField,
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
            identity={IntentControlDataIdentity}
            propsTable={IntentControlDataPropsTable}
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
                        format=<span className="font-mono">{format}</span>, wrapInField=
                        <span className="font-mono"> {String(wrapInField)}</span>, readOnly=
                        <span className="font-mono"> {String(readOnly)}</span>, pretty=
                        <span className="font-mono"> {String(pretty)}</span>, lines=
                        <span className="font-mono"> {Math.max(1, value.split("\n").length)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Test rapide: active <span className="font-mono">pretty</span> +{" "}
                        <span className="font-mono">format=json</span>, casse le JSON, blur, puis
                        répare-le et blur à nouveau.
                    </div>
                </div>
            )}
        />
    );
}
