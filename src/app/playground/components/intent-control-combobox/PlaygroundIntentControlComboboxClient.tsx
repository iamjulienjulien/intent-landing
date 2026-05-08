"use client";

// src/app/playground/components/intent-control-combobox/PlaygroundIntentControlComboboxClient.tsx
// PlaygroundIntentControlComboboxClient
// - Uses PlaygroundComponentShell to test IntentControlCombobox (real API)
// - Demonstrates standalone + IntentControlField wrapper mode
// - Exercises: filtering (default + custom), keyboard nav, selection, freeSolo, loading/empty, invalid/readOnly/disabled
// - Controlled/uncontrolled: open, inputValue, selectedId
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentControlCombobox,
    IntentControlComboboxIdentity,
    IntentControlComboboxPropsTable,

    // If you exported the type, you can keep it. Otherwise remove.
    // type IntentComboboxFilterFn,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type ControlSize = "xs" | "sm" | "md" | "lg" | "xl";

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

function NumberInput({
    value,
    onChange,
    min,
    max,
}: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
}) {
    return (
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                "px-3 py-2 text-sm opacity-85",
                "focus:outline-none focus:ring-2 focus:ring-white/15"
            )}
        />
    );
}

/* ============================================================================
   🧬 OPTIONS DATA
============================================================================ */

type Option = {
    id: string;
    label: string;
    subtitle?: string;
    group?: "Maisons" | "Lieux" | "Objets" | "Titres";
    tags?: string[];
};

const OPTIONS: Option[] = [
    { id: "winterfell", label: "Winterfell", subtitle: "Nord", group: "Lieux", tags: ["froid"] },
    {
        id: "casterly-rock",
        label: "Casterly Rock",
        subtitle: "Ouest",
        group: "Lieux",
        tags: ["or"],
    },
    {
        id: "dragonstone",
        label: "Dragonstone",
        subtitle: "Mer Étroit",
        group: "Lieux",
        tags: ["feu"],
    },
    {
        id: "kings-landing",
        label: "King’s Landing",
        subtitle: "Couronne",
        group: "Lieux",
        tags: ["politique"],
    },

    {
        id: "stark",
        label: "Maison Stark",
        subtitle: "L’Hiver vient",
        group: "Maisons",
        tags: ["loup"],
    },
    {
        id: "targaryen",
        label: "Maison Targaryen",
        subtitle: "Feu & Sang",
        group: "Maisons",
        tags: ["dragon"],
    },
    {
        id: "lannister",
        label: "Maison Lannister",
        subtitle: "Un Lannister paie ses dettes",
        group: "Maisons",
        tags: ["lion"],
    },
    {
        id: "tyrell",
        label: "Maison Tyrell",
        subtitle: "Grandir fort",
        group: "Maisons",
        tags: ["rose"],
    },

    {
        id: "small-council",
        label: "Petit Conseil",
        subtitle: "Instance de pouvoir",
        group: "Titres",
        tags: ["cour"],
    },
    { id: "hand", label: "Main du Roi", subtitle: "Régent", group: "Titres", tags: ["main"] },
    { id: "maester", label: "Mestre", subtitle: "Savoir", group: "Titres", tags: ["chaîne"] },

    {
        id: "valyrian-steel",
        label: "Acier valyrien",
        subtitle: "Lame rare",
        group: "Objets",
        tags: ["arme"],
    },
    { id: "weirwood", label: "Bois-sacré", subtitle: "Ancien", group: "Objets", tags: ["arbre"] },
    {
        id: "dragonglass",
        label: "Verre-dragon",
        subtitle: "Obsidienne",
        group: "Objets",
        tags: ["nuit"],
    },
];

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlComboboxClient() {
    // Preview mode
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props
    const [size, setSize] = useState<ControlSize>("md");
    const [fullWidth, setFullWidth] = useState(true);
    const [invalid, setInvalid] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [insideField, setInsideField] = useState(true);

    const [placeholder, setPlaceholder] = useState("Choisir une maison, un lieu, un artefact…");

    // UX props
    const [openOnFocus, setOpenOnFocus] = useState(true);
    const [closeOnSelect, setCloseOnSelect] = useState(true);
    const [clearOnSelect, setClearOnSelect] = useState(false);
    const [selectOnBlur, setSelectOnBlur] = useState(false);

    const [minChars, setMinChars] = useState(0);
    const [maxResults, setMaxResults] = useState(12);

    const [allowCustomValue, setAllowCustomValue] = useState(false);
    const [customLabelPrefix, setCustomLabelPrefix] = useState("Créer");

    // Simulated async loading
    const [asyncMode, setAsyncMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // Custom filter toggle
    const [useCustomFilter, setUseCustomFilter] = useState(false);

    // Controlled/uncontrolled toggles
    const [controlOpen, setControlOpen] = useState(false);
    const [controlInput, setControlInput] = useState(true);
    const [controlSelected, setControlSelected] = useState(true);

    // State: open / inputValue / selectedId
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = useMemo(
        () => (selectedId ? (OPTIONS.find((o) => o.id === selectedId) ?? null) : null),
        [selectedId]
    );

    // Field wrapper options
    const [wrapInField, setWrapInField] = useState(true);

    const [fieldLabel, setFieldLabel] = useState("Cible");
    const [fieldHint, setFieldHint] = useState(
        "Tape pour filtrer, ↑/↓ pour naviguer, Entrée pour valider."
    );
    const [fieldError, setFieldError] = useState("Sélection requise");
    const [showError, setShowError] = useState(false);

    const [fieldPadded, setFieldPadded] = useState(true);
    const [fieldCompact, setFieldCompact] = useState(false);
    const [fieldLeading, setFieldLeading] = useState(false);
    const [fieldTrailing, setFieldTrailing] = useState(false);
    const [fieldDirection, setFieldDirection] = useState<"vertical" | "horizontal">("vertical");

    // Intent constraints
    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) setGlow(false);
    }, [aestheticEnabled, glow]);

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

    /* ============================================================================
       🔎 Simulated async loading (based on inputValue)
    ============================================================================ */

    useEffect(() => {
        if (!asyncMode) return;
        const q = inputValue.trim();
        if (!q && minChars > 0) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const t = window.setTimeout(() => setLoading(false), 220);
        return () => window.clearTimeout(t);
    }, [asyncMode, inputValue, minChars]);

    /* ============================================================================
       🧪 Custom filter example (prefix + tags)
    ============================================================================ */

    const filterFn = useMemo(() => {
        if (!useCustomFilter) return undefined;

        return (args: {
            query: string;
            items: Option[];
            getText: (item: Option) => string;
            getKeywords?: (item: Option) => string[] | null | undefined;
        }) => {
            const q = args.query.trim().toLowerCase();
            if (!q) return args.items;

            // Example: startsWith boost + tags search
            const starts: Option[] = [];
            const contains: Option[] = [];

            for (const it of args.items) {
                const label = args.getText(it).toLowerCase();
                const tags = (it.tags ?? []).join(" ").toLowerCase();
                const hay = `${label} ${tags}`;

                if (label.startsWith(q)) starts.push(it);
                else if (hay.includes(q)) contains.push(it);
            }

            return [...starts, ...contains];
        };
    }, [useCustomFilter]);

    /* ============================================================================
       🧾 Code snippet (matches REAL props names)
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const openLine = controlOpen
            ? `      open={open}\n      onOpenChange={setOpen}\n`
            : `      defaultOpen={false}\n`;

        const inputLine = controlInput
            ? `      inputValue={inputValue}\n      onInputValueChange={setInputValue}\n`
            : `      defaultInputValue=""\n`;

        const selectedLine = controlSelected
            ? `      selectedId={selectedId}\n      onSelectionChange={(id) => setSelectedId(id)}\n`
            : `      defaultSelectedId={null}\n`;

        const fieldBlock = wrapInField
            ? `    <IntentControlField
      label="${fieldLabel.replaceAll('"', '\\"')}"
      hint="${fieldHint.replaceAll('"', '\\"')}"
      ${showError ? `error="${fieldError.replaceAll('"', '\\"')}"` : ""}
      padded={${fieldPadded}}
      compact={${fieldCompact}}
      direction="${fieldDirection}"
      leading={${fieldLeading ? "<span aria-hidden>🗡️</span>" : "undefined"}}
      trailing={${fieldTrailing ? "<span aria-hidden>⌘</span>" : "undefined"}}
      ${invalid ? "invalid" : ""}
      ${disabled ? "disabled" : ""}
      intent="${intent}"
      variant="${variant}"
      mode="${previewMode}"
      intensity="${intensity}"
    >
      <IntentControlCombobox
${toneLine}${glowLine}        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
        intensity="${intensity}"
        disabled={${disabled}}
        readOnly={${readOnly}}
        invalid={${invalid}}
        insideField
        size="${size}"
        fullWidth={${fullWidth}}
        placeholder="${placeholder.replaceAll('"', '\\"')}"
        items={items}
        getId={(it) => it.id}
        getText={(it) => it.label}
        getSubtitle={(it) => it.subtitle}
        getKeywords={(it) => it.tags}
        ${useCustomFilter ? "filterFn={filterFn}" : ""}
        minChars={${minChars}}
        maxResults={${maxResults}}
        openOnFocus={${openOnFocus}}
        closeOnSelect={${closeOnSelect}}
        clearOnSelect={${clearOnSelect}}
        selectOnBlur={${selectOnBlur}}
        loading={${asyncMode ? "loading" : "false"}}
        emptyLabel="Aucun résultat"
        loadingLabel="Chargement…"
        allowCustomValue={${allowCustomValue}}
        createOptionLabel={(v) => \`${customLabelPrefix} “\${v}”\`}
${openLine}${inputLine}${selectedLine}      />
    </IntentControlField>`
            : `    <IntentControlCombobox
${toneLine}${glowLine}      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
      intensity="${intensity}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      invalid={${invalid}}
      insideField={false}
      size="${size}"
      fullWidth={${fullWidth}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      items={items}
      getId={(it) => it.id}
      getText={(it) => it.label}
      getSubtitle={(it) => it.subtitle}
      getKeywords={(it) => it.tags}
      ${useCustomFilter ? "filterFn={filterFn}" : ""}
      minChars={${minChars}}
      maxResults={${maxResults}}
      openOnFocus={${openOnFocus}}
      closeOnSelect={${closeOnSelect}}
      clearOnSelect={${clearOnSelect}}
      selectOnBlur={${selectOnBlur}}
      loading={${asyncMode ? "loading" : "false"}}
      emptyLabel="Aucun résultat"
      loadingLabel="Chargement…"
      allowCustomValue={${allowCustomValue}}
      createOptionLabel={(v) => \`${customLabelPrefix} “\${v}”\`}
${openLine}${inputLine}${selectedLine}    />`;

        return `import * as React from "react";
import { IntentControlCombobox, IntentControlField } from "intent-design-system";

type Option = { id: string; label: string; subtitle?: string; tags?: string[] };

const items: Option[] = [
  { id: "stark", label: "Maison Stark", subtitle: "L’Hiver vient", tags: ["loup"] },
  { id: "winterfell", label: "Winterfell", subtitle: "Nord", tags: ["froid"] },
];

export function Example() {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
${fieldBlock}
  );
}`;
    }, [
        wrapInField,
        fieldLabel,
        fieldHint,
        fieldError,
        showError,
        fieldPadded,
        fieldCompact,
        fieldDirection,
        fieldLeading,
        fieldTrailing,

        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,

        readOnly,
        invalid,
        size,
        fullWidth,
        placeholder,

        openOnFocus,
        closeOnSelect,
        clearOnSelect,
        selectOnBlur,

        asyncMode,
        allowCustomValue,
        customLabelPrefix,
        useCustomFilter,

        controlOpen,
        controlInput,
        controlSelected,
        minChars,
        maxResults,
    ]);

    /* ============================================================================
       🧩 Controls split
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
                    options={[
                        ...(aestheticEnabled
                            ? (["aurora", "ember", "cosmic", "mythic", "royal", "mono"] as const)
                            : (["false", "true"] as const)),
                    ]}
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
            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow
                        label="wrapInField"
                        checked={wrapInField}
                        onChange={setWrapInField}
                    />
                    <CheckboxRow
                        label="insideField (naked)"
                        checked={insideField}
                        onChange={setInsideField}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    <span className="font-mono">wrapInField=true</span> démontre l’intégration avec{" "}
                    <span className="font-mono">IntentControlField</span>. En wrapper, le combobox
                    devrait être <span className="font-mono">insideField=true</span>.
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as ControlSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="State (local)">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>

            <SelectRow label="Placeholder">
                <TextInput value={placeholder} onChange={setPlaceholder} />
            </SelectRow>

            <SelectRow label="Controlled modes">
                <div className="space-y-2">
                    <CheckboxRow
                        label="control open"
                        checked={controlOpen}
                        onChange={setControlOpen}
                    />
                    <CheckboxRow
                        label="control inputValue"
                        checked={controlInput}
                        onChange={setControlInput}
                    />
                    <CheckboxRow
                        label="control selectedId"
                        checked={controlSelected}
                        onChange={setControlSelected}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Si un mode est décoché, le composant passe en{" "}
                    <span className="font-mono">default*</span> (uncontrolled) pour ce morceau
                    d’état.
                </div>
            </SelectRow>

            <SelectRow label="InputValue (demo control)">
                <TextInput
                    value={inputValue}
                    onChange={setInputValue}
                    placeholder="Tape ici pour filtrer…"
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Ce champ pilote <span className="font-mono">inputValue</span> (quand control
                    inputValue = true).
                </div>
            </SelectRow>

            <SelectRow label="SelectedId (demo control)">
                <Select
                    value={selectedId ?? ""}
                    onChange={(v) => setSelectedId(v || null)}
                    options={["", ...OPTIONS.map((o) => o.id)]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Sélection actuelle:{" "}
                    <span className="font-mono">{selected?.label ?? "null"}</span>
                </div>
            </SelectRow>

            <SelectRow label="Open (demo control)">
                <div className="space-y-2">
                    <CheckboxRow label="open" checked={open} onChange={setOpen} />
                    <CheckboxRow
                        label="openOnFocus"
                        checked={openOnFocus}
                        onChange={setOpenOnFocus}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Filtering">
                <div className="space-y-2">
                    <CheckboxRow
                        label="use custom filterFn"
                        checked={useCustomFilter}
                        onChange={setUseCustomFilter}
                    />
                    <CheckboxRow
                        label="asyncMode (simulé)"
                        checked={asyncMode}
                        onChange={setAsyncMode}
                    />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">minChars</div>
                        <NumberInput value={minChars} onChange={setMinChars} min={0} max={8} />
                    </div>
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">maxResults</div>
                        <NumberInput value={maxResults} onChange={setMaxResults} min={1} max={40} />
                    </div>
                </div>

                <div className="mt-2 text-[11px] opacity-40">
                    Astuce: en asyncMode, <span className="font-mono">loading</span> dépend du texte
                    tapé.
                </div>
            </SelectRow>

            <SelectRow label="Selection UX">
                <div className="space-y-2">
                    <CheckboxRow
                        label="closeOnSelect"
                        checked={closeOnSelect}
                        onChange={setCloseOnSelect}
                    />
                    <CheckboxRow
                        label="clearOnSelect"
                        checked={clearOnSelect}
                        onChange={setClearOnSelect}
                    />
                    <CheckboxRow
                        label="selectOnBlur"
                        checked={selectOnBlur}
                        onChange={setSelectOnBlur}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Free solo">
                <div className="space-y-2">
                    <CheckboxRow
                        label="allowCustomValue (freeSolo)"
                        checked={allowCustomValue}
                        onChange={setAllowCustomValue}
                    />
                </div>
                <div className="mt-3">
                    <div className="text-[11px] opacity-55 mb-1">createOptionLabel prefix</div>
                    <TextInput value={customLabelPrefix} onChange={setCustomLabelPrefix} />
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
            ) : null}

            <div className="text-[11px] opacity-55">
                Astuce: teste ↑/↓/Home/End/Enter/Escape + blur + click-outside + freeSolo.
            </div>
        </>
    );

    /* ============================================================================
       🧩 Preview
    ============================================================================ */

    const comboboxProps = {
        ...dsInput,
        mode: previewMode,
        size,
        fullWidth,
        invalid,
        readOnly,
        insideField: wrapInField ? true : insideField,

        items: OPTIONS,
        getId: (o: Option) => o.id,
        getText: (o: Option) => o.label,
        getSubtitle: (o: Option) => o.subtitle,
        getKeywords: (o: Option) => o.tags,

        filterFn: useCustomFilter ? (filterFn as any) : undefined,

        minChars,
        maxResults,

        openOnFocus,
        closeOnSelect,
        clearOnSelect,
        selectOnBlur,

        loading: asyncMode ? loading : false,
        loadingLabel: "Chargement…",
        emptyLabel: "Aucun résultat",

        allowCustomValue,
        createOptionLabel: (v: string) => `${customLabelPrefix} “${v}”`,

        onCustomValue: (v: string) => {
            // Demo behavior: set input + selectedId cleared (freeSolo)
            setSelectedId(null);
            setInputValue(v);
        },

        placeholder,
    } as const;

    const comboboxEl = (
        <IntentControlCombobox<Option>
            {...(comboboxProps as any)}
            // Controlled/uncontrolled switches
            {...(controlOpen ? { open, onOpenChange: setOpen } : { defaultOpen: false })}
            {...(controlInput
                ? { inputValue, onInputValueChange: setInputValue }
                : { defaultInputValue: "" })}
            {...(controlSelected
                ? {
                      selectedId,
                      onSelectionChange: (id: string | null) => setSelectedId(id),
                  }
                : { defaultSelectedId: null })}
            // A bit of polish
            name="ids-combobox-demo"
            autoComplete="off"
        />
    );

    const preview = wrapInField ? (
        <IntentControlField
            {...dsInput}
            mode={previewMode}
            label={fieldLabel}
            hint={fieldHint}
            error={showError ? fieldError : undefined}
            padded={fieldPadded}
            compact={fieldCompact}
            direction={fieldDirection}
            leading={fieldLeading ? <span aria-hidden>🗡️</span> : undefined}
            trailing={fieldTrailing ? <span aria-hidden>⌘</span> : undefined}
            invalid={invalid}
            disabled={disabled}
            labelFor="ids-combobox-demo"
        >
            {React.cloneElement(comboboxEl as any, {
                id: "ids-combobox-demo",
                insideField: true,
            })}
        </IntentControlField>
    ) : (
        comboboxEl
    );

    return (
        <PlaygroundComponentShell
            identity={IntentControlComboboxIdentity}
            propsTable={IntentControlComboboxPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            previewExpandable
            renderPreview={() => (
                <div className="w-full min-w-0">
                    <div className="w-full min-w-0">{preview}</div>

                    <div className="mt-3 text-xs opacity-70">
                        open=<span className="font-mono">{String(open)}</span>, inputValue=
                        <span className="font-mono">{JSON.stringify(inputValue)}</span>, selectedId=
                        <span className="font-mono">{JSON.stringify(selectedId)}</span>, loading=
                        <span className="font-mono">{String(asyncMode ? loading : false)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Modes: open=
                        <span className="font-mono">
                            {" "}
                            {String(controlOpen ? "controlled" : "uncontrolled")}
                        </span>
                        {" · "}input=
                        <span className="font-mono">
                            {" "}
                            {String(controlInput ? "controlled" : "uncontrolled")}
                        </span>
                        {" · "}selected=
                        <span className="font-mono">
                            {" "}
                            {String(controlSelected ? "controlled" : "uncontrolled")}
                        </span>
                    </div>
                </div>
            )}
        />
    );
}
