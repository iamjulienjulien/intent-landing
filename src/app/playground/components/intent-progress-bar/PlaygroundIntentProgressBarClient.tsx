"use client";

// src/app/playground/components/intent-progress-bar/PlaygroundIntentProgressBarClient.tsx
// PlaygroundIntentProgressBarClient
// - Uses PlaygroundComponentShell to test IntentProgressBar
// - Uses DS exports: Identity + PropsTable
// - Covers determinate / indeterminate, horizontal / vertical, marker, labels, stripes, pulse

import React, { useMemo, useState } from "react";

import {
    IntentProgressBar,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,
    type IntentProgressBarSize,
    type IntentProgressBarOrientation,
    type IntentProgressBarRadius,
    type IntentProgressBarValuePosition,
    IntentProgressBarIdentity,
    IntentProgressBarPropsTable,
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

export default function PlaygroundIntentProgressBarClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("empowered");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [value, setValue] = useState(64);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [indeterminate, setIndeterminate] = useState(false);
    const [animated, setAnimated] = useState(true);
    const [striped, setStriped] = useState(true);
    const [pulse, setPulse] = useState(false);

    const [markerEnabled, setMarkerEnabled] = useState(true);
    const [markerValue, setMarkerValue] = useState(80);

    const [size, setSize] = useState<IntentProgressBarSize>("md");
    const [orientation, setOrientation] = useState<IntentProgressBarOrientation>("horizontal");
    const [radius, setRadius] = useState<IntentProgressBarRadius>("full");
    const [valuePosition, setValuePosition] = useState<IntentProgressBarValuePosition>("outside");

    const [fullWidth, setFullWidth] = useState(true);
    const [inline, setInline] = useState(false);
    const [framed, setFramed] = useState(false);

    const [lengthMode, setLengthMode] = useState<"auto" | "fixed">("auto");
    const [lengthPx, setLengthPx] = useState(240);

    const [withLabel, setWithLabel] = useState(true);
    const [withCaption, setWithCaption] = useState(true);
    const [withIcon, setWithIcon] = useState(false);
    const [showValue, setShowValue] = useState(true);
    const [valueDecimals, setValueDecimals] = useState(0);
    const [customValueLabel, setCustomValueLabel] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
    }, [aestheticEnabled, glow]);

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

    const length = lengthMode === "fixed" ? `${lengthPx}px` : undefined;

    const label = withLabel
        ? orientation === "vertical"
            ? "Progression verticale"
            : "Synchronisation des archives"
        : undefined;

    const caption = withCaption
        ? indeterminate
            ? "Les données sont en cours d’analyse…"
            : "Space Memoria aligne les branches et prépare les constellations."
        : undefined;

    const valueLabel = customValueLabel ? `${value} unités` : undefined;

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
            <SelectRow label="Progress">
                <div className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs opacity-60">value</span>
                            <span className="font-mono text-xs opacity-85">{value}</span>
                        </div>
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={1}
                            value={value}
                            onChange={(e) => setValue(Number(e.target.value))}
                            className="w-full"
                            disabled={indeterminate}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="number"
                            value={min}
                            onChange={(e) => setMin(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                            placeholder="min"
                        />
                        <input
                            type="number"
                            value={max}
                            onChange={(e) => setMax(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                            placeholder="max"
                        />
                        <input
                            type="number"
                            value={valueDecimals}
                            min={0}
                            max={3}
                            onChange={(e) => setValueDecimals(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                            placeholder="decimals"
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow
                        label="indeterminate"
                        checked={indeterminate}
                        onChange={setIndeterminate}
                    />
                    <CheckboxRow label="animated" checked={animated} onChange={setAnimated} />
                    <CheckboxRow label="striped" checked={striped} onChange={setStriped} />
                    <CheckboxRow label="pulse" checked={pulse} onChange={setPulse} />
                </div>
            </SelectRow>

            <SelectRow label="Marker">
                <div className="space-y-2">
                    <CheckboxRow
                        label="marker enabled"
                        checked={markerEnabled}
                        onChange={setMarkerEnabled}
                    />
                </div>

                {markerEnabled ? (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs opacity-60">markerValue</span>
                            <span className="font-mono text-xs opacity-85">{markerValue}</span>
                        </div>
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={1}
                            value={markerValue}
                            onChange={(e) => setMarkerValue(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Layout">
                <Select
                    value={orientation}
                    onChange={(v) => setOrientation(v as IntentProgressBarOrientation)}
                    options={["horizontal", "vertical"]}
                />
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as IntentProgressBarSize)}
                    options={["xs", "sm", "md", "lg", "xl"]}
                />
            </SelectRow>

            <SelectRow label="Radius">
                <Select
                    value={radius}
                    onChange={(v) => setRadius(v as IntentProgressBarRadius)}
                    options={["sm", "md", "lg", "full"]}
                />
            </SelectRow>

            <SelectRow label="Value position">
                <Select
                    value={valuePosition}
                    onChange={(v) => setValuePosition(v as IntentProgressBarValuePosition)}
                    options={["inside", "outside", "none"]}
                />
            </SelectRow>

            <SelectRow label="Container">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="inline" checked={inline} onChange={setInline} />
                    <CheckboxRow label="framed" checked={framed} onChange={setFramed} />
                </div>
            </SelectRow>

            <SelectRow label="Length">
                <Select
                    value={lengthMode}
                    onChange={(v) => setLengthMode(v as "auto" | "fixed")}
                    options={["auto", "fixed"]}
                />
                {lengthMode === "fixed" ? (
                    <div className="mt-3">
                        <input
                            type="number"
                            value={lengthPx}
                            min={40}
                            max={500}
                            onChange={(e) => setLengthPx(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="withLabel" checked={withLabel} onChange={setWithLabel} />
                    <CheckboxRow
                        label="withCaption"
                        checked={withCaption}
                        onChange={setWithCaption}
                    />
                    <CheckboxRow label="withIcon" checked={withIcon} onChange={setWithIcon} />
                    <CheckboxRow label="showValue" checked={showValue} onChange={setShowValue} />
                    <CheckboxRow
                        label="customValueLabel"
                        checked={customValueLabel}
                        onChange={setCustomValueLabel}
                    />
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

        const lengthLine = length !== undefined ? `      length="${length}"\n` : "";
        const markerLine = markerEnabled ? `      markerValue={${markerValue}}\n` : "";
        const labelLine = withLabel ? `      label="${label}"\n` : "";
        const captionLine = withCaption ? `      caption="${caption}"\n` : "";
        const iconLine = withIcon ? `      icon={<span aria-hidden>🪐</span>}\n` : "";
        const valueLabelLine = customValueLabel ? `      valueLabel="${valueLabel}"\n` : "";

        return `import { IntentProgressBar } from "intent-design-system";

export function Example() {
  return (
    <IntentProgressBar
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      toneStep={${toneStep}}
      disabled={${disabled}}
      value={${value}}
      min={${min}}
      max={${max}}
      indeterminate={${indeterminate}}
      animated={${animated}}
      striped={${striped}}
      pulse={${pulse}}
${markerLine}      size="${size}"
      orientation="${orientation}"
      radius="${radius}"
      valuePosition="${valuePosition}"
      fullWidth={${fullWidth}}
      inline={${inline}}
      framed={${framed}}
${lengthLine}${labelLine}${captionLine}${valueLabelLine}${iconLine}      showValue={${showValue}}
      valueDecimals={${valueDecimals}}
      ariaLabel="Progression"
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
        toneStep,
        disabled,
        value,
        min,
        max,
        indeterminate,
        animated,
        striped,
        pulse,
        markerEnabled,
        markerValue,
        size,
        orientation,
        radius,
        valuePosition,
        fullWidth,
        inline,
        framed,
        length,
        withLabel,
        withCaption,
        withIcon,
        showValue,
        valueDecimals,
        customValueLabel,
        label,
        caption,
        valueLabel,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentProgressBarIdentity}
            propsTable={IntentProgressBarPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            previewExpandable
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-6">
                    <div
                        className={cn(
                            "w-full min-w-0",
                            orientation === "vertical"
                                ? "flex items-start gap-6 flex-wrap"
                                : "space-y-4"
                        )}
                    >
                        <IntentProgressBar
                            {...dsInput}
                            mode={mode}
                            value={value}
                            min={min}
                            max={max}
                            indeterminate={indeterminate}
                            animated={animated}
                            striped={striped}
                            pulse={pulse}
                            markerValue={markerEnabled ? markerValue : null}
                            label={label}
                            caption={caption}
                            valueLabel={customValueLabel ? valueLabel : undefined}
                            showValue={showValue}
                            valueDecimals={valueDecimals}
                            valuePosition={valuePosition}
                            size={size}
                            orientation={orientation}
                            radius={radius}
                            fullWidth={fullWidth}
                            inline={inline}
                            length={length}
                            framed={framed}
                            icon={withIcon ? <span aria-hidden>🪐</span> : undefined}
                            ariaLabel="Progression"
                        />

                        {orientation === "vertical" ? (
                            <IntentProgressBar
                                {...dsInput}
                                mode={mode}
                                value={Math.min(max, value + 18)}
                                min={min}
                                max={max}
                                size={size}
                                orientation="vertical"
                                radius={radius}
                                length={length ?? "220px"}
                                striped={striped}
                                pulse={pulse}
                                animated={animated}
                                showValue={showValue}
                                valuePosition="outside"
                                label="Secondaire"
                                caption="Comparaison"
                                markerValue={markerEnabled ? markerValue : null}
                            />
                        ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {[18, 42, 76].map((sample, idx) => (
                            <div
                                key={sample}
                                className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4"
                            >
                                <div className="text-xs tracking-[0.18em] opacity-55">
                                    SAMPLE {idx + 1}
                                </div>

                                <div className="mt-4">
                                    <IntentProgressBar
                                        {...dsInput}
                                        mode={mode}
                                        value={sample}
                                        size={size}
                                        striped={idx !== 0}
                                        pulse={idx === 2}
                                        showValue
                                        label={
                                            idx === 0
                                                ? "Import"
                                                : idx === 1
                                                  ? "Analyse"
                                                  : "Indexation"
                                        }
                                        caption="Variant preview"
                                        markerValue={idx === 1 ? 60 : null}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                        <div className="text-xs tracking-[0.18em] opacity-55">NOTES</div>

                        <div className="mt-3 space-y-2 text-sm opacity-75">
                            <div>
                                value: <span className="font-mono opacity-90">{value}</span>
                            </div>
                            <div>
                                orientation:{" "}
                                <span className="font-mono opacity-90">{orientation}</span>
                            </div>
                            <div>
                                indeterminate:{" "}
                                <span className="font-mono opacity-90">
                                    {indeterminate ? "true" : "false"}
                                </span>
                            </div>
                            <div>
                                marker:{" "}
                                <span className="font-mono opacity-90">
                                    {markerEnabled ? markerValue : "none"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
