"use client";

// src/app/playground/components/intent-journey/PlaygroundIntentJourneyClient.tsx
// PlaygroundIntentJourneyClient
// - Uses PlaygroundComponentShell to test IntentJourney
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentJourney,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentJourneyIdentity,
    IntentJourneyPropsTable,
    type IntentJourneyStep,
    type IntentJourneyStepStatus,
    type IntentJourneySize,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type Orientation = "vertical" | "horizontal";

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

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full",
                "px-2 py-1 text-[11px] leading-none",
                "bg-white/7 ring-1 ring-white/10 opacity-80"
            )}
        >
            {children}
        </span>
    );
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentJourneyClient() {
    // Preview mode (controls preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS intent props
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");
    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Journey local props
    const [orientation, setOrientation] = useState<Orientation>("vertical");
    const [size, setSize] = useState<IntentJourneySize>("md");
    const [compact, setCompact] = useState(false);

    const [clickable, setClickable] = useState(true);
    const [showIndex, setShowIndex] = useState(true);
    const [showRail, setShowRail] = useState(true);

    const [withDescriptions, setWithDescriptions] = useState(true);
    const [withIcons, setWithIcons] = useState(false);
    const [withRightMeta, setWithRightMeta] = useState(true);

    // Step statuses (playground knobs)
    const [s1, setS1] = useState<IntentJourneyStepStatus>("done");
    const [s2, setS2] = useState<IntentJourneyStepStatus>("current");
    const [s3, setS3] = useState<IntentJourneyStepStatus>("upcoming");
    const [s4, setS4] = useState<IntentJourneyStepStatus>("disabled");

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

    const steps: IntentJourneyStep[] = useMemo(() => {
        const base = [
            {
                id: "step-1",
                label: "Éveil",
                description: "Le point de départ: clarifier l’intention.",
                status: s1,
            },
            {
                id: "step-2",
                label: "Rituel",
                description: "Consolider une cadence, réduire le bruit.",
                status: s2,
            },
            {
                id: "step-3",
                label: "Traverse",
                description: "Accélérer sans se cramer.",
                status: s3,
            },
            {
                id: "step-4",
                label: "Couronne",
                description: "Stabiliser, livrer, puis recommencer mieux.",
                status: s4,
            },
        ] as const;

        const iconFor = (id: string) => {
            if (!withIcons) return undefined;
            if (id === "step-1") return <span aria-hidden>🌱</span>;
            if (id === "step-2") return <span aria-hidden>🧭</span>;
            if (id === "step-3") return <span aria-hidden>🗺️</span>;
            return <span aria-hidden>🏁</span>;
        };

        const metaFor = (status: IntentJourneyStepStatus) => {
            if (!withRightMeta) return undefined;

            if (status === "done") return <Pill>Done</Pill>;
            if (status === "current") return <Pill>Now</Pill>;
            if (status === "disabled") return <Pill>Locked</Pill>;
            return <Pill>Next</Pill>;
        };

        return base.map((s, idx) => ({
            ...s,
            description: withDescriptions ? s.description : undefined,
            leftIcon: iconFor(s.id),
            rightMeta: metaFor(s.status),
            onSelect: () => {
                // no-op here; handled by controlled activeId in preview
                // but leaving it to demonstrate hook
                // eslint-disable-next-line no-console
                console.log("Selected step", idx + 1, s.id);
            },
        }));
    }, [s1, s2, s3, s4, withDescriptions, withIcons, withRightMeta]);

    // For preview: drive activeId from the first step with status=current, else keep local state
    const defaultActiveFromStatuses = useMemo(() => {
        const current = steps.find((s) => (s.status ?? "upcoming") === "current");
        return current?.id ?? steps[0]?.id ?? "step-1";
    }, [steps]);

    const [activeId, setActiveId] = useState<string>(defaultActiveFromStatuses);

    React.useEffect(() => {
        setActiveId(defaultActiveFromStatuses);
    }, [defaultActiveFromStatuses]);

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
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

    const controlsLocal = (
        <>
            <SelectRow label="Layout">
                <div className="space-y-2">
                    <Select
                        value={orientation}
                        onChange={(v) => setOrientation(v as Orientation)}
                        options={["vertical", "horizontal"]}
                    />
                    <Select
                        value={size}
                        onChange={(v) => setSize(v as IntentJourneySize)}
                        options={["xs", "sm", "md", "lg"]}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Flags">
                <div className="space-y-2">
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                    <CheckboxRow label="clickable" checked={clickable} onChange={setClickable} />
                    <CheckboxRow label="showIndex" checked={showIndex} onChange={setShowIndex} />
                    <CheckboxRow label="showRail" checked={showRail} onChange={setShowRail} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow
                        label="withDescriptions"
                        checked={withDescriptions}
                        onChange={setWithDescriptions}
                    />
                    <CheckboxRow label="withIcons" checked={withIcons} onChange={setWithIcons} />
                    <CheckboxRow
                        label="withRightMeta"
                        checked={withRightMeta}
                        onChange={setWithRightMeta}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Si <span className="font-mono">withIcons=true</span>,{" "}
                    <span className="font-mono">showIndex</span> ne sert que pour les étapes sans
                    icône.
                </div>
            </SelectRow>

            <SelectRow label="Step statuses">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">step-1</div>
                        <Select
                            value={s1}
                            onChange={(v) => setS1(v as IntentJourneyStepStatus)}
                            options={["done", "current", "upcoming", "disabled"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">step-2</div>
                        <Select
                            value={s2}
                            onChange={(v) => setS2(v as IntentJourneyStepStatus)}
                            options={["done", "current", "upcoming", "disabled"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">step-3</div>
                        <Select
                            value={s3}
                            onChange={(v) => setS3(v as IntentJourneyStepStatus)}
                            options={["done", "current", "upcoming", "disabled"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">step-4</div>
                        <Select
                            value={s4}
                            onChange={(v) => setS4(v as IntentJourneyStepStatus)}
                            options={["done", "current", "upcoming", "disabled"]}
                        />
                    </div>
                </div>

                <div className="mt-2 text-[11px] opacity-55">
                    Astuce: mets exactement <span className="font-mono">1 step</span> en{" "}
                    <span className="font-mono">current</span> pour que le focus/active se recale
                    proprement.
                </div>
            </SelectRow>

            <SelectRow label="Active (controlled)">
                <Select
                    value={activeId}
                    onChange={(v) => setActiveId(v)}
                    options={steps.map((s) => s.id)}
                />
            </SelectRow>
        </>
    );

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const stepsLiteral = steps
            .map((s) => {
                const status = (s.status ?? "upcoming") as IntentJourneyStepStatus;
                const desc = s.description ? `      description: "${s.description}",\n` : "";
                const icon =
                    withIcons && s.leftIcon
                        ? `      leftIcon: <span aria-hidden>${String(
                              (s.leftIcon as any)?.props?.children ?? ""
                          )}</span>,\n`
                        : "";
                const meta = withRightMeta
                    ? `      rightMeta: <span className="text-xs opacity-70">${status}</span>,\n`
                    : "";
                return `    {
      id: "${s.id}",
      label: "${s.label}",
${desc}      status: "${status}",
${icon}${meta}    }`;
            })
            .join(",\n");

        return `import * as React from "react";
import { IntentJourney } from "intent-design-system";

export function Example() {
  const [activeId, setActiveId] = React.useState("${activeId}");

  const steps = [
${stepsLiteral}
  ];

  return (
    <IntentJourney
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      steps={steps}
      orientation="${orientation}"
      size="${size}"
      compact={${compact}}
      clickable={${clickable}}
      showIndex={${showIndex}}
      showRail={${showRail}}
      activeId={activeId}
      onActiveChange={setActiveId}
    />
  );
}`;
    }, [
        activeId,
        previewMode,
        intent,
        variant,
        tone,
        glow,
        intensity,
        disabled,
        steps,
        orientation,
        size,
        compact,
        clickable,
        showIndex,
        showRail,
        withIcons,
        withRightMeta,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentJourneyIdentity}
            propsTable={IntentJourneyPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            previewExpandable
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div
                        className={cn(
                            "w-full min-w-0",
                            orientation === "horizontal" ? "flex items-start" : ""
                        )}
                    >
                        <IntentJourney
                            {...dsInput}
                            mode={mode}
                            steps={steps}
                            orientation={orientation}
                            size={size}
                            compact={compact}
                            clickable={clickable}
                            showIndex={showIndex}
                            showRail={showRail}
                            activeId={activeId}
                            onActiveChange={setActiveId}
                        />
                    </div>

                    <div className="mt-5 text-[11px] opacity-55">
                        ⌨️ Navigation: <span className="font-mono">↑/↓</span> (vertical) ou{" "}
                        <span className="font-mono">←/→</span> (horizontal),{" "}
                        <span className="font-mono">Home/End</span>,{" "}
                        <span className="font-mono">Enter</span>.
                    </div>
                </div>
            )}
        />
    );
}
