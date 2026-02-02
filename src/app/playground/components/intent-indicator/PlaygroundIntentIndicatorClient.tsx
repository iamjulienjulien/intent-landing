"use client";

// src/app/playground/components/intent-indicator/PlaygroundIntentIndicatorClient.tsx
// PlaygroundIntentIndicatorClient
// - Uses PlaygroundComponentShell to test IntentIndicator
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentIndicator,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentIndicatorIdentity,
    IntentIndicatorPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type IndicatorSize = "xs" | "sm" | "md" | "lg";
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

export default function PlaygroundIntentIndicatorClient() {
    // ✅ NEW: preview mode (drives shell tile bg + mode passed to the component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [size, setSize] = useState<IndicatorSize>("md");
    const [fullWidth, setFullWidth] = useState(false);

    const [dot, setDot] = useState(false);
    const [leftIcon, setLeftIcon] = useState(false);
    const [rightIcon, setRightIcon] = useState(false);

    const [role, setRole] = useState<React.AriaRole | "none">("status");

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
                    <div className="text-[11px] opacity-40">
                        tone est appliqué uniquement quand{" "}
                        <span className="font-mono">intent="toned"</span>
                    </div>
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
                <div className="text-[11px] opacity-40">
                    {aestheticEnabled ? (
                        <>
                            Mode <span className="font-mono">glowed</span>: aesthetic glows only.
                        </>
                    ) : (
                        <>
                            Mode normal: <span className="font-mono">false/true</span>.
                        </>
                    )}
                </div>
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
            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as IndicatorSize)}
                    options={["xs", "sm", "md", "lg"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="dot" checked={dot} onChange={setDot} />
                    <CheckboxRow label="leftIcon" checked={leftIcon} onChange={setLeftIcon} />
                    <CheckboxRow label="rightIcon" checked={rightIcon} onChange={setRightIcon} />
                </div>
            </SelectRow>

            <SelectRow label="Role (ARIA)">
                <Select
                    value={role}
                    onChange={(v) => setRole(v as React.AriaRole | "none")}
                    options={["status", "note", "img", "text", "none"]}
                />
                <div className="text-[11px] opacity-40">
                    “none” n’est pas un vrai <span className="font-mono">AriaRole</span>, mais
                    pratique en debug. Si tu veux strict, enlève-le.
                </div>
            </SelectRow>

            {/* ✅ moved from Preview card */}
            <div className="text-[11px] opacity-55">
                Astuce: <span className="font-mono">dot=true</span> est parfait pour
                “online/offline”, et <span className="font-mono">role="status"</span> aide les
                lecteurs d’écran.
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

        const roleValue = role === "none" ? undefined : role;

        const roleLine = roleValue ? `      role="${roleValue}"\n` : "";

        const leftIconLine = leftIcon ? `      leftIcon={<span aria-hidden>●</span>}\n` : "";
        const rightIconLine = rightIcon ? `      rightIcon={<span aria-hidden>↗</span>}\n` : "";

        return `import React from "react";
import { IntentIndicator } from "intent-design-system";

export function Example() {
  return (
    <IntentIndicator
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      size="${size}"
      fullWidth={${fullWidth}}
      dot={${dot}}
${roleLine}${leftIconLine}${rightIconLine}    >
      IntentIndicator
    </IntentIndicator>
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
        dot,
        role,
        leftIcon,
        rightIcon,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentIndicatorIdentity}
            propsTable={IntentIndicatorPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className={cn("w-full min-w-0", fullWidth ? "" : "flex items-start")}>
                        <IntentIndicator
                            {...dsInput}
                            mode={mode}
                            size={size}
                            fullWidth={fullWidth}
                            dot={dot}
                            role={role === "none" ? undefined : (role as React.AriaRole)}
                            leftIcon={leftIcon ? <span aria-hidden>●</span> : undefined}
                            rightIcon={rightIcon ? <span aria-hidden>↗</span> : undefined}
                        >
                            IntentIndicator
                        </IntentIndicator>
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, size=
                        <span className="font-mono"> {size}</span>
                        {dot ? (
                            <>
                                , dot=<span className="font-mono">true</span>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        />
    );
}
