"use client";

// src/app/playground/components/intent-toast/PlaygroundIntentToastClient.tsx
// PlaygroundIntentToastClient
// - Uses PlaygroundComponentShell to test IntentToast
// - Uses DS exports: Identity + PropsTable

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentToast,
    IntentControlButton,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,
    type IntentToastPlacement,

    // ✅ docs exports from DS
    IntentToastIdentity,
    IntentToastPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

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

export default function PlaygroundIntentToastClient() {
    // ✅ preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local controls
    const [placement, setPlacement] = useState<IntentToastPlacement>("top-right");
    const [duration, setDuration] = useState<number>(4000);
    const [dismissible, setDismissible] = useState(true);

    const [withTitle, setWithTitle] = useState(true);
    const [withDescription, setWithDescription] = useState(true);
    const [withIcon, setWithIcon] = useState(true);
    const [withAction, setWithAction] = useState(true);

    // Open state (controlled in playground so the button can reopen it)
    const [open, setOpen] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
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

    const actionNode = useMemo(() => {
        if (!withAction) return undefined;

        return (
            <IntentControlButton
                intent="themed"
                variant="ghost"
                intensity="soft"
                mode={previewMode}
                onClick={() => {
                    // demo action
                    setOpen(false);
                }}
            >
                Undo
            </IntentControlButton>
        );
    }, [withAction, previewMode]);

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
            <SelectRow label="Placement">
                <Select
                    value={placement}
                    onChange={(v) => setPlacement(v as IntentToastPlacement)}
                    options={["top-right", "top-left", "bottom-right", "bottom-left"]}
                />
            </SelectRow>

            <SelectRow label="Duration (ms)">
                <Select
                    value={String(duration)}
                    onChange={(v) => setDuration(Number(v))}
                    options={["0", "1200", "2400", "4000", "8000"]}
                />
                <div className="text-[11px] opacity-45">
                    0 = pas d’auto-dismiss (reste affiché).
                </div>
            </SelectRow>

            <SelectRow label="Options">
                <div className="space-y-2">
                    <CheckboxRow
                        label="dismissible"
                        checked={dismissible}
                        onChange={setDismissible}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="title" checked={withTitle} onChange={setWithTitle} />
                    <CheckboxRow
                        label="description"
                        checked={withDescription}
                        onChange={setWithDescription}
                    />
                    <CheckboxRow label="leftIcon" checked={withIcon} onChange={setWithIcon} />
                    <CheckboxRow label="action" checked={withAction} onChange={setWithAction} />
                </div>
            </SelectRow>

            <SelectRow label="Trigger">
                <IntentControlButton
                    mode={previewMode}
                    intent="empowered"
                    variant="elevated"
                    onClick={() => setOpen(true)}
                >
                    Show toast
                </IntentControlButton>

                <div className="text-[11px] opacity-55">
                    Astuce: change l’intent/variant puis relance le toast.
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

        const titleLine = withTitle ? `    title="Saved"\n` : "";
        const descriptionLine = withDescription
            ? `    description="Your changes have been saved."\n`
            : "";

        const iconLine = withIcon ? `    leftIcon={<span aria-hidden>🔔</span>}\n` : "";

        const actionLine = withAction
            ? `    action={<IntentControlButton intent="themed" variant="ghost">Undo</IntentControlButton>}\n`
            : "";

        const durationLine = `    duration={${duration}}\n`;
        const dismissibleLine = `    dismissible={${dismissible}}\n`;
        const placementLine = `    placement="${placement}"\n`;

        return `import * as React from "react";
import { IntentToast, IntentControlButton } from "intent-design-system";

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IntentControlButton onClick={() => setOpen(true)}>
        Show toast
      </IntentControlButton>

      <IntentToast
        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
        open={open}
        onOpenChange={setOpen}
${titleLine}${descriptionLine}${iconLine}${actionLine}${durationLine}${dismissibleLine}${placementLine}      />
    </>
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        duration,
        dismissible,
        placement,
        withTitle,
        withDescription,
        withIcon,
        withAction,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentToastIdentity}
            propsTable={IntentToastPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    {/* The toast is fixed-position; we just provide a little “stage” copy */}
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
                        <div className="text-xs tracking-[0.18em] opacity-55">Preview stage</div>
                        <div className="mt-2 text-sm opacity-75">
                            Clique sur <span className="font-mono">Show toast</span> (à droite) pour
                            afficher la notification. Elle est positionnée via{" "}
                            <span className="font-mono">placement</span>.
                        </div>
                    </div>

                    <IntentToast
                        {...dsInput}
                        mode={mode}
                        open={open}
                        onOpenChange={setOpen}
                        duration={duration}
                        dismissible={dismissible}
                        placement={placement}
                        title={withTitle ? "Saved" : undefined}
                        description={withDescription ? "Your changes have been saved." : undefined}
                        leftIcon={withIcon ? <span aria-hidden>🔔</span> : undefined}
                        action={actionNode}
                    />
                </div>
            )}
        />
    );
}
