"use client";

// src/app/playground/components/_components/PlaygroundComponentDesignControls.tsx
// PlaygroundComponentDesignControls
// - Reusable design-system controls block for playgrounds
// - Controls: mode, intent, variant, tone/glow, intensity, toneStep, disabled
// - Fully controlled by parent state
// - Optional show[Field] props to toggle each control independently

import React from "react";

import {
    IntentPickerGlow,
    IntentPickerTone,
    IntentControlField,
    IntentControlSelect,
    IntentControlToggle,
    getMetaOptions,
    MODE,
    INTENT,
    VARIANT,
    INTENSITY,
    TONE_STEP,
    isAestheticGlow,
    type Glow,
    type Intent,
    type Intensity,
    type Tone,
    type ToneStep,
    type Variant,
} from "intent-design-system";

/* ============================================================================
   Types
============================================================================ */

export type PreviewMode = "dark" | "light";

export type PlaygroundComponentDesignControlsProps = {
    previewMode: PreviewMode;
    intent: Intent;
    variant: Variant;
    tone: Tone;
    glow: boolean | Glow;
    intensity: Intensity;
    toneStep: ToneStep;
    disabled: boolean;

    onPreviewModeChange: (value: PreviewMode) => void;
    onIntentChange: (value: Intent) => void;
    onVariantChange: (value: Variant) => void;
    onToneChange: (value: Tone) => void;
    onGlowChange: (value: boolean | Glow) => void;
    onIntensityChange: (value: Intensity) => void;
    onToneStepChange: (value: ToneStep) => void;
    onDisabledChange: (value: boolean) => void;

    showMode?: boolean;
    showIntent?: boolean;
    showVariant?: boolean;
    showTone?: boolean;
    showGlow?: boolean;
    showIntensity?: boolean;
    showToneStep?: boolean;
    showDisabled?: boolean;
};

/* ============================================================================
   Main
============================================================================ */

export function PlaygroundComponentDesignControls({
    previewMode,
    intent,
    variant,
    tone,
    glow,
    intensity,
    toneStep,
    disabled,
    onPreviewModeChange,
    onIntentChange,
    onVariantChange,
    onToneChange,
    onGlowChange,
    onIntensityChange,
    onToneStepChange,
    onDisabledChange,
    showMode = true,
    showIntent = true,
    showVariant = true,
    showTone = true,
    showGlow = true,
    showIntensity = true,
    showToneStep = true,
    showDisabled = true,
}: PlaygroundComponentDesignControlsProps) {
    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            onGlowChange(false);
        }
    }, [aestheticEnabled, glow, onGlowChange]);

    return (
        <>
            {showMode ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="Mode"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlSelect
                        value={previewMode}
                        onValueChange={(v) => onPreviewModeChange(v as PreviewMode)}
                        options={getMetaOptions(MODE)}
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="soft"
                        variant="flat"
                    />
                </IntentControlField>
            ) : null}

            {showIntent ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="Intent"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlSelect
                        value={intent}
                        onValueChange={(v) => onIntentChange(v as Intent)}
                        options={getMetaOptions(INTENT)}
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="soft"
                        variant="flat"
                    />
                </IntentControlField>
            ) : null}

            {showVariant ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="Variant"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlSelect
                        value={variant}
                        onValueChange={(v) => onVariantChange(v as Variant)}
                        options={getMetaOptions(VARIANT)}
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="soft"
                        variant="flat"
                    />
                </IntentControlField>
            ) : null}

            {showTone && toneEnabled ? (
                <IntentPickerTone
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                    value={tone}
                    onChange={(v) => onToneChange(v as Tone)}
                />
            ) : null}

            {showGlow && !toneEnabled ? (
                <IntentPickerGlow
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant={aestheticEnabled ? "flat" : "ghost"}
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
                        if (aestheticEnabled) {
                            onGlowChange(v as Glow);
                            return;
                        }

                        onGlowChange(v === true);
                    }}
                    pickerMode={aestheticEnabled ? "select" : "toggle"}
                />
            ) : null}

            {showIntensity ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="Intensity"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlSelect
                        value={intensity}
                        onValueChange={(v) => onIntensityChange(v as Intensity)}
                        options={getMetaOptions(INTENSITY)}
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="soft"
                        variant="flat"
                    />
                </IntentControlField>
            ) : null}

            {showToneStep ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="ToneStep"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlSelect
                        value={String(toneStep)}
                        onValueChange={(v) => onToneStepChange(Number(v) as ToneStep)}
                        options={getMetaOptions(TONE_STEP).map((option) => ({
                            ...option,
                            value: String(option.value),
                        }))}
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="soft"
                        variant="flat"
                    />
                </IntentControlField>
            ) : null}

            {showDisabled ? (
                <IntentControlField
                    intent="toned"
                    variant="ghost"
                    label="State"
                    optionalLabel=""
                    padded={false}
                >
                    <IntentControlToggle
                        checked={disabled}
                        onCheckedChange={onDisabledChange}
                        label="Disabled"
                        fullWidth
                        size="md"
                        intent="toned"
                        tone="neutral"
                        intensity="medium"
                        variant="ghost"
                    />
                </IntentControlField>
            ) : null}
        </>
    );
}

export default PlaygroundComponentDesignControls;
