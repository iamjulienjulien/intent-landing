"use client";

// src/app/playground/components/intent-visualization-bar/PlaygroundIntentVisualizationBarClient.tsx
// PlaygroundIntentVisualizationBarClient
// - Uses PlaygroundComponentShell to test IntentVisualizationBar
// - DS controls + local visualization controls + code drawer

import React, { useMemo, useState } from "react";

import {
    IntentVisualizationBar,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentVisualizationBarIdentity,
    IntentVisualizationBarPropsTable,
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

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentVisualizationBarClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local viz props
    const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
    const [showAxis, setShowAxis] = useState(true);
    const [showValues, setShowValues] = useState(true);
    const [height, setHeight] = useState(240);
    const [gap, setGap] = useState(10);
    const [barRadius, setBarRadius] = useState(14);

    // Per-bar intent demo
    const [perBarIntent, setPerBarIntent] = useState(true);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) setGlow(false);
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

    const data = useMemo(() => {
        const base = [
            { id: "c1", label: "Chapitre I", value: 12 },
            { id: "c2", label: "Chapitre II", value: 28 },
            { id: "c3", label: "Chapitre III", value: 42 },
            { id: "c4", label: "Chapitre IV", value: 18 },
        ];

        if (!perBarIntent) return base;

        return [
            { ...base[0], intent: "informed" as Intent },
            { ...base[1], intent: "warned" as Intent },
            { ...base[2], intent: "empowered" as Intent },
            { ...base[3], intent: "threatened" as Intent },
        ];
    }, [perBarIntent]);

    /* ============================================================================
       Controls
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
                <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Orientation">
                <Select
                    value={orientation}
                    onChange={(v) => setOrientation(v as any)}
                    options={["vertical", "horizontal"]}
                />
            </SelectRow>

            <SelectRow label="Display">
                <div className="space-y-2">
                    <CheckboxRow label="showAxis" checked={showAxis} onChange={setShowAxis} />
                    <CheckboxRow label="showValues" checked={showValues} onChange={setShowValues} />
                    <CheckboxRow
                        label="perBarIntent (demo)"
                        checked={perBarIntent}
                        onChange={setPerBarIntent}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Geometry">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">height</div>
                        <input
                            type="number"
                            value={height}
                            min={140}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">gap</div>
                        <input
                            type="number"
                            value={gap}
                            min={0}
                            onChange={(e) => setGap(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">barRadius</div>
                        <input
                            type="number"
                            value={barRadius}
                            min={0}
                            onChange={(e) => setBarRadius(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: active <span className="font-mono">perBarIntent</span> pour valider les vars
                par barre (et la cohérence intent).
            </div>
        </>
    );

    /* ============================================================================
       Code string
       - no replaceAll (tsconfig lib older)
    ============================================================================ */

    const codeString = useMemo(() => {
        const esc = (s: string) => s.replace(/"/g, '\\"');

        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        return `import * as React from "react";
import { IntentVisualizationBar } from "intent-design-system";

export function Example() {
  const data = ${JSON.stringify(data, null, 2)};

  return (
    <IntentVisualizationBar
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}

      data={data}
      orientation="${orientation}"
      showAxis={${showAxis}}
      showValues={${showValues}}
      height={${height}}
      gap={${gap}}
      barRadius={${barRadius}}
      title="${esc("Progression RPG Renaissance")}"
      description="${esc("XP par chapitre (demo)")}"
      onBarClick={(d) => console.log("bar:", d)}
      valueFormatter={(v) => v + " XP"}
    />
  );
}`;
    }, [
        data,
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        orientation,
        showAxis,
        showValues,
        height,
        gap,
        barRadius,
    ]);

    const preview = useMemo(() => {
        return (
            <IntentVisualizationBar
                {...dsInput}
                mode={previewMode}
                data={data as any}
                orientation={orientation}
                showAxis={showAxis}
                showValues={showValues}
                height={height}
                gap={gap}
                barRadius={barRadius}
                title="Progression RPG Renaissance"
                description="XP par chapitre (demo)"
                valueFormatter={(v) => `${v} XP`}
                onBarClick={(d) => {
                    // eslint-disable-next-line no-console
                    console.log("bar:", d);
                }}
            />
        );
    }, [dsInput, previewMode, data, orientation, showAxis, showValues, height, gap, barRadius]);

    return (
        <PlaygroundComponentShell
            identity={IntentVisualizationBarIdentity}
            propsTable={IntentVisualizationBarPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={() => (
                <div className="w-full min-w-0">
                    {preview}
                    <div className="mt-3 text-xs opacity-70">
                        orientation=<span className="font-mono">{orientation}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, perBarIntent=
                        <span className="font-mono"> {String(perBarIntent)}</span>
                    </div>
                </div>
            )}
        />
    );
}
