"use client";

// src/app/playground/components/intent-control-files/PlaygroundIntentControlFilesClient.tsx
// PlaygroundIntentControlFilesClient
// - Uses PlaygroundComponentShell to test IntentControlFiles
// - Demonstrates standalone + IntentControlField wrapper
// - Covers single / multiple / drag&drop / clear / removable / validation
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlFiles,
    IntentControlField,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // docs exports
    IntentControlFilesIdentity,
    IntentControlFilesPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type FilesSize = "xs" | "sm" | "md" | "lg" | "xl";

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
    placeholder,
    min,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    min?: number;
}) {
    return (
        <input
            type="number"
            min={min}
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

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(gb >= 100 ? 0 : 1)} GB`;
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlFilesClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local props
    const [size, setSize] = useState<FilesSize>("md");
    const [fullWidth, setFullWidth] = useState(true);

    const [wrapInField, setWrapInField] = useState(true);
    const insideField = wrapInField;

    const [invalid, setInvalid] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    const [multiple, setMultiple] = useState(true);
    const [dragAndDrop, setDragAndDrop] = useState(true);
    const [clearable, setClearable] = useState(true);
    const [removable, setRemovable] = useState(true);
    const [showFileList, setShowFileList] = useState(true);
    const [showFileSize, setShowFileSize] = useState(true);

    const [accept, setAccept] = useState("image/*,.pdf");
    const [placeholder, setPlaceholder] = useState(
        "Dépose tes fichiers ici ou clique pour parcourir…"
    );
    const [browseLabel, setBrowseLabel] = useState("Parcourir");
    const [helperText, setHelperText] = useState(
        "Images, PDF… idéal pour tester le drag & drop et le clear."
    );

    const [maxFilesEnabled, setMaxFilesEnabled] = useState(false);
    const [maxFiles, setMaxFiles] = useState("3");

    const [maxFileSizeEnabled, setMaxFileSizeEnabled] = useState(false);
    const [maxFileSizeMb, setMaxFileSizeMb] = useState("5");

    const [withLeading, setWithLeading] = useState(false);
    const [withTrailing, setWithTrailing] = useState(false);

    // Field wrapper
    const [fieldLabel, setFieldLabel] = useState("Pièces jointes");
    const [fieldHint, setFieldHint] = useState("Ajoute les fichiers nécessaires à cette étape.");
    const [fieldError, setFieldError] = useState("Ajoute au moins un document valide.");
    const [showError, setShowError] = useState(false);
    const [fieldPadded, setFieldPadded] = useState(true);
    const [fieldCompact, setFieldCompact] = useState(false);
    const [fieldLeading, setFieldLeading] = useState(false);
    const [fieldTrailing, setFieldTrailing] = useState(false);
    const [fieldDirection, setFieldDirection] = useState<"vertical" | "horizontal">("vertical");

    // Runtime state
    const [files, setFiles] = useState<File[]>([]);
    const [log, setLog] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!multiple && files.length > 1) {
            setFiles((prev) => prev.slice(0, 1));
        }
    }, [multiple, files.length]);

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

    const maxFilesNumber = useMemo(() => {
        if (!maxFilesEnabled) return undefined;
        const n = Number(maxFiles);
        if (!Number.isFinite(n) || n <= 0) return undefined;
        return Math.round(n);
    }, [maxFilesEnabled, maxFiles]);

    const maxFileSizeBytes = useMemo(() => {
        if (!maxFileSizeEnabled) return undefined;
        const n = Number(maxFileSizeMb);
        if (!Number.isFinite(n) || n <= 0) return undefined;
        return Math.round(n * 1024 * 1024);
    }, [maxFileSizeEnabled, maxFileSizeMb]);

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
            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow
                        label="wrapInField"
                        checked={wrapInField}
                        onChange={setWrapInField}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as FilesSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="invalid" checked={invalid} onChange={setInvalid} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="multiple" checked={multiple} onChange={setMultiple} />
                    <CheckboxRow
                        label="dragAndDrop"
                        checked={dragAndDrop}
                        onChange={setDragAndDrop}
                    />
                    <CheckboxRow label="clearable" checked={clearable} onChange={setClearable} />
                    <CheckboxRow label="removable" checked={removable} onChange={setRemovable} />
                    <CheckboxRow
                        label="showFileList"
                        checked={showFileList}
                        onChange={setShowFileList}
                    />
                    <CheckboxRow
                        label="showFileSize"
                        checked={showFileSize}
                        onChange={setShowFileSize}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Copy">
                <div className="space-y-2">
                    <TextInput
                        value={placeholder}
                        onChange={setPlaceholder}
                        placeholder="placeholder"
                    />
                    <TextInput
                        value={browseLabel}
                        onChange={setBrowseLabel}
                        placeholder="browseLabel"
                    />
                    <TextInput
                        value={helperText}
                        onChange={setHelperText}
                        placeholder="helperText"
                    />
                    <TextInput
                        value={accept}
                        onChange={setAccept}
                        placeholder="accept ex: image/*,.pdf"
                    />
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
                        <TextInput
                            value={fieldLabel}
                            onChange={setFieldLabel}
                            placeholder="field.label"
                        />
                        <TextInput
                            value={fieldHint}
                            onChange={setFieldHint}
                            placeholder="field.hint"
                        />
                        <TextInput
                            value={fieldError}
                            onChange={setFieldError}
                            placeholder="field.error"
                        />
                        <Select
                            value={fieldDirection}
                            onChange={(v) => setFieldDirection(v as "vertical" | "horizontal")}
                            options={["vertical", "horizontal"]}
                        />
                    </div>
                </SelectRow>
            )}

            <SelectRow label="Validation">
                <div className="space-y-2">
                    <CheckboxRow
                        label="maxFiles enabled"
                        checked={maxFilesEnabled}
                        onChange={setMaxFilesEnabled}
                    />
                    <CheckboxRow
                        label="maxFileSize enabled"
                        checked={maxFileSizeEnabled}
                        onChange={setMaxFileSizeEnabled}
                    />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <NumberInput
                        value={maxFiles}
                        onChange={setMaxFiles}
                        placeholder="maxFiles"
                        min={1}
                    />
                    <NumberInput
                        value={maxFileSizeMb}
                        onChange={setMaxFileSizeMb}
                        placeholder="maxFileSize MB"
                        min={1}
                    />
                </div>

                <div className="mt-2 text-[11px] opacity-45">
                    maxFiles:{" "}
                    <span className="font-mono">
                        {maxFilesNumber !== undefined ? maxFilesNumber : "—"}
                    </span>{" "}
                    <span className="opacity-40">·</span> maxFileSize:{" "}
                    <span className="font-mono">
                        {maxFileSizeBytes !== undefined ? formatBytes(maxFileSizeBytes) : "—"}
                    </span>
                </div>
            </SelectRow>

            <SelectRow label="Debug">
                <div className="rounded-xl bg-black/25 ring-1 ring-white/10 p-3 text-xs space-y-2">
                    <div>
                        files:{" "}
                        <span className="font-mono">
                            {files.length === 0 ? "[]" : `[${files.map((f) => f.name).join(", ")}]`}
                        </span>
                    </div>

                    <div>
                        validationErrors:{" "}
                        <span className="font-mono">
                            {validationErrors.length === 0
                                ? "[]"
                                : `${validationErrors.length} error(s)`}
                        </span>
                    </div>

                    {log.length > 0 ? (
                        <ul className="space-y-1 pt-2">
                            {log.map((item) => (
                                <li key={item} className="opacity-75">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="opacity-55">Aucune action pour l’instant.</div>
                    )}
                </div>
            </SelectRow>
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

        const leadingLine =
            !wrapInField && withLeading ? `      leading={<span aria-hidden>📎</span>}\n` : "";
        const trailingLine =
            !wrapInField && withTrailing ? `      trailing={<span aria-hidden>☁️</span>}\n` : "";

        const maxFilesLine =
            maxFilesNumber !== undefined ? `      maxFiles={${maxFilesNumber}}\n` : "";

        const maxFileSizeLine =
            maxFileSizeBytes !== undefined ? `      maxFileSizeBytes={${maxFileSizeBytes}}\n` : "";

        const filesBlock = `import * as React from "react";
import { IntentControlFiles, IntentControlField } from "intent-design-system";

export function Example() {
  const [files, setFiles] = React.useState<File[]>([]);

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
      leading={${fieldLeading ? "<span aria-hidden>📎</span>" : "undefined"}}
      trailing={${fieldTrailing ? "<span aria-hidden>☁️</span>" : "undefined"}}
      ${invalid ? "invalid" : ""}
      ${disabled ? "disabled" : ""}
      intent="${intent}"
      variant="${variant}"
      mode="${previewMode}"
      intensity="${intensity}"
    >
      <IntentControlFiles
        files={files}
        onFilesChange={setFiles}
        insideField
        placeholder="${placeholder.replaceAll('"', '\\"')}"
        browseLabel="${browseLabel.replaceAll('"', '\\"')}"
        helperText="${helperText.replaceAll('"', '\\"')}"
        accept="${accept.replaceAll('"', '\\"')}"
        size="${size}"
        fullWidth={${fullWidth}}
        invalid={${invalid}}
        readOnly={${readOnly}}
        multiple={${multiple}}
        dragAndDrop={${dragAndDrop}}
        clearable={${clearable}}
        removable={${removable}}
        showFileList={${showFileList}}
        showFileSize={${showFileSize}}
${maxFilesLine}${maxFileSizeLine}        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
      />
    </IntentControlField>`
        : `    <IntentControlFiles
      files={files}
      onFilesChange={setFiles}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      browseLabel="${browseLabel.replaceAll('"', '\\"')}"
      helperText="${helperText.replaceAll('"', '\\"')}"
      accept="${accept.replaceAll('"', '\\"')}"
      size="${size}"
      fullWidth={${fullWidth}}
      invalid={${invalid}}
      readOnly={${readOnly}}
      multiple={${multiple}}
      dragAndDrop={${dragAndDrop}}
      clearable={${clearable}}
      removable={${removable}}
      showFileList={${showFileList}}
      showFileSize={${showFileSize}}
${leadingLine}${trailingLine}${maxFilesLine}${maxFileSizeLine}      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
    />`
}
  );
}`;

        return filesBlock;
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
        invalid,
        disabled,
        previewMode,
        intent,
        variant,
        intensity,
        tone,
        glow,
        placeholder,
        browseLabel,
        helperText,
        accept,
        size,
        fullWidth,
        readOnly,
        multiple,
        dragAndDrop,
        clearable,
        removable,
        showFileList,
        showFileSize,
        withLeading,
        withTrailing,
        maxFilesNumber,
        maxFileSizeBytes,
    ]);

    const preview = useMemo(() => {
        const fileEl = (
            <IntentControlFiles
                {...dsInput}
                mode={previewMode}
                files={files}
                onFilesChange={(nextFiles, meta) => {
                    setFiles(nextFiles);
                    setValidationErrors(meta.errors.map((e) => e.message));

                    const stamp = new Date().toLocaleTimeString();
                    const line = `${stamp} · ${meta.source} · +${meta.added.length} / -${meta.removed.length} / ${nextFiles.length} total`;
                    setLog((prev) => [line, ...prev].slice(0, 8));
                }}
                onValidationError={(errors, meta) => {
                    setValidationErrors(errors.map((e) => `${meta.source}: ${e.message}`));
                }}
                size={size}
                fullWidth={fullWidth}
                invalid={invalid}
                readOnly={readOnly}
                insideField={insideField}
                multiple={multiple}
                dragAndDrop={dragAndDrop}
                clearable={clearable}
                removable={removable}
                showFileList={showFileList}
                showFileSize={showFileSize}
                accept={accept}
                placeholder={placeholder}
                browseLabel={browseLabel}
                helperText={helperText}
                leading={!wrapInField && withLeading ? <span aria-hidden>📎</span> : undefined}
                trailing={!wrapInField && withTrailing ? <span aria-hidden>☁️</span> : undefined}
                {...(maxFilesNumber !== undefined ? { maxFiles: maxFilesNumber } : {})}
                {...(maxFileSizeBytes !== undefined ? { maxFileSizeBytes } : {})}
            />
        );

        if (!wrapInField) return fileEl;

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
                leading={fieldLeading ? <span aria-hidden>📎</span> : undefined}
                trailing={fieldTrailing ? <span aria-hidden>☁️</span> : undefined}
                invalid={invalid}
                disabled={disabled}
            >
                {React.cloneElement(fileEl as React.ReactElement<any>, {
                    insideField: true,
                    leading: undefined,
                    trailing: undefined,
                })}
            </IntentControlField>
        );
    }, [
        dsInput,
        previewMode,
        files,
        size,
        fullWidth,
        invalid,
        readOnly,
        insideField,
        multiple,
        dragAndDrop,
        clearable,
        removable,
        showFileList,
        showFileSize,
        accept,
        placeholder,
        browseLabel,
        helperText,
        wrapInField,
        withLeading,
        withTrailing,
        maxFilesNumber,
        maxFileSizeBytes,
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
            identity={IntentControlFilesIdentity}
            propsTable={IntentControlFilesPropsTable}
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
                        wrapInField=<span className="font-mono">{String(wrapInField)}</span>,
                        multiple=<span className="font-mono"> {String(multiple)}</span>, files=
                        <span className="font-mono"> {files.length}</span>, size=
                        <span className="font-mono"> {size}</span>, invalid=
                        <span className="font-mono"> {String(invalid)}</span>
                    </div>

                    <div className="mt-2 text-[11px] opacity-55">
                        Astuce: teste le glisser-déposer, puis active{" "}
                        <span className="font-mono">maxFiles</span> ou{" "}
                        <span className="font-mono">maxFileSize</span> pour voir les validations.
                    </div>

                    {validationErrors.length > 0 ? (
                        <div className="mt-3 rounded-xl bg-black/25 ring-1 ring-white/10 p-3 text-xs">
                            <div className="mb-2 opacity-60">Validation errors</div>
                            <ul className="space-y-1">
                                {validationErrors.map((msg) => (
                                    <li key={msg} className="opacity-80">
                                        {msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            )}
        />
    );
}
