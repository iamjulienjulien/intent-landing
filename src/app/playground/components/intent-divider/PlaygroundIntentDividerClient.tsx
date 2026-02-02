"use client";

// src/app/playground/components/intent-divider/PlaygroundIntentDividerClient.tsx
// PlaygroundIntentDividerClient
// - Uses PlaygroundComponentShell to test IntentDivider
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentDivider,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentDividerIdentity,
    IntentDividerPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type DividerOrientation = "horizontal" | "vertical";
type DividerThickness = "hairline" | "thin" | "medium";
type DividerAlign = "left" | "center" | "right";
type DividerGap = "xs" | "sm" | "md";
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

export default function PlaygroundIntentDividerClient() {
    // ✅ NEW: preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("flat");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [orientation, setOrientation] = useState<DividerOrientation>("horizontal");
    const [thickness, setThickness] = useState<DividerThickness>("hairline");
    const [fullWidth, setFullWidth] = useState(true);

    const [withLabel, setWithLabel] = useState(true);
    const [align, setAlign] = useState<DividerAlign>("center");
    const [gap, setGap] = useState<DividerGap>("sm");

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

    const label = withLabel && orientation === "horizontal" ? "Section" : undefined;

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const dsControls = (
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

    const extraControls = (
        <>
            <SelectRow label="Orientation">
                <Select
                    value={orientation}
                    onChange={(v) => setOrientation(v as DividerOrientation)}
                    options={["horizontal", "vertical"]}
                />
            </SelectRow>

            <SelectRow label="Thickness">
                <Select
                    value={thickness}
                    onChange={(v) => setThickness(v as DividerThickness)}
                    options={["hairline", "thin", "medium"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="Label">
                <div className="space-y-2">
                    <CheckboxRow label="with label" checked={withLabel} onChange={setWithLabel} />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Le label est rendu uniquement en <span className="font-mono">horizontal</span>.
                </div>
            </SelectRow>

            {withLabel && orientation === "horizontal" ? (
                <>
                    <SelectRow label="Align">
                        <Select
                            value={align}
                            onChange={(v) => setAlign(v as DividerAlign)}
                            options={["left", "center", "right"]}
                        />
                    </SelectRow>

                    <SelectRow label="Gap">
                        <Select
                            value={gap}
                            onChange={(v) => setGap(v as DividerGap)}
                            options={["xs", "sm", "md"]}
                        />
                    </SelectRow>
                </>
            ) : null}

            {/* ✅ moved from Preview card */}
            <div className="text-[11px] opacity-55">
                Astuce: en <span className="font-mono">vertical</span>, le label est ignoré (simple
                rule).
            </div>
        </>
    );

    // ✅ Code panel: real TSX snippet (copy/paste-ready)
    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const labelLine = label ? `      label="${label}"\n` : "";

        const alignLine =
            withLabel && orientation === "horizontal" ? `      align="${align}"\n` : "";

        const gapLine = withLabel && orientation === "horizontal" ? `      gap="${gap}"\n` : "";

        return `import React from "react";
import { IntentDivider } from "intent-design-system";

export function Example() {
  return (
    <div style={{ width: "100%" }}>
      <IntentDivider
        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
        disabled={${disabled}}
        orientation="${orientation}"
        thickness="${thickness}"
        fullWidth={${fullWidth}}
${labelLine}${alignLine}${gapLine}      />
    </div>
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        orientation,
        thickness,
        fullWidth,
        withLabel,
        label,
        align,
        gap,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentDividerIdentity}
            propsTable={IntentDividerPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-4">
                    <div
                        className={cn(
                            "rounded-xl p-4",
                            orientation === "vertical"
                                ? "h-40 flex items-center justify-center"
                                : ""
                        )}
                    >
                        <IntentDivider
                            {...dsInput}
                            mode={mode}
                            orientation={orientation}
                            thickness={thickness}
                            fullWidth={fullWidth}
                            label={label}
                            align={align}
                            gap={gap}
                        />
                    </div>

                    <div className="text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, intent=
                        <span className="font-mono"> {intent}</span>, orientation=
                        <span className="font-mono"> {orientation}</span>, thickness=
                        <span className="font-mono"> {thickness}</span>
                    </div>
                </div>
            )}
        />
    );
}
