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
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentSurfaceIdentity,
    IntentSurfacePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

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

export default function PlaygroundIntentSurfaceClient() {
    // ✅ NEW: preview mode (drives shell tile bg + mode passed to the component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Playground-only (nice to have for Surface)
    const [padded, setPadded] = useState(true);
    const [withContent, setWithContent] = useState(true);

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
        disabled,
    ]);

    const resolvedWithWarnings = useMemo(() => resolveIntentWithWarnings(dsInput), [dsInput]);

    const glowOptions = aestheticEnabled
        ? (["aurora", "ember", "cosmic", "mythic", "royal", "mono"] as const)
        : (["false", "true"] as const);

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const dsControls = (
        <>
            <SelectRow label="Mode">
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
            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow
                        label="withContent"
                        checked={withContent}
                        onChange={setWithContent}
                    />
                    <CheckboxRow label="padded" checked={padded} onChange={setPadded} />
                </div>

                <div className="mt-2 text-[11px] opacity-40">
                    <span className="font-mono">IntentSurface</span> est un host: tu peux y mettre
                    n’importe quel contenu. Ici on toggle juste padding + bloc de texte.
                </div>
            </SelectRow>
        </>
    );

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
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
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
