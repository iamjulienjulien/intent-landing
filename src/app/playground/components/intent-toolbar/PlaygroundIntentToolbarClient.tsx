"use client";

// src/app/playground/components/intent-toolbar/PlaygroundIntentToolbarClient.tsx
// PlaygroundIntentToolbarClient
// - Uses PlaygroundComponentShell to test IntentToolbar
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentToolbar,
    IntentIndicator,
    IntentControlButton,
    IntentControlInput,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    type ToneStep,

    // ✅ docs exports from DS
    IntentToolbarIdentity,
    IntentToolbarPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type ToolbarSize = "xs" | "sm" | "md" | "lg";
type ToolbarAlign = "start" | "center" | "end";
type ToolbarJustify = "between" | "start" | "center" | "end";
type ToolbarWrap = "wrap" | "nowrap";

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

export default function PlaygroundIntentToolbarClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [toneStep, setToneStep] = useState<ToneStep>(500);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [size, setSize] = useState<ToolbarSize>("md");
    const [align, setAlign] = useState<ToolbarAlign>("center");
    const [justify, setJustify] = useState<ToolbarJustify>("between");
    const [wrap, setWrap] = useState<ToolbarWrap>("wrap");

    const [fullWidth, setFullWidth] = useState(true);
    const [sticky, setSticky] = useState(false);
    const [stickyOffset, setStickyOffset] = useState(0);
    const [showDivider, setShowDivider] = useState(true);

    const [withLeft, setWithLeft] = useState(true);
    const [withCenter, setWithCenter] = useState(true);
    const [withRight, setWithRight] = useState(true);

    const [withTitleChip, setWithTitleChip] = useState(true);
    const [withSearch, setWithSearch] = useState(true);
    const [withActions, setWithActions] = useState(true);

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

    /* ============================================================================
       🧩 Slots (preview)
    ============================================================================ */

    const leftSlot = useMemo(() => {
        if (!withLeft) return undefined;

        return (
            <div className="flex items-center gap-3 min-w-0">
                {withTitleChip ? (
                    <IntentIndicator size="sm" dot>
                        Toolbar
                    </IntentIndicator>
                ) : null}
                <div className="min-w-0">
                    <div className="text-sm font-medium leading-tight truncate">Cockpit</div>
                    <div className="text-xs opacity-65 truncate">Filters · Actions · Search</div>
                </div>
            </div>
        );
    }, [withLeft, withTitleChip]);

    const centerSlot = useMemo(() => {
        if (!withCenter) return undefined;

        return withSearch ? (
            <div className="w-[min(420px,100%)]">
                <IntentControlInput
                    intent="informed"
                    variant="outlined"
                    mode={previewMode}
                    placeholder="Rechercher…"
                    aria-label="Search"
                />
            </div>
        ) : (
            <div className="text-xs opacity-70">Centre slot</div>
        );
    }, [withCenter, withSearch, previewMode]);

    const rightSlot = useMemo(() => {
        if (!withRight) return undefined;

        if (!withActions) {
            return (
                <IntentIndicator size="sm" dot>
                    Live
                </IntentIndicator>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <IntentIndicator size="sm" dot>
                    Live
                </IntentIndicator>

                <IntentControlButton
                    intent="empowered"
                    variant="elevated"
                    mode={previewMode}
                    size="sm"
                >
                    Appliquer
                </IntentControlButton>

                <IntentControlButton
                    intent="warned"
                    variant="outlined"
                    mode={previewMode}
                    size="sm"
                >
                    Reset
                </IntentControlButton>
            </div>
        );
    }, [withRight, withActions, previewMode]);

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
                    Référence canonique: <span className="font-mono">500</span>.
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
            <SelectRow label="Layout">
                <div className="space-y-3">
                    <Select
                        value={size}
                        onChange={(v) => setSize(v as ToolbarSize)}
                        options={["xs", "sm", "md", "lg"]}
                    />
                    <Select
                        value={align}
                        onChange={(v) => setAlign(v as ToolbarAlign)}
                        options={["start", "center", "end"]}
                    />
                    <Select
                        value={justify}
                        onChange={(v) => setJustify(v as ToolbarJustify)}
                        options={["between", "start", "center", "end"]}
                    />
                    <Select
                        value={wrap}
                        onChange={(v) => setWrap(v as ToolbarWrap)}
                        options={["wrap", "nowrap"]}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Options">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="sticky" checked={sticky} onChange={setSticky} />
                    <CheckboxRow
                        label="showDivider"
                        checked={showDivider}
                        onChange={setShowDivider}
                    />
                </div>
            </SelectRow>

            {sticky ? (
                <SelectRow label="Sticky offset (px)">
                    <Select
                        value={String(stickyOffset)}
                        onChange={(v) => setStickyOffset(Number(v))}
                        options={["0", "8", "12", "16", "24", "32", "48"]}
                    />
                </SelectRow>
            ) : null}

            <SelectRow label="Slots">
                <div className="space-y-2">
                    <CheckboxRow label="leftSlot" checked={withLeft} onChange={setWithLeft} />
                    <CheckboxRow label="centerSlot" checked={withCenter} onChange={setWithCenter} />
                    <CheckboxRow label="rightSlot" checked={withRight} onChange={setWithRight} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow
                        label="left: title chip"
                        checked={withTitleChip}
                        onChange={setWithTitleChip}
                    />
                    <CheckboxRow
                        label="center: search input"
                        checked={withSearch}
                        onChange={setWithSearch}
                    />
                    <CheckboxRow
                        label="right: actions"
                        checked={withActions}
                        onChange={setWithActions}
                    />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: la toolbar est une <span className="font-mono">surface</span> (glow-ready),
                et les éléments dedans peuvent être des <span className="font-mono">controls</span>{" "}
                avec leurs propres intents.
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

        const stickyLine = sticky ? `      sticky\n      stickyOffset={${stickyOffset}}\n` : "";

        const leftLine = withLeft
            ? `      leftSlot={(
        <div>
          <strong>Cockpit</strong>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Filters · Actions · Search</div>
        </div>
      )}\n`
            : "";

        const centerLine = withCenter
            ? `      centerSlot={<div style={{ width: "min(420px, 100%)" }}>…</div>}\n`
            : "";

        const rightLine = withRight
            ? `      rightSlot={<div style={{ display: "flex", gap: 8 }}>…</div>}\n`
            : "";

        return `import React from "react";
import { IntentToolbar } from "intent-design-system";

export function Example() {
  return (
    <IntentToolbar
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      toneStep={${toneStep}}
      disabled={${disabled}}
      size="${size}"
      align="${align}"
      justify="${justify}"
      wrap="${wrap}"
      fullWidth={${fullWidth}}
${stickyLine}      showDivider={${showDivider}}
${leftLine}${centerLine}${rightLine}    />
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
        align,
        justify,
        wrap,
        fullWidth,
        sticky,
        stickyOffset,
        showDivider,
        withLeft,
        withCenter,
        withRight,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentToolbarIdentity}
            propsTable={IntentToolbarPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className="w-full min-w-0">
                        <IntentToolbar
                            {...dsInput}
                            mode={mode}
                            size={size}
                            align={align}
                            justify={justify}
                            wrap={wrap}
                            fullWidth={fullWidth}
                            sticky={sticky}
                            stickyOffset={stickyOffset}
                            showDivider={showDivider}
                            leftSlot={leftSlot}
                            centerSlot={centerSlot}
                            rightSlot={rightSlot}
                        />
                    </div>

                    <div className="mt-3 text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, intent=
                        <span className="font-mono"> {intent}</span>, variant=
                        <span className="font-mono"> {variant}</span>, size=
                        <span className="font-mono"> {size}</span>, align=
                        <span className="font-mono"> {align}</span>, justify=
                        <span className="font-mono"> {justify}</span>, wrap=
                        <span className="font-mono"> {wrap}</span>
                        {sticky ? (
                            <>
                                , sticky=<span className="font-mono">true</span>, offset=
                                <span className="font-mono"> {stickyOffset}</span>
                            </>
                        ) : null}
                        {showDivider ? (
                            <>
                                , divider=<span className="font-mono">true</span>
                            </>
                        ) : null}
                        {disabled ? (
                            <>
                                , disabled=<span className="font-mono">true</span>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        />
    );
}
