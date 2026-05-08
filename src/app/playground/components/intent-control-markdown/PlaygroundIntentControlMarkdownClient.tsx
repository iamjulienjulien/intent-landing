"use client";

// src/app/playground/components/intent-control-markdown/PlaygroundIntentControlMarkdownClient.tsx
// PlaygroundIntentControlMarkdownClient
// - Uses PlaygroundComponentShell to test IntentControlMarkdown
// - Demonstrates standalone mode and IntentControlField wrapper mode
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlMarkdown,
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlMarkdownIdentity,
    IntentControlMarkdownPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type MdSize = "xs" | "sm" | "md" | "lg" | "xl";
type MdView = "edit" | "preview" | "split";

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

/** Tiny “preview renderer” without deps: escape + minimal formatting */
function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

const DEFAULT_MD = `# IntentControlMarkdown

Un éditeur Markdown “intent-first”.

## Raccourcis
- **Cmd/Ctrl + B**: gras
- **Cmd/Ctrl + I**: italique
- **Cmd/Ctrl + K**: lien
- **Tab / Shift+Tab**: indent / unindent

> La Loire a des reflets qui ressemblent à des promesses.

\`\`\`ts
type Intent = "informed" | "empowered" | "warned" | "threatened";
\`\`\`
`;

export default function PlaygroundIntentControlMarkdownClient() {
    // Preview mode (controls tile bg + mode passed to DS)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props (Markdown)
    const [size, setSize] = useState<MdSize>("md");
    const [fullWidth, setFullWidth] = useState(true);
    const [insideField, setInsideField] = useState(true);

    const [invalid, setInvalid] = useState(false);

    const [hideToolbar, setHideToolbar] = useState(false);

    const [view, setView] = useState<MdView>("split");
    const [placeholder, setPlaceholder] = useState("Écris en Markdown…");

    const [minRows, setMinRows] = useState(10);
    const [maxRows, setMaxRows] = useState(24);

    const [md, setMd] = useState(DEFAULT_MD);

    // Field wrapper controls
    const [fieldLabel, setFieldLabel] = useState("Markdown");
    const [fieldHint, setFieldHint] = useState("Écris, puis bascule en preview ou split.");
    const [fieldError, setFieldError] = useState("Contenu invalide");
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
            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as MdSize)}
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

            <SelectRow label="View">
                <Select
                    value={view}
                    onChange={(v) => setView(v as MdView)}
                    options={["edit", "preview", "split"]}
                />
            </SelectRow>

            <SelectRow label="Toolbar">
                <div className="space-y-2">
                    <CheckboxRow
                        label="hideToolbar"
                        checked={hideToolbar}
                        onChange={setHideToolbar}
                    />
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

            <SelectRow label="Rows">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">minRows</div>
                        <input
                            type="number"
                            min={2}
                            value={minRows}
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
                            min={4}
                            value={maxRows}
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

            <SelectRow label="Value (quick set)">
                <Select
                    value={
                        md.startsWith("# IntentControlMarkdown")
                            ? "demo"
                            : md.trim()
                              ? "custom"
                              : "empty"
                    }
                    onChange={(v) => {
                        if (v === "demo") setMd(DEFAULT_MD);
                        if (v === "empty") setMd("");
                        if (v === "custom")
                            setMd("## Titre\n\n- Un\n- Deux\n\n**Gras** _italique_ `code`\n");
                    }}
                    options={["demo", "custom", "empty"]}
                />
                <div className="mt-2 text-[11px] opacity-40">
                    Astuce: teste <span className="font-mono">Cmd/Ctrl+B</span>,{" "}
                    <span className="font-mono">Cmd/Ctrl+I</span>,{" "}
                    <span className="font-mono">Cmd/Ctrl+K</span>, Tab / Shift+Tab.
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

        const mdInit = `const [md, setMd] = React.useState(${JSON.stringify(md)});`;

        const previewRenderer = `renderPreview={(markdown) => <pre style={{ whiteSpace: "pre-wrap" }}>{markdown}</pre>}`;

        return `import * as React from "react";
import { IntentControlMarkdown, IntentControlField } from "intent-design-system";

export function Example() {
  ${mdInit}

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
      <IntentControlMarkdown
        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
        disabled={${disabled}}
        size="${size}"
        fullWidth={${fullWidth}}
        insideField
        invalid={${invalid}}
        hideToolbar={${hideToolbar}}
        view="${view}"
        placeholder="${placeholder.replaceAll('"', '\\"')}"
        minRows={${minRows}}
        maxRows={${maxRows}}
        value={md}
        onValueChange={setMd}
        ${previewRenderer}
      />
    </IntentControlField>`
        : `    <IntentControlMarkdown
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      hideToolbar={${hideToolbar}}
      view="${view}"
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      minRows={${minRows}}
      maxRows={${maxRows}}
      value={md}
      onValueChange={setMd}
      ${previewRenderer}
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
        hideToolbar,
        view,
        placeholder,
        minRows,
        maxRows,
        md,
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
            <IntentControlMarkdown
                {...dsInput}
                mode={previewMode}
                size={size}
                fullWidth={fullWidth}
                insideField={insideField}
                invalid={invalid}
                hideToolbar={hideToolbar}
                view={view}
                placeholder={placeholder}
                minRows={minRows}
                maxRows={maxRows}
                value={md}
                onValueChange={setMd}
                renderPreview={(markdown) => (
                    <div
                        className={cn(
                            "text-sm leading-relaxed opacity-90",
                            "prose prose-invert max-w-none"
                        )}
                        // keep it safe (escape) while still readable
                        dangerouslySetInnerHTML={{
                            __html: `<pre style="white-space:pre-wrap;margin:0;">${escapeHtml(markdown || " ")}</pre>`,
                        }}
                    />
                )}
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
        hideToolbar,
        view,
        placeholder,
        minRows,
        maxRows,
        md,
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
            identity={IntentControlMarkdownIdentity}
            propsTable={IntentControlMarkdownPropsTable}
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
                        insideField=<span className="font-mono">{String(insideField)}</span>, view=
                        <span className="font-mono"> {view}</span>, chars=
                        <span className="font-mono"> {md.length}</span>, rows=
                        <span className="font-mono">
                            {" "}
                            {minRows}–{maxRows}
                        </span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Raccourcis: <span className="font-mono">Cmd/Ctrl+B</span>,{" "}
                        <span className="font-mono">Cmd/Ctrl+I</span>,{" "}
                        <span className="font-mono">Cmd/Ctrl+K</span>,{" "}
                        <span className="font-mono">Tab</span>/
                        <span className="font-mono">Shift+Tab</span>.
                    </div>
                </div>
            )}
        />
    );
}
