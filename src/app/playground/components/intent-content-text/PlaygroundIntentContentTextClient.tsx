"use client";

// src/app/playground/components/intent-content-text/PlaygroundIntentContentTextClient.tsx
// PlaygroundIntentContentTextClient
// - Uses PlaygroundComponentShell to test IntentContentText
// - Uses DS exports: Identity + PropsTable
// - Reuses PlaygroundComponentDesignControls for shared IDS props
// - Adds text-specific controls for typography / gradient / glow text

import React, { useMemo, useState } from "react";

import {
    IntentContentText,
    IntentContentTextIdentity,
    IntentContentTextPropsTable,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,
    type IntentContentTextSize,
    type IntentContentTextWeight,
    type IntentContentTextAlign,
    type IntentContentTextWrap,
    IntentControlField,
    IntentControlSelect,
    IntentControlToggle,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";
import {
    PlaygroundComponentDesignControls,
    type PreviewMode,
} from "../_components/PlaygroundComponentDesignControls";

/* ============================================================================
   Helpers
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const SIZE_OPTIONS = [
    { value: "xs", label: "XS" },
    { value: "sm", label: "SM" },
    { value: "md", label: "MD" },
    { value: "lg", label: "LG" },
    { value: "xl", label: "XL" },
    { value: "2xl", label: "2XL" },
    { value: "3xl", label: "3XL" },
] as const;

const WEIGHT_OPTIONS = [
    { value: "regular", label: "Regular" },
    { value: "medium", label: "Medium" },
    { value: "semibold", label: "Semibold" },
    { value: "bold", label: "Bold" },
] as const;

const ALIGN_OPTIONS = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
] as const;

const WRAP_OPTIONS = [
    { value: "normal", label: "Normal" },
    { value: "pretty", label: "Pretty" },
    { value: "nowrap", label: "No wrap" },
] as const;

const TAG_OPTIONS = [
    { value: "span", label: "span" },
    { value: "p", label: "p" },
    { value: "div", label: "div" },
    { value: "strong", label: "strong" },
    { value: "h3", label: "h3" },
    { value: "h2", label: "h2" },
] as const;

const GRADIENT_OPTIONS = [
    { value: "auto", label: "Auto" },
    { value: "true", label: "True" },
    { value: "false", label: "False" },
] as const;

/* ============================================================================
   Main
============================================================================ */

export default function PlaygroundIntentContentTextClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("glowed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>("aurora");
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [disabled, setDisabled] = useState(false);

    const [as, setAs] = useState<"span" | "p" | "div" | "strong" | "h3" | "h2">("h2");
    const [size, setSize] = useState<IntentContentTextSize>("2xl");
    const [weight, setWeight] = useState<IntentContentTextWeight>("bold");
    const [align, setAlign] = useState<IntentContentTextAlign>("left");
    const [wrap, setWrap] = useState<IntentContentTextWrap>("pretty");

    const [gradient, setGradient] = useState<"auto" | boolean>("auto");
    const [glowText, setGlowText] = useState(true);
    const [muted, setMuted] = useState(false);
    const [truncate, setTruncate] = useState(false);
    const [balance, setBalance] = useState(true);
    const [mono, setMono] = useState(false);
    const [italic, setItalic] = useState(false);
    const [inline, setInline] = useState(false);
    const [selectable, setSelectable] = useState(true);

    const [leadingIcon, setLeadingIcon] = useState(true);
    const [trailingIcon, setTrailingIcon] = useState(false);

    const [contentMode, setContentMode] = useState<"title" | "paragraph" | "label">("title");

    React.useEffect(() => {
        if (contentMode === "title") {
            setAs("h2");
            setSize("2xl");
            setWeight("bold");
            setWrap("pretty");
            setBalance(true);
            setInline(false);
        }

        if (contentMode === "paragraph") {
            setAs("p");
            setSize("md");
            setWeight("medium");
            setWrap("pretty");
            setBalance(false);
            setInline(false);
        }

        if (contentMode === "label") {
            setAs("span");
            setSize("sm");
            setWeight("semibold");
            setWrap("nowrap");
            setBalance(false);
            setInline(true);
        }
    }, [contentMode]);

    const dsInput = useMemo(() => {
        return {
            mode: previewMode,
            intent,
            variant,
            tone: intent === "toned" ? tone : undefined,
            glow:
                intent === "glowed"
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
    }, [previewMode, intent, variant, tone, glow, intensity, toneStep, disabled]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const gradientValue = gradient === "auto" ? "auto" : gradient ? "true" : "false";

    const previewText = useMemo(() => {
        if (contentMode === "paragraph") {
            return "Les nouvelles auras du système intent transforment maintenant le texte en matière lumineuse. Chaque glow peut devenir une encre vivante, narrative, presque stellaire.";
        }

        if (contentMode === "label") {
            return "Aurora signal";
        }

        return "IntentContentText";
    }, [contentMode]);

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const leadingIconLine = leadingIcon ? `      leadingIcon={<span>✦</span>}\n` : "";
        const trailingIconLine = trailingIcon ? `      trailingIcon={<span>✦</span>}\n` : "";

        return `import React from "react";
import { IntentContentText } from "intent-design-system";

export function Example() {
  return (
    <IntentContentText
      as="${as}"
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      size="${size}"
      weight="${weight}"
      align="${align}"
      wrap="${wrap}"
      gradient={${gradient === "auto" ? `"auto"` : gradient ? "true" : "false"}}
      glowText={${glowText}}
      muted={${muted}}
      truncate={${truncate}}
      balance={${balance}}
      mono={${mono}}
      italic={${italic}}
      inline={${inline}}
      selectable={${selectable}}
      disabled={${disabled}}
${leadingIconLine}${trailingIconLine}    >
      ${JSON.stringify(previewText)}
    </IntentContentText>
  );
}`;
    }, [
        as,
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        size,
        weight,
        align,
        wrap,
        gradient,
        glowText,
        muted,
        truncate,
        balance,
        mono,
        italic,
        inline,
        selectable,
        disabled,
        leadingIcon,
        trailingIcon,
        previewText,
    ]);

    const extraControls = (
        <>
            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Preset"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={contentMode}
                    onValueChange={(v) => setContentMode(v as "title" | "paragraph" | "label")}
                    options={[
                        { value: "title", label: "Title" },
                        { value: "paragraph", label: "Paragraph" },
                        { value: "label", label: "Label" },
                    ]}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Tag"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={as}
                    onValueChange={(v) => setAs(v as "span" | "p" | "div" | "strong" | "h3" | "h2")}
                    options={TAG_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Size"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={size}
                    onValueChange={(v) => setSize(v as IntentContentTextSize)}
                    options={SIZE_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Weight"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={weight}
                    onValueChange={(v) => setWeight(v as IntentContentTextWeight)}
                    options={WEIGHT_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Align"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={align}
                    onValueChange={(v) => setAlign(v as IntentContentTextAlign)}
                    options={ALIGN_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Wrap"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={wrap}
                    onValueChange={(v) => setWrap(v as IntentContentTextWrap)}
                    options={WRAP_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Gradient"
                optionalLabel=""
                padded={false}
            >
                <IntentControlSelect
                    value={gradientValue}
                    onValueChange={(v) => {
                        if (v === "auto") {
                            setGradient("auto");
                            return;
                        }

                        setGradient(v === "true");
                    }}
                    options={GRADIENT_OPTIONS.map((item) => ({
                        value: item.value,
                        label: item.label,
                    }))}
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="soft"
                    variant="flat"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Glow text"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={glowText}
                    onCheckedChange={setGlowText}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Muted"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={muted}
                    onCheckedChange={setMuted}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Truncate"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={truncate}
                    onCheckedChange={setTruncate}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Balance"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={balance}
                    onCheckedChange={setBalance}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Inline"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={inline}
                    onCheckedChange={setInline}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Selectable"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={selectable}
                    onCheckedChange={setSelectable}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Mono"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={mono}
                    onCheckedChange={setMono}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Italic"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={italic}
                    onCheckedChange={setItalic}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Leading icon"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={leadingIcon}
                    onCheckedChange={setLeadingIcon}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>

            <IntentControlField
                intent="toned"
                variant="ghost"
                label="Trailing icon"
                optionalLabel=""
                padded={false}
            >
                <IntentControlToggle
                    checked={trailingIcon}
                    onCheckedChange={setTrailingIcon}
                    label="Enabled"
                    fullWidth
                    size="md"
                    intent="toned"
                    tone="neutral"
                    intensity="medium"
                    variant="ghost"
                />
            </IntentControlField>
        </>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentContentTextIdentity}
            propsTable={IntentContentTextPropsTable}
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
                />
            }
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            // resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-6">
                    <div className="rounded-2xl p-6 ring-1 ring-white/10 bg-black/20">
                        <IntentContentText
                            {...dsInput}
                            mode={mode}
                            as={as}
                            size={size}
                            weight={weight}
                            align={align}
                            wrap={wrap}
                            gradient={gradient}
                            glowText={glowText}
                            muted={muted}
                            truncate={truncate}
                            balance={balance}
                            mono={mono}
                            italic={italic}
                            inline={inline}
                            selectable={selectable}
                            leadingIcon={leadingIcon ? <span>✦</span> : undefined}
                            trailingIcon={trailingIcon ? <span>✦</span> : undefined}
                            className={cn(truncate && "max-w-[16rem]")}
                        >
                            {previewText}
                        </IntentContentText>

                        {/* <div className="mt-4 text-xs opacity-60 space-y-1">
                            <div>
                                mode=<span className="font-mono">{mode}</span>, intent=
                                <span className="font-mono"> {intent}</span>, variant=
                                <span className="font-mono"> {variant}</span>
                            </div>
                            <div>
                                size=<span className="font-mono">{size}</span>, weight=
                                <span className="font-mono"> {weight}</span>, gradient=
                                <span className="font-mono"> {String(gradient)}</span>, glowText=
                                <span className="font-mono"> {String(glowText)}</span>
                            </div>
                        </div> */}
                    </div>

                    {/* <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl p-5 ring-1 ring-white/10 bg-black/20">
                            <IntentContentText
                                {...dsInput}
                                mode={mode}
                                as="h3"
                                size="lg"
                                weight="bold"
                                gradient="auto"
                                glowText={false}
                            >
                                Secondary example
                            </IntentContentText>

                            <IntentContentText
                                {...dsInput}
                                mode={mode}
                                as="p"
                                size="sm"
                                weight="medium"
                                muted
                                className="mt-2"
                            >
                                A smaller narrative block using the same resolved intent palette.
                            </IntentContentText>
                        </div>

                        <div className="rounded-2xl p-5 ring-1 ring-white/10 bg-black/20">
                            <IntentContentText
                                {...dsInput}
                                mode={mode}
                                as="span"
                                size="sm"
                                weight="semibold"
                                wrap="nowrap"
                                inline
                                leadingIcon={<span>◎</span>}
                            >
                                Compact label sample
                            </IntentContentText>

                            <div className="mt-3">
                                <IntentContentText
                                    {...dsInput}
                                    mode={mode}
                                    as="p"
                                    size="md"
                                    italic
                                    gradient={false}
                                >
                                    Sometimes the best spell is simply well-dressed plain text.
                                </IntentContentText>
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
        />
    );
}
