"use client";

// src/app/playground/components/intent-surface-skeleton/PlaygroundIntentSurfaceSkeletonClient.tsx
// PlaygroundIntentSurfaceSkeletonClient
// - Uses PlaygroundComponentShell to test IntentSurfaceSkeleton
// - Uses DS exports: Identity + PropsTable
// - Mock theme: Game of Thrones loading states
// - Covers presets: generic / widget / card / panel
// - Covers header/body/footer anatomy + animation + density
// - ✅ Updated for PlaygroundComponentShell split controls (dsControls / extraControls)
// - ✅ Adds previewMode toggle + codeString for the Code drawer

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentSurfaceSkeleton,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentSurfaceSkeletonIdentity,
    IntentSurfaceSkeletonPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type SkeletonRadius = "lg" | "xl" | "2xl";
type SkeletonPadding = "none" | "xs" | "sm" | "md";
type HeaderAlign = "start" | "center";
type SkeletonPreset = "generic" | "widget" | "card" | "panel";
type SkeletonAnimation = "shimmer" | "pulse" | "none";
type LeadingShape = "circle" | "square" | "rounded";

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
        label: "Maison Stark",
        eyebrow: "Nord",
        loadingLabel: "Chargement du bastion de Winterfell…",
        lineWidths: ["full", "10/12", "8/12", "6/12"] as const,
    },
    {
        key: "targaryen",
        label: "Maison Targaryen",
        eyebrow: "Valyria",
        loadingLabel: "Chargement du conseil draconique…",
        lineWidths: ["11/12", "9/12", "7/12", "5/12"] as const,
    },
    {
        key: "lannister",
        label: "Maison Lannister",
        eyebrow: "Ouest",
        loadingLabel: "Chargement des coffres de Castral Roc…",
        lineWidths: ["10/12", "8/12", "7/12", "4/12"] as const,
    },
] as const;

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentSurfaceSkeletonClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [houseKey, setHouseKey] = useState<(typeof HOUSE_OPTIONS)[number]["key"]>("stark");

    const [preset, setPreset] = useState<SkeletonPreset>("widget");

    const [fullWidth, setFullWidth] = useState(true);
    const [padded, setPadded] = useState<SkeletonPadding>("sm");
    const [bleed, setBleed] = useState(false);
    const [radius, setRadius] = useState<SkeletonRadius>("xl");
    const [headerAlign, setHeaderAlign] = useState<HeaderAlign>("center");
    const [divider, setDivider] = useState(true);
    const [minHeight, setMinHeight] = useState(true);

    const [header, setHeader] = useState(true);
    const [footer, setFooter] = useState(false);

    const [leading, setLeading] = useState(true);
    const [leadingShape, setLeadingShape] = useState<LeadingShape>("circle");
    const [eyebrow, setEyebrow] = useState(false);
    const [title, setTitle] = useState(true);
    const [subtitle, setSubtitle] = useState(true);
    const [meta, setMeta] = useState(false);
    const [badges, setBadges] = useState("1");
    const [actions, setActions] = useState("1");

    const [paragraph, setParagraph] = useState(false);
    const [lines, setLines] = useState("3");
    const [stats, setStats] = useState("2");
    const [statsColumns, setStatsColumns] = useState<"1" | "2" | "3" | "4">("2");
    const [cards, setCards] = useState("0");
    const [cardsColumns, setCardsColumns] = useState<"1" | "2" | "3">("2");
    const [chart, setChart] = useState(false);
    const [media, setMedia] = useState(false);
    const [bodyScrollable, setBodyScrollable] = useState(false);

    const [footerLines, setFooterLines] = useState("1");
    const [footerActions, setFooterActions] = useState("0");

    const [compact, setCompact] = useState(false);
    const [dense, setDense] = useState(false);

    const [animated, setAnimated] = useState(true);
    const [animation, setAnimation] = useState<SkeletonAnimation>("shimmer");

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

    useEffect(() => {
        if (preset === "widget") {
            setHeader(true);
            setLeading(true);
            setTitle(true);
            setSubtitle(true);
            setBadges("1");
            setActions("1");
            setLines("3");
            setStats("2");
            setCards("0");
            setChart(false);
            setMedia(false);
            setFooter(false);
        } else if (preset === "card") {
            setHeader(true);
            setLeading(false);
            setTitle(true);
            setSubtitle(true);
            setBadges("0");
            setActions("0");
            setLines("4");
            setStats("0");
            setCards("2");
            setChart(false);
            setMedia(true);
            setFooter(false);
        } else if (preset === "panel") {
            setHeader(true);
            setLeading(false);
            setTitle(true);
            setSubtitle(true);
            setBadges("0");
            setActions("0");
            setLines("5");
            setStats("3");
            setCards("3");
            setChart(false);
            setMedia(false);
            setFooter(true);
            setFooterLines("1");
            setFooterActions("1");
        } else if (preset === "generic") {
            setHeader(false);
            setLeading(false);
            setTitle(false);
            setSubtitle(false);
            setBadges("0");
            setActions("0");
            setLines("3");
            setStats("0");
            setCards("0");
            setFooter(false);
        }
    }, [preset]);

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
       🧩 Controls split
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

            <SelectRow label="Preset">
                <Select
                    value={preset}
                    onChange={(v) => setPreset(v as SkeletonPreset)}
                    options={["generic", "widget", "card", "panel"]}
                />
            </SelectRow>

            <SelectRow label="Surface">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="bleed" checked={bleed} onChange={setBleed} />
                    <CheckboxRow label="divider" checked={divider} onChange={setDivider} />
                    <CheckboxRow label="minHeight" checked={minHeight} onChange={setMinHeight} />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Padding</div>
                    <Select
                        value={padded}
                        onChange={(v) => setPadded(v as SkeletonPadding)}
                        options={["none", "xs", "sm", "md"]}
                    />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Radius</div>
                    <Select
                        value={radius}
                        onChange={(v) => setRadius(v as SkeletonRadius)}
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

            <SelectRow label="Header">
                <div className="space-y-2">
                    <CheckboxRow label="header" checked={header} onChange={setHeader} />
                    <CheckboxRow label="leading" checked={leading} onChange={setLeading} />
                    <CheckboxRow label="eyebrow" checked={eyebrow} onChange={setEyebrow} />
                    <CheckboxRow label="title" checked={title} onChange={setTitle} />
                    <CheckboxRow label="subtitle" checked={subtitle} onChange={setSubtitle} />
                    <CheckboxRow label="meta" checked={meta} onChange={setMeta} />
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Leading shape</div>
                    <Select
                        value={leadingShape}
                        onChange={(v) => setLeadingShape(v as LeadingShape)}
                        options={["circle", "square", "rounded"]}
                    />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Badges</div>
                        <Select
                            value={badges}
                            onChange={setBadges}
                            options={["0", "1", "2", "3"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Actions</div>
                        <Select
                            value={actions}
                            onChange={setActions}
                            options={["0", "1", "2", "3"]}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Body">
                <div className="space-y-2">
                    <CheckboxRow label="paragraph" checked={paragraph} onChange={setParagraph} />
                    <CheckboxRow label="chart" checked={chart} onChange={setChart} />
                    <CheckboxRow label="media" checked={media} onChange={setMedia} />
                    <CheckboxRow
                        label="bodyScrollable"
                        checked={bodyScrollable}
                        onChange={setBodyScrollable}
                    />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Lines</div>
                        <Select
                            value={lines}
                            onChange={setLines}
                            options={["0", "1", "2", "3", "4", "5", "6"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Stats</div>
                        <Select
                            value={stats}
                            onChange={setStats}
                            options={["0", "1", "2", "3", "4"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Stats columns</div>
                        <Select
                            value={statsColumns}
                            onChange={(v) => setStatsColumns(v as "1" | "2" | "3" | "4")}
                            options={["1", "2", "3", "4"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Cards</div>
                        <Select value={cards} onChange={setCards} options={["0", "1", "2", "3"]} />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Cards columns</div>
                        <Select
                            value={cardsColumns}
                            onChange={(v) => setCardsColumns(v as "1" | "2" | "3")}
                            options={["1", "2", "3"]}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Footer + Motion">
                <div className="space-y-2">
                    <CheckboxRow label="footer" checked={footer} onChange={setFooter} />
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                    <CheckboxRow label="dense" checked={dense} onChange={setDense} />
                    <CheckboxRow label="animated" checked={animated} onChange={setAnimated} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Footer lines</div>
                        <Select
                            value={footerLines}
                            onChange={setFooterLines}
                            options={["0", "1", "2", "3"]}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">Footer actions</div>
                        <Select
                            value={footerActions}
                            onChange={setFooterActions}
                            options={["0", "1", "2"]}
                        />
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">Animation</div>
                    <Select
                        value={animation}
                        onChange={(v) => setAnimation(v as SkeletonAnimation)}
                        options={["shimmer", "pulse", "none"]}
                    />
                </div>
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

        return `import React from "react";
import { IntentSurfaceSkeleton } from "intent-design-system";

export function Example() {
    return (
        <IntentSurfaceSkeleton
            mode="${previewMode}"
            intent="${intent}"
            variant="${variant}"
${toneLine}${glowLine}            intensity="${intensity}"
            disabled={${disabled}}
            preset="${preset}"
            fullWidth={${fullWidth}}
            padded="${padded}"
            bleed={${bleed}}
            radius="${radius}"
            divider={${divider}}
            headerAlign="${headerAlign}"
            minHeight={${minHeight ? 220 : "undefined"}}
            header={${header}}
            footer={${footer}}
            leading={${leading}}
            leadingShape="${leadingShape}"
            eyebrow={${eyebrow}}
            title={${title}}
            subtitle={${subtitle}}
            meta={${meta}}
            badges={${Number(badges)}}
            actions={${Number(actions)}}
            paragraph={${paragraph}}
            lines={${Number(lines)}}
            lineWidths={["${activeHouse.lineWidths[0]}", "${activeHouse.lineWidths[1]}", "${activeHouse.lineWidths[2]}", "${activeHouse.lineWidths[3]}"]}
            stats={${Number(stats)}}
            statsColumns={${Number(statsColumns)}}
            cards={${Number(cards)}}
            cardsColumns={${Number(cardsColumns)}}
            chart={${chart}}
            media={${media}}
            bodyScrollable={${bodyScrollable}}
            footerLines={${Number(footerLines)}}
            footerActions={${Number(footerActions)}}
            compact={${compact}}
            dense={${dense}}
            animated={${animated}}
            animation="${animation}"
            label="${activeHouse.loadingLabel}"
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
        preset,
        fullWidth,
        padded,
        bleed,
        radius,
        divider,
        headerAlign,
        minHeight,
        header,
        footer,
        leading,
        leadingShape,
        eyebrow,
        title,
        subtitle,
        meta,
        badges,
        actions,
        paragraph,
        lines,
        stats,
        statsColumns,
        cards,
        cardsColumns,
        chart,
        media,
        bodyScrollable,
        footerLines,
        footerActions,
        compact,
        dense,
        animated,
        animation,
        activeHouse,
    ]);

    const previewBody = (
        <div className="space-y-6 w-full min-w-0">
            <IntentSurfaceSkeleton
                {...dsInput}
                mode={previewMode}
                preset={preset}
                fullWidth={fullWidth}
                padded={padded}
                bleed={bleed}
                radius={radius}
                divider={divider}
                headerAlign={headerAlign}
                minHeight={minHeight ? 220 : undefined}
                header={header}
                footer={footer}
                leading={leading}
                leadingShape={leadingShape}
                eyebrow={eyebrow}
                title={title as never}
                subtitle={subtitle}
                meta={meta}
                badges={Number(badges)}
                actions={Number(actions)}
                paragraph={paragraph}
                lines={Number(lines)}
                lineWidths={[...activeHouse.lineWidths]}
                stats={Number(stats)}
                statsColumns={Number(statsColumns) as 1 | 2 | 3 | 4}
                cards={Number(cards)}
                cardsColumns={Number(cardsColumns) as 1 | 2 | 3}
                chart={chart}
                media={media}
                bodyScrollable={bodyScrollable}
                footerLines={Number(footerLines)}
                footerActions={Number(footerActions)}
                compact={compact}
                dense={dense}
                animated={animated}
                animation={animation}
                label={activeHouse.loadingLabel}
                className="w-full min-w-0"
            />

            <div className="rounded-3xl p-4 ring-1 ring-white/10 bg-black/10">
                <div className="text-xs tracking-[0.18em] opacity-55">LORE</div>
                <div className="mt-2 text-sm opacity-75">{activeHouse.loadingLabel}</div>
                <div className="mt-2 text-[11px] opacity-55">
                    Preset <span className="font-mono">{preset}</span>, animation{" "}
                    <span className="font-mono">{animation}</span>, maison{" "}
                    <span className="font-mono">{activeHouse.label}</span>.
                </div>
            </div>
        </div>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentSurfaceSkeletonIdentity}
            propsTable={IntentSurfaceSkeletonPropsTable}
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
