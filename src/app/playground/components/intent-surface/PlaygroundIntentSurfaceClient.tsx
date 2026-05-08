"use client";

// src/app/playground/components/intent-surface/PlaygroundIntentSurfaceClient.tsx
// PlaygroundIntentSurfaceClient
// - Uses PlaygroundComponentShell to test IntentSurface
// - Uses DS exports: Identity + PropsTable
// - ✅ Updated for PlaygroundComponentShell split controls (dsControls / extraControls)
// - ✅ Adds previewMode toggle + codeString for the Code drawer

import React, { useMemo, useState } from "react";

import {
    IntentSurface,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,
    IntentSurfaceIdentity,
    IntentSurfacePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";
import PlaygroundComponentDesignControls from "../_components/PlaygroundComponentDesignControls";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentSurfaceClient() {
    // ✅ NEW: preview mode (drives shell tile bg + mode passed to the component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [disabled, setDisabled] = useState(false);

    // Playground-only (nice to have for Surface)
    const [padded, setPadded] = useState(true);
    const [withContent, setWithContent] = useState(true);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

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

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const dsControls = (
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
    );

    // const extraControls = (
    //     <>
    //         <SelectRow label="Content">
    //             <div className="space-y-2">
    //                 <CheckboxRow
    //                     label="withContent"
    //                     checked={withContent}
    //                     onChange={setWithContent}
    //                 />
    //                 <CheckboxRow label="padded" checked={padded} onChange={setPadded} />
    //             </div>

    //             <div className="mt-2 text-[11px] opacity-40">
    //                 <span className="font-mono">IntentSurface</span> est un host: tu peux y mettre
    //                 n’importe quel contenu. Ici on toggle juste padding + bloc de texte.
    //             </div>
    //         </SelectRow>
    //     </>
    // );

    // ✅ Code panel: copy/paste-ready snippet
    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const className = cn("w-full min-w-0 box-border rounded-2xl", padded ? "p-6" : "p-0");

        return `import React from "react";
import { IntentSurface } from "intent-design-system";

export function Example() {
  return (
    <IntentSurface
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      className="${className}"
    >
      <div className="text-sm font-semibold opacity-90">IntentSurface preview</div>
      <div className="mt-1 text-xs opacity-70">
        mode=<span className="font-mono">${previewMode}</span>, variant=
        <span className="font-mono"> ${variant}</span>, intent=
        <span className="font-mono"> ${intent}</span>
      </div>
    </IntentSurface>
  );
}`;
    }, [previewMode, intent, variant, tone, glow, intensity, disabled, padded]);

    return (
        <PlaygroundComponentShell
            identity={IntentSurfaceIdentity}
            propsTable={IntentSurfacePropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={null}
            warnings={resolvedWithWarnings.warnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <IntentSurface
                        {...dsInput}
                        mode={mode}
                        className={cn(
                            "w-full min-w-0 box-border rounded-2xl",
                            padded ? "p-6" : "p-0"
                        )}
                    >
                        {withContent ? (
                            <>
                                <div className="text-sm font-semibold opacity-90">
                                    IntentSurface preview
                                </div>

                                <div className="mt-1 text-xs opacity-70">
                                    mode=<span className="font-mono">{mode}</span>, variant=
                                    <span className="font-mono"> {variant}</span>, intent=
                                    <span className="font-mono"> {intent}</span>
                                </div>

                                <div className="mt-3 text-xs opacity-70">
                                    This block is inside{" "}
                                    <span className="font-mono">IntentSurface</span>. Glow stays
                                    clipped.
                                </div>
                            </>
                        ) : (
                            <div className="text-xs opacity-60">
                                (empty) Toggle <span className="font-mono">withContent</span> to
                                show sample content.
                            </div>
                        )}
                    </IntentSurface>
                </div>
            )}
        />
    );
}
