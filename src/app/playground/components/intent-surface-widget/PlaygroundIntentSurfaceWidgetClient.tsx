"use client";

// src/app/playground/components/intent-surface-widget/PlaygroundIntentSurfaceWidgetClient.tsx
// PlaygroundIntentSurfaceWidgetClient
// - Uses PlaygroundComponentShell to test IntentSurfaceWidget
// - Uses DS exports: Identity + PropsTable
// - Mock theme: Game of Thrones widget
// - Covers compact header, badges/actions, collapsible + dismissible
// - ✅ Updated for PlaygroundComponentShell split controls (dsControls / extraControls)
// - ✅ Adds previewMode toggle + codeString for the Code drawer

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentSurfaceWidget,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentSurfaceWidgetIdentity,
    IntentSurfaceWidgetPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type WidgetRadius = "lg" | "xl" | "2xl";
type WidgetPadding = "none" | "xs" | "sm" | "md";
type HeaderAlign = "start" | "center";
type HeaderMode = "auto" | "custom";

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
   🐺 GOT MOCKS
============================================================================ */

const HOUSE_OPTIONS = [
    {
        key: "stark",
        emoji: "🐺",
        title: "Maison Stark",
        subtitle: "Wardens of the North · Winter is Coming",
        eyebrow: "Nord",
        badge: "Winterfell",
        meta: "Saison 1",
        statA: "18 banners",
        statB: "6 allies",
        statC: "North loyalty",
        statValue: "92%",
        bodyText:
            "Une maison ancienne, rugueuse comme le vent du Nord, structurée par l’honneur, la mémoire et la survie.",
        chips: ["Loyal", "Ancient", "Northern"],
    },
    {
        key: "targaryen",
        emoji: "🐉",
        title: "Maison Targaryen",
        subtitle: "Blood of the dragon · Fire and Blood",
        eyebrow: "Valyria",
        badge: "Dragonstone",
        meta: "Saison 7",
        statA: "3 dragons",
        statB: "2 claims",
        statC: "Conquest pressure",
        statValue: "88%",
        bodyText:
            "Une dynastie de feu et de cendres, nourrie par l’héritage, la prophétie et une volonté implacable de reconquête.",
        chips: ["Fire", "Legacy", "Claim"],
    },
    {
        key: "lannister",
        emoji: "🦁",
        title: "Maison Lannister",
        subtitle: "Hear Me Roar · Wealth and leverage",
        eyebrow: "Ouest",
        badge: "Casterly Rock",
        meta: "Saison 3",
        statA: "Gold reserves",
        statB: "4 intrigues",
        statC: "Court influence",
        statValue: "81%",
        bodyText:
            "Une puissance dorée, polie comme une lame fine, experte en alliances, dettes, apparences et coups d’avance.",
        chips: ["Power", "Gold", "Intrigue"],
    },
] as const;

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentSurfaceWidgetClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [houseKey, setHouseKey] = useState<(typeof HOUSE_OPTIONS)[number]["key"]>("stark");

    const [fullWidth, setFullWidth] = useState(true);
    const [padded, setPadded] = useState<WidgetPadding>("sm");
    const [bleed, setBleed] = useState(false);
    const [radius, setRadius] = useState<WidgetRadius>("xl");
    const [headerAlign, setHeaderAlign] = useState<HeaderAlign>("center");
    const [headerDivider, setHeaderDivider] = useState(true);
    const [footerDivider, setFooterDivider] = useState(true);
    const [bodyScrollable, setBodyScrollable] = useState(false);
    const [minBodyHeight, setMinBodyHeight] = useState(true);

    const [interactive, setInteractive] = useState(false);
    const [pressed, setPressed] = useState(false);

    const [withHeader, setWithHeader] = useState(true);
    const [headerMode, setHeaderMode] = useState<HeaderMode>("auto");
    const [withFooter, setWithFooter] = useState(true);

    const [collapsible, setCollapsible] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [keepMountedWhenCollapsed, setKeepMountedWhenCollapsed] = useState(true);

    const [dismissible, setDismissible] = useState(true);
    const [dismissed, setDismissed] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
    }, [aestheticEnabled, glow]);

    const activeHouse = useMemo(() => {
        return HOUSE_OPTIONS.find((house) => house.key === houseKey) ?? HOUSE_OPTIONS[0];
    }, [houseKey]);

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
                        if (aestheticEnabled) {
                            setGlow(v as Glow);
                            return;
                        }
                        setGlow(v === "true");
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
            <SelectRow label="Theme">
                <Select
                    value={houseKey}
                    onChange={(v) => setHouseKey(v as (typeof HOUSE_OPTIONS)[number]["key"])}
                    options={HOUSE_OPTIONS.map((house) => house.key)}
                />
            </SelectRow>

            <SelectRow label="Widget">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="bleed" checked={bleed} onChange={setBleed} />
                    <CheckboxRow
                        label="headerDivider"
                        checked={headerDivider}
                        onChange={setHeaderDivider}
                    />
                    <CheckboxRow
                        label="footerDivider"
                        checked={footerDivider}
                        onChange={setFooterDivider}
                    />
                    <CheckboxRow
                        label="bodyScrollable"
                        checked={bodyScrollable}
                        onChange={setBodyScrollable}
                    />
                    <CheckboxRow
                        label="minBodyHeight"
                        checked={minBodyHeight}
                        onChange={setMinBodyHeight}
                    />
                    <CheckboxRow
                        label="interactive"
                        checked={interactive}
                        onChange={setInteractive}
                    />
                    <CheckboxRow label="pressed" checked={pressed} onChange={setPressed} />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Padding</div>
                    <Select
                        value={padded}
                        onChange={(v) => setPadded(v as WidgetPadding)}
                        options={["none", "xs", "sm", "md"]}
                    />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Radius</div>
                    <Select
                        value={radius}
                        onChange={(v) => setRadius(v as WidgetRadius)}
                        options={["lg", "xl", "2xl"]}
                    />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Header align</div>
                    <Select
                        value={headerAlign}
                        onChange={(v) => setHeaderAlign(v as HeaderAlign)}
                        options={["center", "start"]}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Structure">
                <div className="space-y-2">
                    <CheckboxRow label="withHeader" checked={withHeader} onChange={setWithHeader} />
                    <CheckboxRow label="withFooter" checked={withFooter} onChange={setWithFooter} />
                </div>

                {withHeader ? (
                    <div className="mt-3 space-y-2">
                        <div className="text-[11px] opacity-40">Header mode</div>
                        <Select
                            value={headerMode}
                            onChange={(v) => setHeaderMode(v as HeaderMode)}
                            options={["auto", "custom"]}
                        />
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Collapse / Dismiss">
                <div className="space-y-2">
                    <CheckboxRow
                        label="collapsible"
                        checked={collapsible}
                        onChange={setCollapsible}
                    />
                    <CheckboxRow label="collapsed" checked={collapsed} onChange={setCollapsed} />
                    <CheckboxRow
                        label="keepMountedWhenCollapsed"
                        checked={keepMountedWhenCollapsed}
                        onChange={setKeepMountedWhenCollapsed}
                    />
                    <CheckboxRow
                        label="dismissible"
                        checked={dismissible}
                        onChange={setDismissible}
                    />
                    <CheckboxRow label="dismissed" checked={dismissed} onChange={setDismissed} />
                </div>

                {dismissed ? (
                    <button
                        type="button"
                        onClick={() => setDismissed(false)}
                        className="mt-3 rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
                    >
                        Reset widget
                    </button>
                ) : null}
            </SelectRow>
        </>
    );

    /* ============================================================================
       ✅ Code panel snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const headerBlock = !withHeader
            ? ""
            : headerMode === "custom"
              ? `      header={
        <div className="flex items-start justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <div className="text-xs tracking-[0.18em] opacity-60">${activeHouse.eyebrow}</div>
            <div className="mt-1 text-sm font-semibold opacity-90">${activeHouse.title}</div>
            <div className="mt-1 text-xs opacity-70">${activeHouse.subtitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
              ${activeHouse.badge}
            </span>
          </div>
        </div>
      }\n`
              : `      emoji="${activeHouse.emoji}"\n      eyebrow="${activeHouse.eyebrow}"\n      title="${activeHouse.title}"\n      subtitle="${activeHouse.subtitle}"\n      badges={
        <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
          ${activeHouse.badge}
        </span>
      }\n      meta={<span className="text-[11px] opacity-70">${activeHouse.meta}</span>}\n      actions={
        <button className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85">
          Open
        </button>
      }\n`;

        const footerBlock = withFooter
            ? `      footer={
        <div className="flex items-center justify-between gap-3 text-xs opacity-70">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
              ${activeHouse.chips[0]}
            </span>
            <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
              ${activeHouse.chips[1]}
            </span>
          </div>
          <button className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85">
            View house
          </button>
        </div>
      }\n`
            : "";

        return `import React from "react";
import { IntentSurfaceWidget } from "intent-design-system";

export function Example() {
    return (
        <IntentSurfaceWidget
            mode="${previewMode}"
            intent="${intent}"
            variant="${variant}"
${toneLine}${glowLine}            intensity="${intensity}"
            disabled={${disabled}}
            fullWidth={${fullWidth}}
            padded="${padded}"
            bleed={${bleed}}
            radius="${radius}"
            headerAlign="${headerAlign}"
            headerDivider={${headerDivider}}
            footerDivider={${footerDivider}}
            bodyScrollable={${bodyScrollable}}
            minBodyHeight={${minBodyHeight ? 220 : "undefined"}}
            interactive={${interactive}}
            pressed={${pressed}}
            collapsible={${collapsible}}
            collapsed={${collapsed}}
            keepMountedWhenCollapsed={${keepMountedWhenCollapsed}}
            dismissible={${dismissible}}
            dismissed={${dismissed}}
${headerBlock}${footerBlock}        >
            <div className="space-y-3">
                <div className="text-sm font-semibold opacity-90">${activeHouse.title}</div>
                <div className="text-xs opacity-70">${activeHouse.bodyText}</div>
            </div>
        </IntentSurfaceWidget>
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
        fullWidth,
        padded,
        bleed,
        radius,
        headerAlign,
        headerDivider,
        footerDivider,
        bodyScrollable,
        minBodyHeight,
        interactive,
        pressed,
        collapsible,
        collapsed,
        keepMountedWhenCollapsed,
        dismissible,
        dismissed,
        withHeader,
        headerMode,
        withFooter,
        activeHouse,
    ]);

    /* ============================================================================
       🎛 Header / Footer nodes
    ============================================================================ */

    const headerProps = !withHeader
        ? {}
        : headerMode === "custom"
          ? {
                header: (
                    <div className="flex items-start justify-between gap-4 min-w-0">
                        <div className="min-w-0">
                            <div className="text-xs tracking-[0.18em] opacity-60">
                                {activeHouse.eyebrow}
                            </div>
                            <div className="mt-1 text-sm font-semibold opacity-90">
                                {activeHouse.title}
                            </div>
                            <div className="mt-1 text-xs opacity-70">{activeHouse.subtitle}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
                                {activeHouse.badge}
                            </span>
                            <button
                                type="button"
                                className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
                            >
                                Open
                            </button>
                        </div>
                    </div>
                ),
            }
          : {
                emoji: activeHouse.emoji,
                eyebrow: activeHouse.eyebrow,
                title: activeHouse.title,
                subtitle: activeHouse.subtitle,
                badges: (
                    <span className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85">
                        {activeHouse.badge}
                    </span>
                ),
                meta: <span className="text-[11px] opacity-70">{activeHouse.meta}</span>,
                actions: (
                    <button
                        type="button"
                        className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
                        aria-label="Open house details"
                    >
                        Open
                    </button>
                ),
            };

    const footerNode = withFooter ? (
        <div className="flex items-center justify-between gap-3 text-xs opacity-70">
            <div className="flex items-center gap-2 flex-wrap">
                {activeHouse.chips.map((chip) => (
                    <span
                        key={chip}
                        className="rounded-full px-2 py-1 text-[11px] ring-1 ring-white/10 opacity-85"
                    >
                        {chip}
                    </span>
                ))}
            </div>

            <button
                type="button"
                className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
            >
                View house
            </button>
        </div>
    ) : null;

    const previewBody = dismissed ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center">
            <div className="text-sm font-semibold opacity-90">Widget dismissed</div>
            <div className="mt-2 text-xs opacity-65">
                Le composant retourne <span className="font-mono">null</span> quand{" "}
                <span className="font-mono">dismissed=true</span>.
            </div>
            <button
                type="button"
                onClick={() => setDismissed(false)}
                className="mt-4 rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 opacity-85"
            >
                Restore widget
            </button>
        </div>
    ) : (
        <IntentSurfaceWidget
            {...dsInput}
            mode={previewMode}
            fullWidth={fullWidth}
            padded={padded}
            bleed={bleed}
            radius={radius}
            headerAlign={headerAlign}
            headerDivider={headerDivider}
            footerDivider={footerDivider}
            bodyScrollable={bodyScrollable}
            minBodyHeight={minBodyHeight ? 220 : undefined}
            interactive={interactive}
            pressed={pressed}
            collapsible={collapsible}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            keepMountedWhenCollapsed={keepMountedWhenCollapsed}
            dismissible={dismissible}
            dismissed={dismissed}
            onDismissedChange={setDismissed}
            footer={footerNode}
            {...(headerProps as any)}
            className={cn("w-full min-w-0")}
        >
            <div className="space-y-4">
                <div>
                    <div className="text-sm font-semibold opacity-90">House summary</div>
                    <div className="mt-1 text-xs opacity-70">{activeHouse.bodyText}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                        <div className="text-[11px] tracking-[0.18em] opacity-55">STRENGTH</div>
                        <div className="mt-2 text-sm font-semibold opacity-90">
                            {activeHouse.statA}
                        </div>
                        <div className="mt-1 text-[11px] opacity-60">{activeHouse.statC}</div>
                    </div>

                    <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                        <div className="text-[11px] tracking-[0.18em] opacity-55">NETWORK</div>
                        <div className="mt-2 text-sm font-semibold opacity-90">
                            {activeHouse.statB}
                        </div>
                        <div className="mt-1 text-[11px] opacity-60">
                            Influence score {activeHouse.statValue}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/20">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="text-[11px] tracking-[0.18em] opacity-55">BANNERS</div>
                            <div className="mt-2 text-sm font-semibold opacity-90">
                                Oath and memory
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-semibold opacity-90">
                                {activeHouse.statValue}
                            </div>
                            <div className="text-[11px] opacity-60">readiness</div>
                        </div>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-white/60"
                            style={{ width: activeHouse.statValue }}
                        />
                    </div>
                </div>

                <div className="text-[11px] opacity-55">
                    Tip: Widget = un module de dashboard compact. Il peut vivre seul ou en meute,
                    comme plusieurs maisons sur la carte de Westeros 🐺🐉🦁
                </div>
            </div>
        </IntentSurfaceWidget>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentSurfaceWidgetIdentity}
            propsTable={IntentSurfaceWidgetPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={() => <div className="w-full min-w-0">{previewBody}</div>}
        />
    );
}
