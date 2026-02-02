"use client";

// src/app/playground/components/intent-control-button/PlaygroundIntentControlButtonClient.tsx
// PlaygroundIntentControlButtonClient
// - Uses PlaygroundComponentShell to test IntentControlButton
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentControlButton,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentControlButtonIdentity,
    IntentControlButtonPropsTable,
    IntentPickerTone,
    IntentPickerGlow,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
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

export default function PlaygroundIntentControlButtonClient() {
    // ✅ preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [size, setSize] = useState<ButtonSize>("md");
    const [fullWidth, setFullWidth] = useState(false);

    const [loading, setLoading] = useState(false);
    const [pressed, setPressed] = useState(false);

    const [leftIcon, setLeftIcon] = useState(false);
    const [rightIcon, setRightIcon] = useState(false);

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
                <IntentPickerTone
                    value={tone}
                    onChange={(v) => setTone(v as ToneName)}
                    intent="toned"
                    variant="flat"
                    tone="neutral"
                    size="xs"
                />
            ) : null}

            {/* {toneEnabled ? (
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
            ) : null} */}

            <IntentPickerGlow
                value={
                    aestheticEnabled
                        ? typeof glow === "string"
                            ? glow
                            : "aurora"
                        : glow === true
                          ? true
                          : false
                }
                onChange={(v) => {
                    if (aestheticEnabled) return setGlow(v as GlowName);
                    return setGlow(v === true);
                }}
                pickerMode={aestheticEnabled ? "select" : "toggle"}
                intent="toned"
                variant="flat"
                tone="neutral"
                size="xs"
            />

            {/* <SelectRow label="Glow">
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
            </SelectRow> */}

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
                    onChange={(v) => setSize(v as ButtonSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="loading" checked={loading} onChange={setLoading} />
                    <CheckboxRow label="pressed" checked={pressed} onChange={setPressed} />
                </div>
            </SelectRow>

            <SelectRow label="Icons">
                <div className="space-y-2">
                    <CheckboxRow label="leftIcon" checked={leftIcon} onChange={setLeftIcon} />
                    <CheckboxRow label="rightIcon" checked={rightIcon} onChange={setRightIcon} />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    leftIcon est ignoré si <span className="font-mono">loading=true</span>.
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: click sur le bouton toggle <span className="font-mono">pressed</span>.
            </div>
        </>
    );

    // ✅ optional: enables the Shell "Code" panel (real TSX snippet, copy/paste-ready)
    const codeString = useMemo(() => {
        const leftIconCode = loading
            ? "undefined // leftIcon ignored when loading=true"
            : leftIcon
              ? "<span aria-hidden>←</span>"
              : "undefined";

        const rightIconCode = rightIcon ? "<span aria-hidden>→</span>" : "undefined";

        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const onClickLine = `    onClick={() => setPressed((p) => !p)}\n`;

        return `import { IntentControlButton } from "intent-design-system";

export function Example() {
  const [pressed, setPressed] = React.useState(${pressed});

  return (
    <IntentControlButton
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      loading={${loading}}
      pressed={pressed}
      leftIcon={${leftIconCode}}
      rightIcon={${rightIconCode}}
${onClickLine}    >
      IntentControlButton
    </IntentControlButton>
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
        size,
        fullWidth,
        loading,
        pressed,
        leftIcon,
        rightIcon,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlButtonIdentity}
            propsTable={IntentControlButtonPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className={cn("w-full min-w-0", fullWidth ? "" : "flex items-start")}>
                        <IntentControlButton
                            {...dsInput}
                            mode={mode}
                            size={size}
                            fullWidth={fullWidth}
                            loading={loading}
                            pressed={pressed}
                            leftIcon={leftIcon ? <span aria-hidden>🐺</span> : undefined}
                            rightIcon={rightIcon ? <span aria-hidden>❄️</span> : undefined}
                            onClick={() => setPressed((p) => !p)}
                        >
                            Winter Is Coming
                        </IntentControlButton>
                    </div>
                </div>
            )}
        />
    );
}
