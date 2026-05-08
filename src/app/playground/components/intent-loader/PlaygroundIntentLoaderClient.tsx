"use client";

// src/app/playground/components/intent-loader/PlaygroundIntentLoaderClient.tsx
// PlaygroundIntentLoaderClient
// - Uses PlaygroundComponentShell to test IntentLoader
// - Uses DS exports: Identity + PropsTable
// - Uses shared PlaygroundComponentDesignControls
// - Adds playground-only controls for loader variants, layout, progress and labels

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentLoader,
    IntentLoaderIdentity,
    IntentLoaderPropsTable,
    resolveIntentWithWarnings,
    isAestheticGlow,
    type Glow,
    type Intent,
    type Intensity,
    type Tone,
    type ToneStep,
    type Variant,
    type IntentLoaderVariant,
    type IntentLoaderSize,
    type IntentLoaderSpeed,
    type IntentLoaderLayout,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";
import PlaygroundComponentDesignControls, {
    type PreviewMode,
} from "../_components/PlaygroundComponentDesignControls";

/* ============================================================================
   Helpers
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
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
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
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

const LOADER_VARIANTS: IntentLoaderVariant[] = [
    "spinner",
    "ring",
    "orbit",
    "planet",
    "comet",
    "stars",
    "pulse",
    "radar",
    "warp",
    "eclipse",
    "constellation",
    "galaxy",
    "neural",
    "analyzing",
    "matrix",
    "thinking",
    "runes",
    "sigil",
    "alchemy",
    "portal",
];

const LOADER_SIZES: IntentLoaderSize[] = ["xs", "sm", "md", "lg", "xl"];
const LOADER_SPEEDS: IntentLoaderSpeed[] = ["verySlow", "slow", "normal", "fast", "veryFast"];
const LOADER_LAYOUTS: IntentLoaderLayout[] = ["inline", "stacked"];

const CENTER_ICON_OPTIONS = ["none", "🪐", "✨", "🌌", "🧬", "🚀", "⭐"] as const;

/* ============================================================================
   Main
============================================================================ */

export default function PlaygroundIntentLoaderClient() {
    // DS controls
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");
    const [intent, setIntent] = useState<Intent>("glowed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>("aurora");

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [disabled, setDisabled] = useState(false);

    // Loader props
    const [loaderVariant, setLoaderVariant] = useState<IntentLoaderVariant>("orbit");
    const [loaderSize, setLoaderSize] = useState<IntentLoaderSize>("lg");
    const [loaderSpeed, setLoaderSpeed] = useState<IntentLoaderSpeed>("normal");
    const [loaderLayout, setLoaderLayout] = useState<IntentLoaderLayout>("stacked");

    const [loading, setLoading] = useState(true);
    const [hideWhenIdle, setHideWhenIdle] = useState(false);
    const [centered, setCentered] = useState(true);
    const [fullWidth, setFullWidth] = useState(true);
    const [framed, setFramed] = useState(true);

    const [withLabel, setWithLabel] = useState(true);
    const [withCaption, setWithCaption] = useState(true);
    const [withCenterIcon, setWithCenterIcon] = useState(false);
    const [centerIconValue, setCenterIconValue] =
        useState<(typeof CENTER_ICON_OPTIONS)[number]>("🪐");

    const [withProgress, setWithProgress] = useState(false);
    const [showProgress, setShowProgress] = useState(true);
    const [progress, setProgress] = useState(72);

    const [ariaLabel, setAriaLabel] = useState("Chargement cosmique");

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
    }, [aestheticEnabled, glow]);

    const dsInput = useMemo(() => {
        return {
            mode: previewMode,
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
    }, [
        previewMode,
        intent,
        variant,
        toneEnabled,
        tone,
        aestheticEnabled,
        glow,
        intensity,
        toneStep,
        disabled,
    ]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const centerIcon = useMemo(() => {
        if (!withCenterIcon || centerIconValue === "none") return undefined;
        return <span aria-hidden>{centerIconValue}</span>;
    }, [withCenterIcon, centerIconValue]);

    const label = withLabel
        ? (() => {
              if (loaderVariant === "galaxy") return "Assemblage de la galaxie";
              if (loaderVariant === "constellation") return "Traçage de la constellation";
              if (loaderVariant === "warp") return "Passage en vitesse lumière";
              if (loaderVariant === "radar") return "Scan des archives";
              if (loaderVariant === "planet") return "Alignement des planètes";
              if (loaderVariant === "orbit") return "Mise en orbite";
              return "Chargement des données";
          })()
        : undefined;

    const caption = withCaption
        ? "Space Memoria prépare les astres, les branches et les souvenirs..."
        : undefined;

    const extraControls = (
        <>
            <SelectRow label="Variant">
                <Select
                    value={loaderVariant}
                    onChange={(v) => setLoaderVariant(v as IntentLoaderVariant)}
                    options={[...LOADER_VARIANTS]}
                />
            </SelectRow>

            <SelectRow label="Visual">
                <div className="space-y-3">
                    <div>
                        <div className="mb-2 text-[11px] opacity-45">Size</div>
                        <Select
                            value={loaderSize}
                            onChange={(v) => setLoaderSize(v as IntentLoaderSize)}
                            options={[...LOADER_SIZES]}
                        />
                    </div>

                    <div>
                        <div className="mb-2 text-[11px] opacity-45">Speed</div>
                        <Select
                            value={loaderSpeed}
                            onChange={(v) => setLoaderSpeed(v as IntentLoaderSpeed)}
                            options={[...LOADER_SPEEDS]}
                        />
                    </div>

                    <div>
                        <div className="mb-2 text-[11px] opacity-45">Layout</div>
                        <Select
                            value={loaderLayout}
                            onChange={(v) => setLoaderLayout(v as IntentLoaderLayout)}
                            options={[...LOADER_LAYOUTS]}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="State">
                <div className="space-y-2">
                    <CheckboxRow label="loading" checked={loading} onChange={setLoading} />
                    <CheckboxRow
                        label="hideWhenIdle"
                        checked={hideWhenIdle}
                        onChange={setHideWhenIdle}
                    />
                    <CheckboxRow label="centered" checked={centered} onChange={setCentered} />
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="framed" checked={framed} onChange={setFramed} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="withLabel" checked={withLabel} onChange={setWithLabel} />
                    <CheckboxRow
                        label="withCaption"
                        checked={withCaption}
                        onChange={setWithCaption}
                    />
                    <CheckboxRow
                        label="withCenterIcon"
                        checked={withCenterIcon}
                        onChange={setWithCenterIcon}
                    />
                </div>

                {withCenterIcon ? (
                    <div className="mt-3">
                        <div className="mb-2 text-[11px] opacity-45">Center icon</div>
                        <Select
                            value={centerIconValue}
                            onChange={(v) =>
                                setCenterIconValue(v as (typeof CENTER_ICON_OPTIONS)[number])
                            }
                            options={[...CENTER_ICON_OPTIONS]}
                        />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Progress">
                <div className="space-y-2">
                    <CheckboxRow
                        label="withProgress"
                        checked={withProgress}
                        onChange={setWithProgress}
                    />
                    <CheckboxRow
                        label="showProgress"
                        checked={showProgress}
                        onChange={setShowProgress}
                    />
                </div>

                {withProgress ? (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs opacity-60">Progress</span>
                            <span className="font-mono text-xs opacity-80">{progress}%</span>
                        </div>

                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Accessibility">
                <div className="space-y-2">
                    <input
                        value={ariaLabel}
                        onChange={(e) => setAriaLabel(e.target.value)}
                        placeholder="ARIA label"
                        className={cn(
                            "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                            "px-3 py-2 text-sm opacity-85",
                            "focus:outline-none focus:ring-2 focus:ring-white/15"
                        )}
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

        const labelLine = withLabel ? `      label="${label}"\n` : "";
        const captionLine = withCaption ? `      caption="${caption}"\n` : "";
        const progressLine = withProgress ? `      progress={${progress}}\n` : "";
        const showProgressLine = withProgress ? `      showProgress={${showProgress}}\n` : "";
        const centerIconLine =
            withCenterIcon && centerIconValue !== "none"
                ? `      centerIcon={<span aria-hidden>${centerIconValue}</span>}\n`
                : "";

        return `import { IntentLoader } from "intent-design-system";

export function Example() {
  return (
    <IntentLoader
      mode="${previewMode}"
      intent="${intent}"
      loaderVariant="${loaderVariant}"
${toneLine}${glowLine}      intensity="${intensity}"
      loading={${loading}}
      hideWhenIdle={${hideWhenIdle}}
      size="${loaderSize}"
      speed="${loaderSpeed}"
      layout="${loaderLayout}"
      centered={${centered}}
      fullWidth={${fullWidth}}
      framed={${framed}}
${labelLine}${captionLine}${progressLine}${showProgressLine}${centerIconLine}      ariaLabel="${ariaLabel}"
    />
  );
}`;
    }, [
        previewMode,
        intent,
        loaderVariant,
        tone,
        glow,
        intensity,
        loading,
        hideWhenIdle,
        loaderSize,
        loaderSpeed,
        loaderLayout,
        centered,
        fullWidth,
        framed,
        withLabel,
        withCaption,
        label,
        caption,
        withProgress,
        progress,
        showProgress,
        withCenterIcon,
        centerIconValue,
        ariaLabel,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentLoaderIdentity}
            propsTable={IntentLoaderPropsTable}
            locale="fr"
            dsControls={
                <PlaygroundComponentDesignControls
                    previewMode={previewMode}
                    intent={intent}
                    variant={variant}
                    tone={tone}
                    glow={glow}
                    intensity={intensity}
                    toneStep={toneStep}
                    disabled={disabled}
                    onPreviewModeChange={setPreviewMode}
                    onIntentChange={setIntent}
                    onVariantChange={setVariant}
                    onToneChange={setTone}
                    onGlowChange={setGlow}
                    onIntensityChange={setIntensity}
                    onToneStepChange={setToneStep}
                    onDisabledChange={setDisabled}
                    showToneStep={false}
                />
            }
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            previewExpandable
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-6">
                    <IntentLoader
                        {...dsInput}
                        mode={mode}
                        loaderVariant={loaderVariant}
                        size={loaderSize}
                        speed={loaderSpeed}
                        layout={loaderLayout}
                        loading={loading}
                        hideWhenIdle={hideWhenIdle}
                        centered={centered}
                        fullWidth={fullWidth}
                        framed={framed}
                        label={label}
                        caption={caption}
                        progress={withProgress ? progress : null}
                        showProgress={showProgress}
                        centerIcon={centerIcon}
                        ariaLabel={ariaLabel}
                        className="w-full"
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {(
                            [
                                "spinner",
                                "ring",
                                "orbit",
                                "planet",
                                "radar",
                                "constellation",
                                "galaxy",
                            ] as const
                        ).map((sampleVariant) => (
                            <div
                                key={sampleVariant}
                                className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4"
                            >
                                <div className="text-xs tracking-[0.18em] opacity-55">
                                    {sampleVariant.toUpperCase()}
                                </div>

                                <div className="mt-4 flex items-center justify-center">
                                    <IntentLoader
                                        {...dsInput}
                                        mode={mode}
                                        loaderVariant={sampleVariant}
                                        size="md"
                                        speed={loaderSpeed}
                                        loading={loading}
                                        centered
                                        label={undefined}
                                        caption={undefined}
                                        progress={
                                            sampleVariant === "ring" && withProgress
                                                ? progress
                                                : null
                                        }
                                        showProgress={false}
                                        centerIcon={
                                            sampleVariant === "galaxy" ? (
                                                <span aria-hidden>🪐</span>
                                            ) : undefined
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                        <div className="text-xs tracking-[0.18em] opacity-55">NOTES</div>

                        <div className="mt-3 space-y-2 text-sm opacity-75">
                            <div>
                                Variante active :{" "}
                                <span className="font-mono opacity-90">{loaderVariant}</span>
                            </div>
                            <div>
                                État :{" "}
                                <span className="font-mono opacity-90">
                                    {loading ? "loading" : "idle"}
                                </span>
                            </div>
                            <div>
                                Layout :{" "}
                                <span className="font-mono opacity-90">{loaderLayout}</span>
                            </div>
                            <div>
                                Progress :{" "}
                                <span className="font-mono opacity-90">
                                    {withProgress ? `${progress}%` : "none"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
