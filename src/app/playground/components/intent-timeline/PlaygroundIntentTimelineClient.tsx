"use client";

// src/app/playground/components/intent-timeline/PlaygroundIntentTimelineClient.tsx
// PlaygroundIntentTimelineClient
// - Uses PlaygroundComponentShell to test IntentTimeline
// - Uses DS exports: Identity + PropsTable
// - Split controls: dsControls / extraControls
// - Adds previewMode toggle + codeString for the Code drawer

import React, { useMemo, useState } from "react";

import {
    IntentTimeline,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentTimelineIdentity,
    IntentTimelinePropsTable,
    type IntentTimelineItem,
    type IntentTimelineItemStatus,
    type IntentTimelineGroup,
    type IntentTimelineOrientation,
    type IntentTimelineSize,
    type IntentTimelineDensity,
    type IntentTimelineLayout,
    type IntentTimelineMarkerVariant,
    type IntentTimelineConnectorStyle,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

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

function formatIso(date: string) {
    // For code drawer readability (keeps it stable)
    return date;
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentTimelineClient() {
    // Preview mode (controls preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS intent props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

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

    /* ============================================================================
       Timeline local props
    ============================================================================ */

    const [orientation, setOrientation] = useState<IntentTimelineOrientation>("vertical");
    const [layout, setLayout] = useState<IntentTimelineLayout>("stacked");
    const [size, setSize] = useState<IntentTimelineSize>("md");
    const [density, setDensity] = useState<IntentTimelineDensity>("normal");

    const [compact, setCompact] = useState(false);
    const [reverse, setReverse] = useState(false);

    const [markerVariant, setMarkerVariant] = useState<IntentTimelineMarkerVariant>("dot");
    const [showIndex, setShowIndex] = useState(true);

    const [showConnector, setShowConnector] = useState(true);
    const [connectorStyle, setConnectorStyle] = useState<IntentTimelineConnectorStyle>("solid");
    const [connectorStartCap, setConnectorStartCap] = useState(true);
    const [connectorEndCap, setConnectorEndCap] = useState(true);

    const [showTime, setShowTime] = useState(true);
    const [showGroupHeaders, setShowGroupHeaders] = useState(true);

    const [clickable, setClickable] = useState(true);
    const [allowLinkNavigation, setAllowLinkNavigation] = useState(true);

    const [collapsible, setCollapsible] = useState(false);
    const [allowMultiExpand, setAllowMultiExpand] = useState(true);

    // Content toggles for demo richness
    const [withSubtitle, setWithSubtitle] = useState(true);
    const [withDescription, setWithDescription] = useState(true);
    const [withMeta, setWithMeta] = useState(true);
    const [withTrailing, setWithTrailing] = useState(true);
    const [withMedia, setWithMedia] = useState(false);
    const [withBody, setWithBody] = useState(true);
    const [withHref, setWithHref] = useState(false);

    // Item statuses (knobs)
    const [st1, setSt1] = useState<IntentTimelineItemStatus>("past");
    const [st2, setSt2] = useState<IntentTimelineItemStatus>("current");
    const [st3, setSt3] = useState<IntentTimelineItemStatus>("future");
    const [st4, setSt4] = useState<IntentTimelineItemStatus>("draft");
    const [st5, setSt5] = useState<IntentTimelineItemStatus>("cancelled");
    const [st6, setSt6] = useState<IntentTimelineItemStatus>("disabled");

    const groups: IntentTimelineGroup[] = useMemo(() => {
        return [
            { id: "2021", label: "2021", hint: "Origines récentes", left: <Pill>🗓️ Année</Pill> },
            {
                id: "2022",
                label: "2022",
                hint: "Images, lieux, objets",
                left: <Pill>🧭 Repères</Pill>,
            },
            { id: "2025", label: "2025", hint: "Capsules & mémoire", left: <Pill>🪐 Space</Pill> },
        ];
    }, []);

    const items: IntentTimelineItem[] = useMemo(() => {
        const base: Array<{
            id: string;
            title: string;
            subtitle: string;
            description: string;
            at: string;
            groupId: string;
            markerText: string;
            markerIcon: React.ReactNode;
        }> = [
            {
                id: "ev-1",
                title: "Naissance",
                subtitle: "Premier souffle",
                description: "Le début de la constellation. Une date qui devient un repère.",
                at: "2021-06-13",
                groupId: "2021",
                markerText: "N",
                markerIcon: <span aria-hidden>👶</span>,
            },
            {
                id: "ev-2",
                title: "Photo ajoutée",
                subtitle: "Album: été",
                description: "Une image qui accroche la lumière et la rend consultable.",
                at: "2022-08-04",
                groupId: "2022",
                markerText: "📷",
                markerIcon: <span aria-hidden>📷</span>,
            },
            {
                id: "ev-3",
                title: "Déménagement",
                subtitle: "Nouvelle adresse",
                description: "Un lieu change, les habitudes se recousent ailleurs.",
                at: "2025-04-11",
                groupId: "2025",
                markerText: "🏠",
                markerIcon: <span aria-hidden>🏠</span>,
            },
            {
                id: "ev-4",
                title: "Hommage",
                subtitle: "Message de la famille",
                description: "Un texte bref, mais qui tient chaud longtemps.",
                at: "2025-05-06",
                groupId: "2025",
                markerText: "✍️",
                markerIcon: <span aria-hidden>✍️</span>,
            },
            {
                id: "ev-5",
                title: "Événement futur",
                subtitle: "À venir",
                description: "Une date encore floue. On la laisse respirer, mais on la garde.",
                at: "2026-03-10",
                groupId: "2025",
                markerText: "⏳",
                markerIcon: <span aria-hidden>⏳</span>,
            },
            {
                id: "ev-6",
                title: "Archive verrouillée",
                subtitle: "Accès restreint",
                description: "Certaines capsules sont à clé, par respect ou par choix.",
                at: "2022-11-22",
                groupId: "2022",
                markerText: "🔒",
                markerIcon: <span aria-hidden>🔒</span>,
            },
        ];

        const statusById: Record<string, IntentTimelineItemStatus> = {
            "ev-1": st1,
            "ev-2": st2,
            "ev-3": st3,
            "ev-4": st4,
            "ev-5": st5,
            "ev-6": st6,
        };

        const metaFor = (s: IntentTimelineItemStatus) => {
            if (!withMeta) return undefined;
            if (s === "current") return <Pill>Now</Pill>;
            if (s === "future") return <Pill>Next</Pill>;
            if (s === "draft") return <Pill>Draft</Pill>;
            if (s === "cancelled") return <Pill>Cancelled</Pill>;
            if (s === "disabled") return <Pill>Locked</Pill>;
            return <Pill>Past</Pill>;
        };

        const trailingFor = (id: string) => {
            if (!withTrailing) return undefined;
            return (
                <div className="flex items-center gap-2">
                    <Pill>⋯</Pill>
                    <Pill>{id.toUpperCase()}</Pill>
                </div>
            );
        };

        const bodyFor = (title: string) => {
            if (!withBody) return undefined;
            return (
                <div className="space-y-2 text-sm opacity-85">
                    <div className="opacity-75">
                        Capsule: <span className="font-mono">{title}</span>
                    </div>
                    <div className="opacity-65">
                        Ici tu peux mettre du rich content (texte, liens, médias, etc).
                    </div>
                </div>
            );
        };

        const mediaFor = (emoji: string) => {
            if (!withMedia) return undefined;
            return (
                <div className="rounded-2xl bg-white/6 ring-1 ring-white/10 px-3 py-2 text-sm opacity-80">
                    {emoji} Aperçu média
                </div>
            );
        };

        return base.map((b) => {
            const s = statusById[b.id] ?? "past";

            return {
                id: b.id,
                title: b.title,
                subtitle: withSubtitle ? b.subtitle : undefined,
                description: withDescription ? b.description : undefined,
                at: formatIso(b.at),
                groupId: b.groupId,
                status: s,

                markerText: b.markerText,
                markerIcon: b.markerIcon,

                meta: metaFor(s),
                trailing: trailingFor(b.id),
                body: bodyFor(b.title),
                media: mediaFor(b.markerText),

                href: withHref ? `/playground/components/intent-timeline#${b.id}` : undefined,
                target: withHref ? "_self" : undefined,

                onSelect: (item) => {
                    // eslint-disable-next-line no-console
                    console.log("Selected item", item.id);
                },
                onToggleExpand: (item, next) => {
                    // eslint-disable-next-line no-console
                    console.log("Toggle expand", item.id, next);
                },
            } satisfies IntentTimelineItem;
        });
    }, [
        st1,
        st2,
        st3,
        st4,
        st5,
        st6,
        withSubtitle,
        withDescription,
        withMeta,
        withTrailing,
        withMedia,
        withBody,
        withHref,
    ]);

    // Active selection
    const defaultActiveFromStatuses = useMemo(() => {
        const current = items.find((it) => (it.status ?? "past") === "current");
        return current?.id ?? items[0]?.id ?? "ev-1";
    }, [items]);

    const [activeId, setActiveId] = useState<string>(defaultActiveFromStatuses);

    React.useEffect(() => {
        setActiveId(defaultActiveFromStatuses);
    }, [defaultActiveFromStatuses]);

    // Expanded (uncontrolled)
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    React.useEffect(() => {
        // When collapsible flips on, start with the active item (if it has body) for a nice demo
        if (!collapsible) return;
        const active = items.find((it) => it.id === activeId);
        if (!active?.body) return;
        setExpandedIds((prev) => (prev.includes(activeId) ? prev : [activeId, ...prev]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsible]);

    // Local guard: horizontal ignores alternate/split in component, but we still let user toggle
    const effectiveLayout = orientation === "horizontal" ? "stacked" : layout;

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
                        onChange={(v) => setOrientation(v as IntentTimelineOrientation)}
                        options={["vertical", "horizontal"]}
                    />
                    <Select
                        value={layout}
                        onChange={(v) => setLayout(v as IntentTimelineLayout)}
                        options={["stacked", "split", "alternate"]}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            value={size}
                            onChange={(v) => setSize(v as IntentTimelineSize)}
                            options={["xs", "sm", "md", "lg"]}
                        />
                        <Select
                            value={density}
                            onChange={(v) => setDensity(v as IntentTimelineDensity)}
                            options={["tight", "normal", "airy"]}
                        />
                    </div>
                </div>

                {orientation === "horizontal" ? (
                    <div className="mt-2 text-[11px] opacity-45">
                        ℹ️ En horizontal, <span className="font-mono">layout</span> est forcé en{" "}
                        <span className="font-mono">stacked</span>.
                    </div>
                ) : null}
            </SelectRow>

            <SelectRow label="Flags">
                <div className="space-y-2">
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                    <CheckboxRow label="reverse" checked={reverse} onChange={setReverse} />
                    <CheckboxRow label="clickable" checked={clickable} onChange={setClickable} />
                    <CheckboxRow
                        label="allowLinkNavigation"
                        checked={allowLinkNavigation}
                        onChange={setAllowLinkNavigation}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Time / Groups">
                <div className="space-y-2">
                    <CheckboxRow label="showTime" checked={showTime} onChange={setShowTime} />
                    <CheckboxRow
                        label="showGroupHeaders"
                        checked={showGroupHeaders}
                        onChange={setShowGroupHeaders}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Marker / Connector">
                <div className="space-y-2">
                    <Select
                        value={markerVariant}
                        onChange={(v) => setMarkerVariant(v as IntentTimelineMarkerVariant)}
                        options={["dot", "icon", "index", "pill", "avatar"]}
                    />
                    <CheckboxRow label="showIndex" checked={showIndex} onChange={setShowIndex} />
                    <CheckboxRow
                        label="showConnector"
                        checked={showConnector}
                        onChange={setShowConnector}
                    />
                    <Select
                        value={connectorStyle}
                        onChange={(v) => setConnectorStyle(v as IntentTimelineConnectorStyle)}
                        options={["solid", "dashed"]}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <CheckboxRow
                            label="startCap"
                            checked={connectorStartCap}
                            onChange={setConnectorStartCap}
                        />
                        <CheckboxRow
                            label="endCap"
                            checked={connectorEndCap}
                            onChange={setConnectorEndCap}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Expand / Content">
                <div className="space-y-2">
                    <CheckboxRow
                        label="collapsible"
                        checked={collapsible}
                        onChange={setCollapsible}
                    />
                    <CheckboxRow
                        label="allowMultiExpand"
                        checked={allowMultiExpand}
                        onChange={setAllowMultiExpand}
                    />
                    <div className="pt-2 space-y-2">
                        <CheckboxRow
                            label="withSubtitle"
                            checked={withSubtitle}
                            onChange={setWithSubtitle}
                        />
                        <CheckboxRow
                            label="withDescription"
                            checked={withDescription}
                            onChange={setWithDescription}
                        />
                        <CheckboxRow label="withMeta" checked={withMeta} onChange={setWithMeta} />
                        <CheckboxRow
                            label="withTrailing"
                            checked={withTrailing}
                            onChange={setWithTrailing}
                        />
                        <CheckboxRow
                            label="withMedia"
                            checked={withMedia}
                            onChange={setWithMedia}
                        />
                        <CheckboxRow label="withBody" checked={withBody} onChange={setWithBody} />
                        <CheckboxRow label="withHref" checked={withHref} onChange={setWithHref} />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Item statuses">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-1</div>
                        <Select
                            value={st1}
                            onChange={(v) => setSt1(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-2</div>
                        <Select
                            value={st2}
                            onChange={(v) => setSt2(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-3</div>
                        <Select
                            value={st3}
                            onChange={(v) => setSt3(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-4</div>
                        <Select
                            value={st4}
                            onChange={(v) => setSt4(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-5</div>
                        <Select
                            value={st5}
                            onChange={(v) => setSt5(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-55">ev-6</div>
                        <Select
                            value={st6}
                            onChange={(v) => setSt6(v as IntentTimelineItemStatus)}
                            options={[
                                "past",
                                "current",
                                "future",
                                "draft",
                                "cancelled",
                                "disabled",
                            ]}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Active (controlled)">
                <Select
                    value={activeId}
                    onChange={(v) => setActiveId(v)}
                    options={items.map((it) => it.id)}
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

        const groupsLiteral = groups
            .map((g) => `    { id: "${g.id}", label: "${g.label}", hint: "${g.hint ?? ""}" }`)
            .join(",\n");

        const itemsLiteral = items
            .map((it) => {
                const status = (it.status ?? "past") as IntentTimelineItemStatus;

                return `    {
      id: "${it.id}",
      title: "${it.title}",
      ${it.subtitle ? `subtitle: "${it.subtitle}",` : ""}
      ${it.description ? `description: "${it.description}",` : ""}
      at: "${String(it.at ?? "")}",
      groupId: "${String(it.groupId ?? "")}",
      status: "${status}",
      markerText: "${String(it.markerText ?? "")}",
    }`;
            })
            .join(",\n");

        const expandedLine = collapsible
            ? `      expandedIds={expandedIds}\n      onExpandedChange={setExpandedIds}\n`
            : "";

        return `import * as React from "react";
import { IntentTimeline } from "intent-design-system";

export function Example() {
  const [activeId, setActiveId] = React.useState("${activeId}");
  const [expandedIds, setExpandedIds] = React.useState<string[]>([]);

  const groups = [
${groupsLiteral}
  ];

  const items = [
${itemsLiteral}
  ];

  return (
    <IntentTimeline
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}

      items={items}
      groups={groups}
      showGroupHeaders={${showGroupHeaders}}

      orientation="${orientation}"
      layout="${effectiveLayout}"
      size="${size}"
      density="${density}"
      compact={${compact}}
      reverse={${reverse}}

      markerVariant="${markerVariant}"
      showIndex={${showIndex}}
      showConnector={${showConnector}}
      connectorStyle="${connectorStyle}"
      connectorStartCap={${connectorStartCap}}
      connectorEndCap={${connectorEndCap}}

      showTime={${showTime}}
      clickable={${clickable}}
      allowLinkNavigation={${allowLinkNavigation}}

      collapsible={${collapsible}}
      allowMultiExpand={${allowMultiExpand}}
      activeId={activeId}
      onActiveChange={setActiveId}
${expandedLine}    />
  );
}`;
    }, [
        activeId,
        allowLinkNavigation,
        allowMultiExpand,
        clickable,
        collapsible,
        compact,
        connectorEndCap,
        connectorStartCap,
        connectorStyle,
        density,
        disabled,
        effectiveLayout,
        glow,
        groups,
        intensity,
        intent,
        items,
        markerVariant,
        previewMode,
        reverse,
        showConnector,
        showGroupHeaders,
        showIndex,
        showTime,
        size,
        tone,
        variant,
        orientation,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentTimelineIdentity}
            propsTable={IntentTimelinePropsTable}
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
                    <IntentTimeline
                        {...dsInput}
                        mode={mode}
                        items={items}
                        groups={groups}
                        showGroupHeaders={showGroupHeaders}
                        orientation={orientation}
                        layout={effectiveLayout}
                        size={size}
                        density={density}
                        compact={compact}
                        reverse={reverse}
                        markerVariant={markerVariant}
                        showIndex={showIndex}
                        showConnector={showConnector}
                        connectorStyle={connectorStyle}
                        connectorStartCap={connectorStartCap}
                        connectorEndCap={connectorEndCap}
                        showTime={showTime}
                        clickable={clickable}
                        allowLinkNavigation={allowLinkNavigation}
                        collapsible={collapsible}
                        allowMultiExpand={allowMultiExpand}
                        activeId={activeId}
                        onActiveChange={setActiveId}
                        expandedIds={expandedIds}
                        onExpandedChange={setExpandedIds}
                    />

                    <div className="mt-5 text-[11px] opacity-55">
                        ⌨️ Navigation: <span className="font-mono">↑/↓</span> (vertical) ou{" "}
                        <span className="font-mono">←/→</span> (horizontal),{" "}
                        <span className="font-mono">Home/End</span>,{" "}
                        <span className="font-mono">Enter</span>,{" "}
                        <span className="font-mono">Space</span> (expand).
                    </div>
                </div>
            )}
        />
    );
}
