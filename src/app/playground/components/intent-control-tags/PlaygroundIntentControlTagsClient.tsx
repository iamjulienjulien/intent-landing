"use client";

// src/app/playground/components/intent-control-tags/PlaygroundIntentControlTagsClient.tsx
// PlaygroundIntentControlTagsClient
// - Uses PlaygroundComponentShell to test IntentControlTags
// - Demonstrates standalone mode and IntentControlField wrapper mode
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlTags,
    IntentControlField,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,
    type IntentControlTagsAddOn,

    // ✅ docs exports from DS
    IntentControlTagsIdentity,
    IntentControlTagsPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type TagsSize = "xs" | "sm" | "md" | "lg" | "xl";

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

export default function PlaygroundIntentControlTagsClient() {
    // Preview mode (controls tile bg + mode passed to DS)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (Tags)
    const [size, setSize] = useState<TagsSize>("md");
    const [fullWidth, setFullWidth] = useState(true);
    const [insideField, setInsideField] = useState(true);

    const [invalid, setInvalid] = useState(false);

    const [placeholder, setPlaceholder] = useState("Ajouter un tag…");

    const [allowDuplicates, setAllowDuplicates] = useState(false);
    const [removeOnBackspace, setRemoveOnBackspace] = useState(true);

    const [addOnEnter, setAddOnEnter] = useState(true);
    const [addOnComma, setAddOnComma] = useState(true);
    const [addOnBlur, setAddOnBlur] = useState(false);
    const [addOnSpace, setAddOnSpace] = useState(false);

    const [maxItemsEnabled, setMaxItemsEnabled] = useState(false);
    const [maxItems, setMaxItems] = useState(8);

    const [tags, setTags] = useState<string[]>(["Loire", "Bikepacking", "Narration"]);

    // Field wrapper controls
    const [fieldLabel, setFieldLabel] = useState("Tags");
    const [fieldHint, setFieldHint] = useState(
        "Ajoute des mots-clés: Entrée, virgule, collage multi-lignes…"
    );
    const [fieldError, setFieldError] = useState("Trop de tags");
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

    const addOn = useMemo(() => {
        const next: Array<IntentControlTagsAddOn> = [];
        if (addOnEnter) next.push("enter");
        if (addOnComma) next.push("comma");
        if (addOnSpace) next.push("space");
        if (addOnBlur) next.push("blur");
        return next.length ? next : ["enter", "comma"];
    }, [addOnEnter, addOnComma, addOnSpace, addOnBlur]);

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
                    onChange={(v) => setSize(v as TagsSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow
                        label="insideField (wrapped)"
                        checked={insideField}
                        onChange={setInsideField}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    <span className="font-mono">insideField=true</span> suppose que{" "}
                    <span className="font-mono">IntentControlField</span> possède le frame visuel.
                </div>
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

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow
                        label="allowDuplicates"
                        checked={allowDuplicates}
                        onChange={setAllowDuplicates}
                    />
                    <CheckboxRow
                        label="removeOnBackspace"
                        checked={removeOnBackspace}
                        onChange={setRemoveOnBackspace}
                    />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-55">addOn</div>
                    <div className="space-y-2">
                        <CheckboxRow label="enter" checked={addOnEnter} onChange={setAddOnEnter} />
                        <CheckboxRow label="comma" checked={addOnComma} onChange={setAddOnComma} />
                        <CheckboxRow label="space" checked={addOnSpace} onChange={setAddOnSpace} />
                        <CheckboxRow label="blur" checked={addOnBlur} onChange={setAddOnBlur} />
                    </div>
                    <div className="mt-1 text-[11px] opacity-40">
                        Astuce: colle <span className="font-mono">"a, b; c\n d"</span> pour tester
                        le multi-paste.
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <CheckboxRow
                        label="maxItems"
                        checked={maxItemsEnabled}
                        onChange={setMaxItemsEnabled}
                    />
                    {maxItemsEnabled ? (
                        <input
                            type="number"
                            min={1}
                            value={maxItems}
                            onChange={(e) => setMaxItems(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    ) : null}
                </div>
            </SelectRow>

            <SelectRow label="Value (quick set)">
                <Select
                    value={tags.join(" | ")}
                    onChange={(v) => setTags(v ? v.split(" | ") : [])}
                    options={[
                        "Loire | Bikepacking | Narration",
                        "Quête | Chapitre | Progression",
                        "Informed | Empowered | Warned | Threatened",
                        "Game of Thrones | Houses | Dynasties",
                        "",
                    ]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Ce select sert juste à changer rapidement la liste depuis le playground.
                </div>
            </SelectRow>

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
                    <CheckboxRow label="show error" checked={showError} onChange={setShowError} />
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

            <div className="text-[11px] opacity-55">
                Astuce: tape <span className="font-mono">Entrée</span>,{" "}
                <span className="font-mono">,</span>, colle plusieurs valeurs, puis Backspace sur
                draft vide.
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

        const maxItemsLine = maxItemsEnabled ? `      maxItems={${maxItems}}\n` : "";

        const addOnLine = `      addOn={${JSON.stringify(addOn)}}\n`;

        const tagsInit = `const [tags, setTags] = React.useState<string[]>(${JSON.stringify(tags)});`;

        return `import * as React from "react";
import { IntentControlTags, IntentControlField } from "intent-design-system";

export function Example() {
  ${tagsInit}

  return (
${
    insideField
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
      <IntentControlTags
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      insideField
      invalid={${invalid}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      allowDuplicates={${allowDuplicates}}
      removeOnBackspace={${removeOnBackspace}}
${addOnLine}${maxItemsLine}      value={tags}
      onValueChange={setTags}
    />
    </IntentControlField>`
        : `    <IntentControlTags
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      allowDuplicates={${allowDuplicates}}
      removeOnBackspace={${removeOnBackspace}}
${addOnLine}${maxItemsLine}      value={tags}
      onValueChange={setTags}
    />`
}
  );
}`;
    }, [
        insideField,
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
        allowDuplicates,
        removeOnBackspace,
        addOn,
        maxItemsEnabled,
        maxItems,
        tags,
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
        const control = (
            <IntentControlTags
                {...dsInput}
                mode={previewMode}
                size={size}
                fullWidth={fullWidth}
                insideField={insideField}
                invalid={invalid}
                placeholder={placeholder}
                allowDuplicates={allowDuplicates}
                addOn={addOn as IntentControlTagsAddOn[]}
                removeOnBackspace={removeOnBackspace}
                maxItems={maxItemsEnabled ? maxItems : undefined}
                value={tags}
                onValueChange={setTags}
            />
        );

        if (!insideField) return control;

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
            >
                {control}
            </IntentControlField>
        );
    }, [
        dsInput,
        previewMode,
        size,
        fullWidth,
        insideField,
        invalid,
        placeholder,
        allowDuplicates,
        addOn,
        removeOnBackspace,
        maxItemsEnabled,
        maxItems,
        tags,
        fieldLabel,
        fieldHint,
        fieldError,
        showError,
        fieldPadded,
        fieldCompact,
        fieldDirection,
        fieldLeading,
        fieldTrailing,
        disabled,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlTagsIdentity}
            propsTable={IntentControlTagsPropsTable}
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
                        insideField=<span className="font-mono">{String(insideField)}</span>, size=
                        <span className="font-mono"> {size}</span>, tags=
                        <span className="font-mono"> {tags.length}</span>, addOn=
                        <span className="font-mono"> {JSON.stringify(addOn)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Test rapide: colle{" "}
                        <span className="font-mono">"alpha, beta; gamma\n delta"</span> puis
                        supprime avec Backspace (draft vide).
                    </div>
                </div>
            )}
        />
    );
}
