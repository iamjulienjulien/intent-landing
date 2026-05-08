"use client";

// src/app/playground/components/intent-popover/PlaygroundIntentPopoverClient.tsx
// PlaygroundIntentPopoverClient
// - Uses PlaygroundComponentShell to test IntentPopover
// - Covers hover / click / manual
// - Covers side / align / arrow / delays
// - Demonstrates interactive mode
// - Includes code drawer snippet

import React, { useMemo, useState } from "react";

import {
    IntentPopover,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentPopoverIdentity,
    IntentPopoverPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

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
            className="w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm"
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

export default function PlaygroundIntentPopoverClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [intensity, setIntensity] = useState<Intensity>("medium");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    // Local
    const [open, setOpen] = useState(false);
    const [triggerMode, setTriggerMode] = useState<"hover" | "click" | "manual">("hover");
    const [interactive, setInteractive] = useState(false);

    const [side, setSide] = useState<"top" | "bottom" | "left" | "right">("top");
    const [align, setAlign] = useState<"start" | "center" | "end">("center");

    const [offset, setOffset] = useState("10");
    const [showArrow, setShowArrow] = useState(true);

    const dsInput = useMemo(
        () =>
            ({
                intent,
                variant,
                intensity,
                ...(intent === "toned" ? { tone } : {}),
                ...(intent === "glowed"
                    ? { glow: typeof glow === "string" ? glow : "aurora" }
                    : glow === true
                      ? { glow: true }
                      : {}),
            }) as const,
        [intent, variant, intensity, tone, glow]
    );

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const offsetNumber = Number(offset) > 0 ? Number(offset) : 10;

    const codeString = `
import { IntentPopover } from "intent-design-system";

<IntentPopover
  intent="${intent}"
  variant="${variant}"
  intensity="${intensity}"
  triggerMode="${triggerMode}"
  side="${side}"
  align="${align}"
  offset={${offsetNumber}}
  showArrow={${showArrow}}
>
  <button>Hover me</button>
</IntentPopover>
`.trim();

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

            <SelectRow label="Intensity">
                <Select
                    value={intensity}
                    onChange={(v) => setIntensity(v as Intensity)}
                    options={["soft", "medium", "strong"]}
                />
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Trigger mode">
                <Select
                    value={triggerMode}
                    onChange={(v) => setTriggerMode(v as any)}
                    options={["hover", "click", "manual"]}
                />
            </SelectRow>

            <CheckboxRow label="interactive" checked={interactive} onChange={setInteractive} />
            <CheckboxRow label="showArrow" checked={showArrow} onChange={setShowArrow} />

            <SelectRow label="Side">
                <Select
                    value={side}
                    onChange={(v) => setSide(v as any)}
                    options={["top", "bottom", "left", "right"]}
                />
            </SelectRow>

            <SelectRow label="Align">
                <Select
                    value={align}
                    onChange={(v) => setAlign(v as any)}
                    options={["start", "center", "end"]}
                />
            </SelectRow>

            <SelectRow label="Offset">
                <input
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                    className="w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-3 py-2 text-sm"
                />
            </SelectRow>

            {triggerMode === "manual" && (
                <CheckboxRow label="open" checked={open} onChange={setOpen} />
            )}
        </>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentPopoverIdentity}
            propsTable={IntentPopoverPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="flex items-center justify-center py-20">
                    <IntentPopover
                        {...dsInput}
                        mode={mode}
                        open={triggerMode === "manual" ? open : undefined}
                        onOpenChange={setOpen}
                        triggerMode={triggerMode}
                        interactive={interactive}
                        closeOnOutsideClick={false}
                        side={side}
                        align={align}
                        offset={offsetNumber}
                        showArrow={showArrow}
                        header={<div>Popover header</div>}
                        footer={<div className="text-xs opacity-60">Footer slot</div>}
                        content={
                            <div className="space-y-2 text-sm">
                                <div>✨ Intent-driven popover</div>
                                {interactive && (
                                    <button
                                        className="rounded-lg px-2 py-1 bg-black/25 ring-1 ring-white/10"
                                        onClick={() => alert("Clicked inside")}
                                    >
                                        Action
                                    </button>
                                )}
                            </div>
                        }
                        trigger={
                            <button
                                className={cn(
                                    "rounded-xl px-4 py-2 text-sm",
                                    "bg-black/25 ring-1 ring-white/10"
                                )}
                            >
                                Trigger
                            </button>
                        }
                    />
                </div>
            )}
        />
    );
}
