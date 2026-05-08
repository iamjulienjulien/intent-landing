"use client";

// src/app/playground/components/intent-stat/PlaygroundIntentStatClient.tsx
// PlaygroundIntentStatClient
// - Uses PlaygroundComponentShell to test IntentStat
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentStat,
    IntentIndicator,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,

    // ✅ docs exports from DS
    IntentStatIdentity,
    IntentStatPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type StatSize = "sm" | "md" | "lg";
type StatLayout = "vertical" | "horizontal";
type StatAlign = "left" | "center" | "right";
type StatTrend = "up" | "down" | "neutral";

function isAestheticGlow(glow: Glow): boolean {
    return (
        glow === "aurora" ||
        glow === "ember" ||
        glow === "cosmic" ||
        glow === "mythic" ||
        glow === "royal" ||
        glow === "mono" ||
        glow === "boreal" ||
        glow === "solstice" ||
        glow === "nebula" ||
        glow === "verdant" ||
        glow === "nocturne"
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

export default function PlaygroundIntentStatClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [size, setSize] = useState<StatSize>("md");
    const [layout, setLayout] = useState<StatLayout>("vertical");
    const [align, setAlign] = useState<StatAlign>("left");
    const [fullWidth, setFullWidth] = useState(false);

    const [trend, setTrend] = useState<StatTrend>("up");
    const [loading, setLoading] = useState(false);

    const [withIcon, setWithIcon] = useState(true);
    const [withDelta, setWithDelta] = useState(true);
    const [withDeltaLabel, setWithDeltaLabel] = useState(true);
    const [withRightSlot, setWithRightSlot] = useState(true);

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
            toneStep,
            disabled,
        } as const;
    }, [intent, variant, toneEnabled, tone, aestheticEnabled, glow, intensity, toneStep, disabled]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const glowOptions = aestheticEnabled
        ? ([
              "aurora",
              "ember",
              "cosmic",
              "mythic",
              "royal",
              "mono",
              "boreal",
              "solstice",
              "nebula",
              "verdant",
              "nocturne",
          ] as const)
        : (["false", "true"] as const);

    const valueNode = useMemo(() => {
        if (loading) return undefined;
        return "4 312";
    }, [loading]);

    const labelNode = useMemo(() => {
        if (loading) return undefined;
        return "Pages parcourues";
    }, [loading]);

    const deltaNode = useMemo(() => {
        if (loading || !withDelta) return undefined;
        if (trend === "up") return "+12%";
        if (trend === "down") return "−7%";
        return "0%";
    }, [loading, withDelta, trend]);

    const deltaLabelNode = useMemo(() => {
        if (loading || !withDeltaLabel || !withDelta) return undefined;
        return "vs semaine dernière";
    }, [loading, withDeltaLabel, withDelta]);

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
                        if (aestheticEnabled) return setGlow(v as Glow);
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

            <SelectRow label="ToneStep">
                <Select
                    value={String(toneStep)}
                    onChange={(v) => setToneStep(Number(v) as ToneStep)}
                    options={[
                        "50",
                        "100",
                        "200",
                        "300",
                        "400",
                        "500",
                        "600",
                        "700",
                        "800",
                        "900",
                        "950",
                    ]}
                />
                <div className="text-[11px] opacity-40">
                    Éclaircit/assombrit via step Tailwind. Référence canonique:{" "}
                    <span className="font-mono">500</span>.
                </div>
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
                    onChange={(v) => setSize(v as StatSize)}
                    options={["sm", "md", "lg"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-3">
                    <Select
                        value={layout}
                        onChange={(v) => setLayout(v as StatLayout)}
                        options={["vertical", "horizontal"]}
                    />
                    <Select
                        value={align}
                        onChange={(v) => setAlign(v as StatAlign)}
                        options={["left", "center", "right"]}
                    />
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="loading" checked={loading} onChange={setLoading} />
                    <CheckboxRow label="icon" checked={withIcon} onChange={setWithIcon} />
                    <CheckboxRow label="delta" checked={withDelta} onChange={setWithDelta} />
                    <CheckboxRow
                        label="deltaLabel"
                        checked={withDeltaLabel}
                        onChange={setWithDeltaLabel}
                    />
                    <CheckboxRow
                        label="rightSlot"
                        checked={withRightSlot}
                        onChange={setWithRightSlot}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Trend">
                <Select
                    value={trend}
                    onChange={(v) => setTrend(v as StatTrend)}
                    options={["up", "down", "neutral"]}
                />
                <div className="text-[11px] opacity-40">
                    Le trend pilote uniquement le style du <span className="font-mono">delta</span>.
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: combine <span className="font-mono">IntentStat</span> avec{" "}
                <span className="font-mono">IntentIndicator</span> dans{" "}
                <span className="font-mono">rightSlot</span> pour des cockpits “live”.
            </div>
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

        const deltaLine = withDelta
            ? `      delta="${trend === "up" ? "+12%" : trend === "down" ? "−7%" : "0%"}"\n`
            : "";
        const deltaLabelLine =
            withDelta && withDeltaLabel ? `      deltaLabel="vs semaine dernière"\n` : "";

        const iconLine = withIcon ? `      icon={<span aria-hidden>📚</span>}\n` : "";
        const rightSlotLine = withRightSlot
            ? `      rightSlot={<IntentIndicator size="sm" dot>Live</IntentIndicator>}\n`
            : "";

        return `import React from "react";
import { IntentStat, IntentIndicator } from "intent-design-system";

export function Example() {
  return (
    <IntentStat
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      toneStep={${toneStep}}
      disabled={${disabled}}
      size="${size}"
      layout="${layout}"
      align="${align}"
      fullWidth={${fullWidth}}
      loading={${loading}}
      trend="${trend}"
${iconLine}${rightSlotLine}      value="4 312"
      label="Pages parcourues"
${deltaLine}${deltaLabelLine}    />
  );
}`;
    }, [
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        toneStep,
        disabled,
        size,
        layout,
        align,
        fullWidth,
        loading,
        trend,
        withIcon,
        withRightSlot,
        withDelta,
        withDeltaLabel,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentStatIdentity}
            propsTable={IntentStatPropsTable}
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
                        <IntentStat
                            {...dsInput}
                            mode={mode}
                            size={size}
                            layout={layout}
                            align={align}
                            fullWidth={fullWidth}
                            loading={loading}
                            trend={trend}
                            icon={withIcon ? <span aria-hidden>📚</span> : undefined}
                            rightSlot={
                                withRightSlot ? (
                                    <IntentIndicator size="sm" dot>
                                        Live
                                    </IntentIndicator>
                                ) : undefined
                            }
                            value={valueNode}
                            label={labelNode}
                            delta={deltaNode}
                            deltaLabel={deltaLabelNode}
                        />
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, size=
                        <span className="font-mono"> {size}</span>, layout=
                        <span className="font-mono"> {layout}</span>, trend=
                        <span className="font-mono"> {trend}</span>
                        {loading ? (
                            <>
                                , loading=<span className="font-mono">true</span>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        />
    );
}
