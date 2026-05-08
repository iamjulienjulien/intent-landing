"use client";

// src/app/playground/components/intent-confirm-dialog/PlaygroundIntentConfirmDialogClient.tsx
// PlaygroundIntentConfirmDialogClient
// - Uses PlaygroundComponentShell to test IntentConfirmDialog
// - Uses DS exports: Identity + PropsTable
// - Includes action log + various behaviors toggles

import React, { useMemo, useState } from "react";

import {
    IntentConfirmDialog,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentConfirmDialogIdentity,
    IntentConfirmDialogPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

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

export default function PlaygroundIntentConfirmDialogClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS
    const [intent, setIntent] = useState<Intent>("warned");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("amber");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local controls
    const [open, setOpen] = useState(false);

    const [closeOnOverlay, setCloseOnOverlay] = useState(true);
    const [closeOnEscape, setCloseOnEscape] = useState(true);
    const [confirmOnEnter, setConfirmOnEnter] = useState(true);
    const [dismissible, setDismissible] = useState(true);

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("Supprimer cet élément ?");
    const [description, setDescription] = useState(
        "Cette action est définitive. Le contenu sera retiré de l’Atlas et des Carnets."
    );
    const [confirmLabel, setConfirmLabel] = useState("Oui, supprimer");
    const [cancelLabel, setCancelLabel] = useState("Annuler");

    const [useIcon, setUseIcon] = useState(true);

    const [log, setLog] = useState<string[]>([]);

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

    function stamp(label: string) {
        const line = `${new Date().toLocaleTimeString()} · ${label}`;
        setLog((prev) => [line, ...prev].slice(0, 10));
    }

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
                    options={
                        aestheticEnabled
                            ? ["aurora", "ember", "cosmic", "mythic", "royal", "mono"]
                            : ["false", "true"]
                    }
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
            <SelectRow label="Open">
                <div className="space-y-2">
                    <CheckboxRow label="open" checked={open} onChange={setOpen} />
                </div>
                <div className="mt-2 text-[11px] opacity-45">
                    Astuce: Enter confirme (si activé), Esc annule, Tab reste dans le panel.
                </div>
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow
                        label="closeOnOverlay"
                        checked={closeOnOverlay}
                        onChange={setCloseOnOverlay}
                    />
                    <CheckboxRow
                        label="closeOnEscape"
                        checked={closeOnEscape}
                        onChange={setCloseOnEscape}
                    />
                    <CheckboxRow
                        label="confirmOnEnter"
                        checked={confirmOnEnter}
                        onChange={setConfirmOnEnter}
                    />
                    <CheckboxRow
                        label="dismissible"
                        checked={dismissible}
                        onChange={setDismissible}
                    />
                </div>
            </SelectRow>

            <SelectRow label="State (local)">
                <div className="space-y-2">
                    <CheckboxRow label="loading" checked={loading} onChange={setLoading} />
                    <CheckboxRow label="useIcon" checked={useIcon} onChange={setUseIcon} />
                </div>
            </SelectRow>

            <SelectRow label="Copy">
                <div className="space-y-2">
                    <TextInput value={title} onChange={setTitle} placeholder="title" />
                    <TextInput
                        value={description}
                        onChange={setDescription}
                        placeholder="description"
                    />
                    <TextInput
                        value={confirmLabel as string}
                        onChange={(v) => setConfirmLabel(v)}
                        placeholder="confirmLabel"
                    />
                    <TextInput
                        value={cancelLabel as string}
                        onChange={(v) => setCancelLabel(v)}
                        placeholder="cancelLabel"
                    />
                </div>
            </SelectRow>

            <SelectRow label="Action log">
                <div className="rounded-xl bg-black/25 ring-1 ring-white/10 p-3 text-xs">
                    {log.length === 0 ? (
                        <div className="opacity-55">Aucune action pour l’instant.</div>
                    ) : (
                        <ul className="space-y-1">
                            {log.map((s) => (
                                <li key={s} className="opacity-75">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </SelectRow>
        </>
    );

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        return `import { IntentConfirmDialog } from "intent-design-system";

export function Example() {
  return (
    <IntentConfirmDialog
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      open={${open}}
      onOpenChange={() => {}}
      title="${title.replaceAll('"', '\\"')}"
      description="${description.replaceAll('"', '\\"')}"
      confirmLabel="${String(confirmLabel).replaceAll('"', '\\"')}"
      cancelLabel="${String(cancelLabel).replaceAll('"', '\\"')}"
      closeOnOverlay={${closeOnOverlay}}
      closeOnEscape={${closeOnEscape}}
      confirmOnEnter={${confirmOnEnter}}
      dismissible={${dismissible}}
      loading={${loading}}
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        open,
        title,
        description,
        confirmLabel,
        cancelLabel,
        closeOnOverlay,
        closeOnEscape,
        confirmOnEnter,
        dismissible,
        loading,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentConfirmDialogIdentity}
            propsTable={IntentConfirmDialogPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className={cn(
                                "rounded-xl px-3 py-2 text-sm",
                                "bg-black/25 ring-1 ring-white/10",
                                "hover:bg-black/35 transition"
                            )}
                            onClick={() => setOpen(true)}
                        >
                            Open dialog
                        </button>

                        <button
                            type="button"
                            className={cn(
                                "rounded-xl px-3 py-2 text-sm",
                                "bg-black/25 ring-1 ring-white/10",
                                "hover:bg-black/35 transition"
                            )}
                            onClick={() => {
                                setOpen(true);
                                setLoading(true);
                                stamp("Opened (loading=true)");
                            }}
                        >
                            Open (loading)
                        </button>

                        <div className="text-xs opacity-55">
                            Raccourcis: <span className="font-mono">Enter</span> ·{" "}
                            <span className="font-mono">Esc</span> ·{" "}
                            <span className="font-mono">Tab</span>
                        </div>
                    </div>

                    <IntentConfirmDialog
                        {...dsInput}
                        mode={mode}
                        open={open}
                        onOpenChange={(v) => {
                            setOpen(v);
                            stamp(v ? "Open" : "Close (onOpenChange)");
                        }}
                        title={title}
                        description={description}
                        icon={useIcon ? <span aria-hidden>⚠</span> : undefined}
                        confirmLabel={confirmLabel}
                        cancelLabel={cancelLabel}
                        closeOnOverlay={closeOnOverlay}
                        closeOnEscape={closeOnEscape}
                        confirmOnEnter={confirmOnEnter}
                        dismissible={dismissible}
                        loading={loading}
                        onConfirm={() => stamp("Confirm")}
                        onCancel={() => stamp("Cancel")}
                    />
                </div>
            )}
        />
    );
}
