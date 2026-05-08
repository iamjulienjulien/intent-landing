"use client";

// src/app/playground/components/intent-stepper/PlaygroundIntentStepperClient.tsx
// PlaygroundIntentStepperClient
// - Uses PlaygroundComponentShell to test IntentStepper
// - Uses DS exports: Identity + PropsTable
// - Uses shared PlaygroundComponentDesignControls
// - Adds playground-only controls for stepper behavior and content

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentStepper,
    IntentStepperIdentity,
    IntentStepperPropsTable,
    resolveIntentWithWarnings,
    isAestheticGlow,
    type Glow,
    type Intent,
    type Intensity,
    type Tone,
    type ToneStep,
    type Variant,
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

type StepperSize = "xs" | "sm" | "md" | "lg";

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
   Main
============================================================================ */

export default function PlaygroundIntentStepperClient() {
    // DS controls
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [disabled, setDisabled] = useState(false);

    // Stepper props
    const [size, setSize] = useState<StepperSize>("md");
    const [clickable, setClickable] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);
    const [compact, setCompact] = useState(false);
    const [showDescriptions, setShowDescriptions] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const [showStepNumbers, setShowStepNumbers] = useState(false);
    const [withMeta, setWithMeta] = useState(true);
    const [withIcons, setWithIcons] = useState(false);
    const [useExplicitStatuses, setUseExplicitStatuses] = useState(false);

    const [currentStep, setCurrentStep] = useState("details");

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

    const steps = useMemo(() => {
        const base = [
            {
                id: "account",
                label: "Compte",
                description: "Identité et accès",
                meta: withMeta ? <span aria-hidden>01</span> : undefined,
                icon: withIcons ? <span aria-hidden>👤</span> : undefined,
            },
            {
                id: "details",
                label: "Détails",
                description: "Profil et préférences",
                meta: withMeta ? <span aria-hidden>02</span> : undefined,
                icon: withIcons ? <span aria-hidden>🧾</span> : undefined,
            },
            {
                id: "billing",
                label: "Facturation",
                description: "Plan, paiement, TVA",
                meta: withMeta ? <span aria-hidden>03</span> : undefined,
                icon: withIcons ? <span aria-hidden>💳</span> : undefined,
            },
            {
                id: "confirm",
                label: "Confirmation",
                description: "Validation finale",
                meta: withMeta ? <span aria-hidden>04</span> : undefined,
                icon: withIcons ? <span aria-hidden>✅</span> : undefined,
            },
        ];

        if (!useExplicitStatuses) return base;

        return [
            {
                ...base[0],
                status: "complete" as const,
            },
            {
                ...base[1],
                status: "current" as const,
            },
            {
                ...base[2],
                status: "error" as const,
            },
            {
                ...base[3],
                status: "locked" as const,
            },
        ];
    }, [withMeta, withIcons, useExplicitStatuses]);

    useEffect(() => {
        if (!steps.some((step) => step.id === currentStep)) {
            setCurrentStep(steps[0]?.id ?? "");
        }
    }, [steps, currentStep]);

    const extraControls = (
        <>
            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as StepperSize)}
                    options={["xs", "sm", "md", "lg"]}
                />
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="clickable" checked={clickable} onChange={setClickable} />
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                </div>
            </SelectRow>

            <SelectRow label="Display">
                <div className="space-y-2">
                    <CheckboxRow
                        label="showDescriptions"
                        checked={showDescriptions}
                        onChange={setShowDescriptions}
                    />
                    <CheckboxRow
                        label="showProgressBar"
                        checked={showProgressBar}
                        onChange={setShowProgressBar}
                    />
                    <CheckboxRow
                        label="showStepNumbers"
                        checked={showStepNumbers}
                        onChange={setShowStepNumbers}
                    />
                    <CheckboxRow label="withMeta" checked={withMeta} onChange={setWithMeta} />
                    <CheckboxRow label="withIcons" checked={withIcons} onChange={setWithIcons} />
                </div>
            </SelectRow>

            <SelectRow label="Statuses">
                <div className="space-y-2">
                    <CheckboxRow
                        label="useExplicitStatuses"
                        checked={useExplicitStatuses}
                        onChange={setUseExplicitStatuses}
                    />
                </div>

                <div className="mt-2 text-[11px] opacity-50">
                    Désactivé: les statuts sont inférés depuis{" "}
                    <span className="font-mono">currentStep</span>.
                    <br />
                    Activé: démo mixte{" "}
                    <span className="font-mono">complete/current/error/locked</span>.
                </div>
            </SelectRow>

            {!useExplicitStatuses ? (
                <SelectRow label="Current step">
                    <Select
                        value={currentStep}
                        onChange={setCurrentStep}
                        options={steps.map((s) => s.id)}
                    />
                </SelectRow>
            ) : null}
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

        const stepsCode = useExplicitStatuses
            ? `[
      { id: "account", label: "Compte", description: "Identité et accès", status: "complete" },
      { id: "details", label: "Détails", description: "Profil et préférences", status: "current" },
      { id: "billing", label: "Facturation", description: "Plan, paiement, TVA", status: "error" },
      { id: "confirm", label: "Confirmation", description: "Validation finale", status: "locked" },
    ]`
            : `[
      { id: "account", label: "Compte", description: "Identité et accès" },
      { id: "details", label: "Détails", description: "Profil et préférences" },
      { id: "billing", label: "Facturation", description: "Plan, paiement, TVA" },
      { id: "confirm", label: "Confirmation", description: "Validation finale" },
    ]`;

        return `import { IntentStepper } from "intent-design-system";

export function Example() {
  const steps = ${stepsCode};

  return (
    <IntentStepper
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      currentStep="${currentStep}"
      steps={steps}
      size="${size}"
      clickable={${clickable}}
      readOnly={${readOnly}}
      fullWidth={${fullWidth}}
      compact={${compact}}
      showDescriptions={${showDescriptions}}
      showProgressBar={${showProgressBar}}
      showStepNumbers={${showStepNumbers}}
      onStepChange={(stepId) => console.log(stepId)}
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
        disabled,
        currentStep,
        size,
        clickable,
        readOnly,
        fullWidth,
        compact,
        showDescriptions,
        showProgressBar,
        showStepNumbers,
        useExplicitStatuses,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentStepperIdentity}
            propsTable={IntentStepperPropsTable}
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
                <div className="w-full min-w-0 space-y-4">
                    <IntentStepper
                        {...dsInput}
                        mode={mode}
                        steps={steps}
                        currentStep={currentStep}
                        onStepChange={(stepId) => setCurrentStep(stepId)}
                        size={size}
                        clickable={clickable}
                        readOnly={readOnly}
                        fullWidth={fullWidth}
                        compact={compact}
                        showDescriptions={showDescriptions}
                        showProgressBar={showProgressBar}
                        showStepNumbers={showStepNumbers}
                        className="w-full"
                    />

                    <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                        <div className="text-xs tracking-[0.18em] opacity-55">FORM CONTENT</div>

                        <div className="mt-3 text-sm opacity-85">
                            Étape active : <span className="font-mono">{currentStep}</span>
                        </div>

                        <div className="mt-2 text-sm opacity-70">
                            Ici tu peux afficher le contenu du wizard correspondant à l’étape
                            sélectionnée.
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                                <div className="text-xs font-semibold opacity-85">Bloc A</div>
                                <div className="mt-1 text-[11px] opacity-60">
                                    Champs du formulaire
                                </div>
                            </div>

                            <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                                <div className="text-xs font-semibold opacity-85">Bloc B</div>
                                <div className="mt-1 text-[11px] opacity-60">
                                    Aide / résumé / validation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
