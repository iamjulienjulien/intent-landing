"use client";

// src/app/playground/components/intent-dialog/PlaygroundIntentDialogClient.tsx
// PlaygroundIntentDialogClient
// - Uses PlaygroundComponentShell to test IntentDialog
// - Uses DS exports: Identity + PropsTable
// - Includes sample content + footer + selection log
// - Exercises: sizes, overlay/backdrop, focus trap, scroll lock, preventClose, scrollBehavior

import React, { useMemo, useState } from "react";

import {
    IntentDialog,
    type IntentDialogSize,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentDialogIdentity,
    IntentDialogPropsTable,
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

function NumberInput({
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
            inputMode="numeric"
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

export default function PlaygroundIntentDialogClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local
    const [open, setOpen] = useState(false);

    const [size, setSize] = useState<IntentDialogSize>("md");
    const [overlay, setOverlay] = useState(true);
    const [opaqueBackdrop, setOpaqueBackdrop] = useState(false);
    const [backdropOpacity, setBackdropOpacity] = useState<string>("0.55");

    const [centerY, setCenterY] = useState(true);
    const [padded, setPadded] = useState(true);
    const [scrollBehavior, setScrollBehavior] = useState<"inside" | "body">("inside");

    const [closeOnOverlay, setCloseOnOverlay] = useState(true);
    const [closeOnEscape, setCloseOnEscape] = useState(true);
    const [lockScroll, setLockScroll] = useState(true);
    const [trapFocus, setTrapFocus] = useState(true);
    const [restoreFocus, setRestoreFocus] = useState(true);
    const [preventClose, setPreventClose] = useState(false);

    const [title, setTitle] = useState("🪟 Intent Dialog");
    const [description, setDescription] = useState(
        "Une modal centrée, focus trap, et une aura optionnelle."
    );

    const [maxWidthPx, setMaxWidthPx] = useState<string>(""); // numeric override
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [notes, setNotes] = useState("");

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

    const maxWidthPxNumber = useMemo(() => {
        const raw = maxWidthPx.trim();
        if (!raw) return undefined;
        const n = Number(raw);
        if (!Number.isFinite(n) || n <= 0) return undefined;
        return Math.round(n);
    }, [maxWidthPx]);

    const backdropOpacityNumber = useMemo(() => {
        const raw = backdropOpacity.trim();
        if (!raw) return 0.55;
        const n = Number(raw);
        if (!Number.isFinite(n)) return 0.55;
        return Math.min(0.95, Math.max(0, n));
    }, [backdropOpacity]);

    const footer = useMemo(() => {
        return (
            <div className="flex items-center justify-between text-xs opacity-70">
                <div className="flex items-center gap-2">
                    <span className="font-mono">Esc</span>
                    <span>close</span>
                    <span className="opacity-40">·</span>
                    <span className="font-mono">Tab</span>
                    <span>trap</span>
                </div>
                <div className="opacity-60">
                    size: <span className="font-mono">{size}</span>
                </div>
            </div>
        );
    }, [size]);

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
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <Select
                        value={size}
                        onChange={(v) => setSize(v as IntentDialogSize)}
                        options={["xs", "sm", "md", "lg", "xl"]}
                    />

                    <NumberInput
                        value={maxWidthPx}
                        onChange={setMaxWidthPx}
                        placeholder="maxWidthPx (override) ex: 720"
                    />

                    <div className="space-y-2 pt-2">
                        <CheckboxRow label="centerY" checked={centerY} onChange={setCenterY} />
                        <CheckboxRow label="padded" checked={padded} onChange={setPadded} />
                        <Select
                            value={scrollBehavior}
                            onChange={(v) => setScrollBehavior(v as any)}
                            options={["inside", "body"]}
                        />
                    </div>

                    <div className="space-y-2 pt-2">
                        <CheckboxRow label="overlay" checked={overlay} onChange={setOverlay} />
                        <CheckboxRow
                            label="opaqueBackdrop"
                            checked={opaqueBackdrop}
                            onChange={setOpaqueBackdrop}
                        />
                        <NumberInput
                            value={backdropOpacity}
                            onChange={setBackdropOpacity}
                            placeholder="backdropOpacity ex: 0.55"
                        />
                    </div>
                </div>

                <div className="mt-2 text-[11px] opacity-45">
                    maxWidthPx:{" "}
                    <span className="font-mono">
                        {maxWidthPxNumber ? `${maxWidthPxNumber}px` : "—"}
                    </span>{" "}
                    <span className="opacity-35">·</span> overlayOpacity:{" "}
                    <span className="font-mono">{backdropOpacityNumber.toFixed(2)}</span>
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
                    <CheckboxRow label="lockScroll" checked={lockScroll} onChange={setLockScroll} />
                    <CheckboxRow label="trapFocus" checked={trapFocus} onChange={setTrapFocus} />
                    <CheckboxRow
                        label="restoreFocus"
                        checked={restoreFocus}
                        onChange={setRestoreFocus}
                    />
                    <CheckboxRow
                        label="preventClose"
                        checked={preventClose}
                        onChange={setPreventClose}
                    />
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
                </div>
            </SelectRow>

            <SelectRow label="Action log">
                <div className="rounded-xl bg-black/25 ring-1 ring-white/10 p-3 text-xs">
                    {actionLog.length === 0 ? (
                        <div className="opacity-55">Aucune action pour l’instant.</div>
                    ) : (
                        <ul className="space-y-1">
                            {actionLog.map((s) => (
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

        const maxWLine = maxWidthPxNumber ? `    maxWidthPx={${maxWidthPxNumber}}\n` : "";

        return `import { IntentDialog } from "intent-design-system";

export function Example() {
  return (
    <IntentDialog
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      open={true}
      onOpenChange={() => {}}
      size="${size}"
${maxWLine}      overlay={${overlay}}
      opaqueBackdrop={${opaqueBackdrop}}
      backdropOpacity={${backdropOpacityNumber}}
      centerY={${centerY}}
      padded={${padded}}
      scrollBehavior="${scrollBehavior}"
      closeOnOverlay={${closeOnOverlay}}
      closeOnEscape={${closeOnEscape}}
      lockScroll={${lockScroll}}
      trapFocus={${trapFocus}}
      restoreFocus={${restoreFocus}}
      preventClose={${preventClose}}
      title="${title.replaceAll('"', '\\"')}"
      description="${description.replaceAll('"', '\\"')}"
      footer={<div className="text-xs">Footer</div>}
    >
      <div style={{ padding: 12 }}>Hello dialog ✨</div>
    </IntentDialog>
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        size,
        maxWidthPxNumber,
        overlay,
        opaqueBackdrop,
        backdropOpacityNumber,
        centerY,
        padded,
        scrollBehavior,
        closeOnOverlay,
        closeOnEscape,
        lockScroll,
        trapFocus,
        restoreFocus,
        preventClose,
        title,
        description,
    ]);

    const DialogBody = (
        <div className="space-y-4">
            <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4">
                <div className="text-sm opacity-90">
                    Panel centré: parfait pour confirmations, formulaires courts, détails… 🧿
                </div>

                <div className="mt-2 text-xs opacity-60">
                    opaqueBackdrop:{" "}
                    <span className="font-mono">{opaqueBackdrop ? "true" : "false"}</span>{" "}
                    <span className="opacity-35">·</span> overlayOpacity:{" "}
                    <span className="font-mono">{backdropOpacityNumber.toFixed(2)}</span>
                </div>

                <div className="mt-2 text-xs opacity-60">
                    scrollBehavior: <span className="font-mono">{scrollBehavior}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-xs tracking-[0.18em] opacity-55">Demo controls</div>

                <button
                    type="button"
                    className={cn(
                        "w-full rounded-xl px-3 py-2 text-sm",
                        "bg-black/25 ring-1 ring-white/10",
                        "hover:bg-black/35 transition"
                    )}
                    onClick={() => {
                        const line = `${new Date().toLocaleTimeString()} · Confirm`;
                        setActionLog((prev) => [line, ...prev].slice(0, 8));
                    }}
                >
                    ✅ Confirm (log)
                </button>

                <button
                    type="button"
                    className={cn(
                        "w-full rounded-xl px-3 py-2 text-sm",
                        "bg-black/25 ring-1 ring-white/10",
                        "hover:bg-black/35 transition"
                    )}
                    onClick={() => {
                        const line = `${new Date().toLocaleTimeString()} · Cancel`;
                        setActionLog((prev) => [line, ...prev].slice(0, 8));
                    }}
                >
                    🛑 Cancel (log)
                </button>

                <label className="block">
                    <div className="mb-2 text-xs tracking-[0.18em] opacity-55">Notes</div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className={cn(
                            "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                            "px-3 py-2 text-sm opacity-85",
                            "focus:outline-none focus:ring-2 focus:ring-white/15"
                        )}
                        placeholder="Tape ici…"
                    />
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className={cn(
                            "flex-1 rounded-xl px-3 py-2 text-sm",
                            "bg-black/25 ring-1 ring-white/10",
                            "hover:bg-black/35 transition"
                        )}
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        className={cn(
                            "flex-1 rounded-xl px-3 py-2 text-sm",
                            "bg-black/25 ring-1 ring-white/10",
                            "hover:bg-black/35 transition"
                        )}
                        onClick={() => setActionLog([])}
                    >
                        Clear log
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4 text-xs opacity-70">
                <div className="font-mono opacity-85">Test focus trap</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        className="rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2"
                    >
                        Button A
                    </button>
                    <button
                        type="button"
                        className="rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2"
                    >
                        Button B
                    </button>
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-center"
                    >
                        Link C
                    </a>
                    <input
                        className="rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2"
                        placeholder="Input D"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentDialogIdentity}
            propsTable={IntentDialogPropsTable}
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

                        <div className="text-xs opacity-55">
                            size: <span className="font-mono">{size}</span>{" "}
                            <span className="opacity-40">·</span> maxWidthPx:{" "}
                            <span className="font-mono">
                                {maxWidthPxNumber ? `${maxWidthPxNumber}px` : "—"}
                            </span>{" "}
                            <span className="opacity-40">·</span> overlay:{" "}
                            <span className="font-mono">{overlay ? "true" : "false"}</span>{" "}
                            <span className="opacity-40">·</span> opaqueBackdrop:{" "}
                            <span className="font-mono">{opaqueBackdrop ? "true" : "false"}</span>
                        </div>
                    </div>

                    <IntentDialog
                        {...dsInput}
                        mode={mode}
                        open={open}
                        onOpenChange={(next) => {
                            setActionLog((prev) =>
                                [
                                    `${new Date().toLocaleTimeString()} · open=${next}`,
                                    ...prev,
                                ].slice(0, 8)
                            );
                            setOpen(next);
                        }}
                        size={size}
                        {...(maxWidthPxNumber !== undefined
                            ? { maxWidthPx: maxWidthPxNumber }
                            : {})}
                        overlay={overlay}
                        opaqueBackdrop={opaqueBackdrop}
                        backdropOpacity={backdropOpacityNumber}
                        centerY={centerY}
                        padded={padded}
                        scrollBehavior={scrollBehavior}
                        closeOnOverlay={closeOnOverlay}
                        closeOnEscape={closeOnEscape}
                        lockScroll={lockScroll}
                        trapFocus={trapFocus}
                        restoreFocus={restoreFocus}
                        preventClose={preventClose}
                        title={title}
                        description={description}
                        footer={footer}
                        onBeforeClose={(reason) => {
                            setActionLog((prev) =>
                                [
                                    `${new Date().toLocaleTimeString()} · beforeClose=${reason}`,
                                    ...prev,
                                ].slice(0, 8)
                            );
                            return true;
                        }}
                        onInteractOutside={() => {
                            setActionLog((prev) =>
                                [
                                    `${new Date().toLocaleTimeString()} · interactOutside`,
                                    ...prev,
                                ].slice(0, 8)
                            );
                        }}
                    >
                        {DialogBody}
                    </IntentDialog>
                </div>
            )}
        />
    );
}
