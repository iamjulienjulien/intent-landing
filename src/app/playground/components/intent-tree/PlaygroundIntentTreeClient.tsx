"use client";

// src/app/playground/components/intent-tree/PlaygroundIntentTreeClient.tsx
// PlaygroundIntentTreeClient
// - Test IntentTree advanced features:
//   - dataset switch (Targaryen / Stark / Bourbon)
//   - mini-map
//   - search
//   - lineage highlight
//   - scope modes: desc / asc / siblings / full
//   - fullscreen
//   - toolbar actions
// - Uses node meta: tone + dates + tags

import React, { useEffect, useMemo, useState } from "react";

import {
    IntentTree,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // docs exports
    IntentTreeIdentity,
    IntentTreePropsTable,

    // (optionnel si tu exportes ces defs depuis le DS)
    // INTENT_TREE_TAGS,
    // type IntentTreeTagKey,
    // type IntentTreeScopeMode,
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
type LinkStyle = "curve" | "elbow" | "straight";
type LayoutMode = "auto" | "custom";

// align avec ton IntentTreeScopeMode
type ScopeMode = "desc" | "asc" | "siblings" | "full";

// align avec ton IntentTreeToolbarAction
type ToolbarAction =
    | "fit"
    | "reset"
    | "zoom_in"
    | "zoom_out"
    | "fullscreen"
    | "expand_all"
    | "collapse_all"
    | "toggle_grid";

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

function TextInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                "px-3 py-2 text-sm opacity-85",
                "focus:outline-none focus:ring-2 focus:ring-white/15"
            )}
        />
    );
}

/* ============================================================================
   🧬 DATA TYPES (node meta: tone / dates / tags)
============================================================================ */

type TagKey =
    | "king"
    | "queen"
    | "prince"
    | "princess"
    | "lord"
    | "lady"
    | "bastard"
    | "heir"
    | "consort"
    | "founder"
    | "dragonrider";

type NodeDates = {
    born?: string;
    died?: string;
};

type NodeMeta = {
    tone?: ToneName | "theme" | "black" | string;
    dates?: NodeDates;
    tags?: TagKey[];
};

type PersonNode = {
    id: string;
    name: string;
    subtitle?: string;
    meta?: NodeMeta;
    children?: PersonNode[];
};

/* ============================================================================
   🏰 DATASETS
============================================================================ */

// --- Targaryen (mini, déjà là, enrichi meta)
const TARGARYEN_TREE: PersonNode = {
    id: "aegon-i",
    name: "Aegon I Targaryen",
    subtitle: "The Conqueror",
    meta: { tone: "emerald", dates: { born: "27 BC", died: "37 AC" }, tags: ["king", "founder"] },
    children: [
        {
            id: "aenys-i",
            name: "Aenys I",
            subtitle: "Firstborn son",
            meta: { tone: "green", tags: ["king", "heir"] },
            children: [
                {
                    id: "jaehaerys-i",
                    name: "Jaehaerys I",
                    subtitle: "The Conciliator",
                    meta: { tone: "cyan", tags: ["king"] },
                    children: [
                        {
                            id: "viserys-i",
                            name: "Viserys I",
                            subtitle: "Pre-Dance era",
                            meta: { tone: "amber", tags: ["king"] },
                            children: [
                                {
                                    id: "rhaenyra",
                                    name: "Rhaenyra",
                                    subtitle: "The Dance of the Dragons",
                                    meta: { tone: "rose", tags: ["princess", "heir"] },
                                    children: [
                                        {
                                            id: "aegon-iii",
                                            name: "Aegon III",
                                            subtitle: "After the Dance",
                                            meta: { tone: "slate", tags: ["king"] },
                                        },
                                    ],
                                },
                                {
                                    id: "aegon-ii",
                                    name: "Aegon II",
                                    subtitle: "The Dance rival",
                                    meta: { tone: "orange", tags: ["king"] },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

// --- Stark (simplifié, “tree-ish”)
const STARK_TREE: PersonNode = {
    id: "rickard-stark",
    name: "Rickard Stark",
    subtitle: "Lord of Winterfell",
    meta: { tone: "slate", tags: ["lord"] },
    children: [
        {
            id: "eddard-stark",
            name: "Eddard Stark",
            subtitle: "Ned",
            meta: { tone: "cyan", tags: ["lord"] },
            children: [
                {
                    id: "robb-stark",
                    name: "Robb Stark",
                    subtitle: "The Young Wolf",
                    meta: { tone: "emerald", tags: ["heir"] },
                },
                {
                    id: "sansa-stark",
                    name: "Sansa Stark",
                    subtitle: "Lady of Winterfell",
                    meta: { tone: "pink", tags: ["lady"] },
                },
                {
                    id: "arya-stark",
                    name: "Arya Stark",
                    subtitle: "No One",
                    meta: { tone: "zinc", tags: ["lady"] },
                },
                {
                    id: "bran-stark",
                    name: "Bran Stark",
                    subtitle: "The Raven",
                    meta: { tone: "violet", tags: ["heir"] },
                },
                {
                    id: "rickon-stark",
                    name: "Rickon Stark",
                    meta: { tone: "stone" },
                },
            ],
        },
    ],
};

// --- Bourbon (historique, volontairement compact)
const BOURBON_TREE: PersonNode = {
    id: "henri-iv",
    name: "Henri IV",
    subtitle: "Roi de France",
    meta: { tone: "emerald", dates: { born: "1553-12-13", died: "1610-05-14" }, tags: ["king"] },
    children: [
        {
            id: "louis-xiii",
            name: "Louis XIII",
            subtitle: "Roi de France",
            meta: {
                tone: "cyan",
                dates: { born: "1601-09-27", died: "1643-05-14" },
                tags: ["king"],
            },
            children: [
                {
                    id: "louis-xiv",
                    name: "Louis XIV",
                    subtitle: "Le Roi-Soleil",
                    meta: {
                        tone: "amber",
                        dates: { born: "1638-09-05", died: "1715-09-01" },
                        tags: ["king", "founder"],
                    },
                    children: [
                        {
                            id: "louis-xv",
                            name: "Louis XV",
                            subtitle: "Le Bien-Aimé",
                            meta: {
                                tone: "yellow",
                                dates: { born: "1710-02-15", died: "1774-05-10" },
                                tags: ["king"],
                            },
                            children: [
                                {
                                    id: "louis-xvi",
                                    name: "Louis XVI",
                                    subtitle: "Roi de France",
                                    meta: {
                                        tone: "rose",
                                        dates: { born: "1754-08-23", died: "1793-01-21" },
                                        tags: ["king"],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

type DatasetKey = "targaryen" | "stark" | "bourbon";

const DATASETS: Record<DatasetKey, { label: string; root: PersonNode }> = {
    targaryen: { label: "Targaryen 🐉", root: TARGARYEN_TREE },
    stark: { label: "Stark 🐺", root: STARK_TREE },
    bourbon: { label: "Bourbon ⚜️", root: BOURBON_TREE },
};

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentTreeClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // dataset
    const [dataset, setDataset] = useState<DatasetKey>("targaryen");
    const root = useMemo(() => DATASETS[dataset].root, [dataset]);

    // DS controls
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");
    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) {
            setGlow(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aestheticEnabled]);

    // Tree controls
    const [layout, setLayout] = useState<LayoutMode>("auto");
    const [orientation, setOrientation] = useState<Orientation>("vertical");
    const [linkStyle, setLinkStyle] = useState<LinkStyle>("curve");

    const [nodeWidth, setNodeWidth] = useState(240);
    const [nodeHeight, setNodeHeight] = useState(95);
    const [levelGap, setLevelGap] = useState(90);
    const [siblingGap, setSiblingGap] = useState(28);
    const [padding, setPadding] = useState(48);

    const [zoomable, setZoomable] = useState(true);
    const [pannable, setPannable] = useState(true);
    const [autoFit, setAutoFit] = useState(true);

    const [showGrid, setShowGrid] = useState(false);
    const [gridSize, setGridSize] = useState(40);

    const [collapsible, setCollapsible] = useState(true);
    const [selectable, setSelectable] = useState(true);

    // advanced features
    const [showToolbar, setShowToolbar] = useState(true);
    const [toolbarActions, setToolbarActions] = useState<ToolbarAction[]>([
        "fit",
        "reset",
        "zoom_in",
        "zoom_out",
        "fullscreen",
        "expand_all",
        "collapse_all",
        "toggle_grid",
    ]);

    const [enableFullscreen, setEnableFullscreen] = useState(true);
    const [showMiniMap, setShowMiniMap] = useState(true);

    const [scopeMode, setScopeMode] = useState<ScopeMode>("desc"); // desc/asc/siblings/full
    const [lineageHighlight, setLineageHighlight] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    // local state (we keep controlled to test callbacks)
    const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // reset state when dataset changes (so you don’t carry “ghost ids”)
    useEffect(() => {
        setCollapsedIds([]);
        setSelectedId(root?.id ?? null);
        setSearchQuery("");
    }, [dataset, root?.id]);

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
       🧠 Custom layout example (optional)
    ============================================================================ */

    const getNodePosition =
        layout === "custom"
            ? ({
                  depth,
                  order,
              }: {
                  node: PersonNode;
                  id: string;
                  depth: number;
                  order: number;
                  parentId: string | null;
              }) => {
                  const x = order * (nodeWidth + siblingGap);
                  const y = depth * (nodeHeight + levelGap);
                  return { x, y };
              }
            : undefined;

    /* ============================================================================
       🎨 Node intent override
       - (1) Search match pops
       - (2) Meta tone can override when intent="toned" (optional)
    ============================================================================ */

    const nodeIntent = (n: PersonNode) => {
        const q = searchQuery.trim().toLowerCase();
        const match = q ? n.name.toLowerCase().includes(q) : false;

        if (match) return { intent: "empowered" as const };

        // if you want meta tone to drive per-node “toned”
        if (n.meta?.tone) return { intent: "toned" as const, tone: n.meta.tone as any };

        return null;
    };

    /* ============================================================================
       🧩 Default node renderer: dates (A) + tags + tone badge hint
       - dates: A (born–died)
       - fratrie: B (handled by tree scopeMode="siblings")
    ============================================================================ */

    const renderNode = ({
        node,
        isSelected,
    }: {
        node: any; // IntentTreeNodeRenderContext<PersonNode> in real code
        isSelected: boolean;
    }) => {
        const data = node.data as PersonNode;
        const tags = data.meta?.tags ?? [];
        const dates = data.meta?.dates;

        const dateA =
            dates?.born || dates?.died ? `${dates?.born ?? "?"} → ${dates?.died ?? "?"}` : null;

        return (
            <div className={cn("intent-tree-nodeCard", isSelected && "is-selected")}>
                <div className="intent-tree-nodeHeader">
                    <div className="intent-tree-nodeLabel">{data.name}</div>
                </div>

                <div className="intent-tree-nodeSubtitle">
                    {data.subtitle ? <span>{data.subtitle}</span> : null}
                    {dateA ? <span className="ml-2 opacity-60 font-mono">🗓️ {dateA}</span> : null}
                </div>

                {tags.length ? (
                    <div className="intent-tree-nodeTags">
                        {tags.slice(0, 3).map((t) => (
                            <span key={t} className="intent-tree-nodeTag">
                                {/* si tu exportes INTENT_TREE_TAGS, remplace par emoji+label */}
                                <span className="intent-tree-nodeTagEmoji">
                                    {t === "king"
                                        ? "👑"
                                        : t === "queen"
                                          ? "👑"
                                          : t === "heir"
                                            ? "🧬"
                                            : t === "lord"
                                              ? "🛡️"
                                              : t === "lady"
                                                ? "🛡️"
                                                : t === "founder"
                                                  ? "🔥"
                                                  : t === "dragonrider"
                                                    ? "🐉"
                                                    : "🏷️"}
                                </span>
                                <span className="intent-tree-nodeTagLabel">{t}</span>
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    };

    /* ============================================================================
       🧾 Code snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `  tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `  glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `  glow\n`
                  : "";

        return `import * as React from "react";
import { IntentTree } from "intent-design-system";

export function Example() {
  return (
    <IntentTree
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}  intensity="${intensity}"
      root={DATASETS.${dataset}.root}
      getId={(n) => n.id}
      getChildren={(n) => n.children}
      getLabel={(n) => n.name}
      getSubtitle={(n) => n.subtitle}

      // new toys:
      scopeMode="${scopeMode}"
      lineageHighlight={${lineageHighlight}}
      searchQuery={${JSON.stringify(searchQuery)}}
      showMiniMap={${showMiniMap}}
      enableFullscreen={${enableFullscreen}}
      showToolbar={${showToolbar}}
      toolbarActions={${JSON.stringify(toolbarActions)}}

      layout="${layout}"
      orientation="${orientation}"
      linkStyle="${linkStyle}"
      nodeWidth={${nodeWidth}}
      nodeHeight={${nodeHeight}}
      levelGap={${levelGap}}
      siblingGap={${siblingGap}}
      padding={${padding}}
      zoomable={${zoomable}}
      pannable={${pannable}}
      autoFit={${autoFit}}
      showGrid={${showGrid}}
      gridSize={${gridSize}}
      collapsible={${collapsible}}
      selectable={${selectable}}
      nodeIntent={nodeIntent}
      renderNode={renderNode}
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
        dataset,
        scopeMode,
        lineageHighlight,
        searchQuery,
        showMiniMap,
        enableFullscreen,
        showToolbar,
        toolbarActions,
        layout,
        orientation,
        linkStyle,
        nodeWidth,
        nodeHeight,
        levelGap,
        siblingGap,
        padding,
        zoomable,
        pannable,
        autoFit,
        showGrid,
        gridSize,
        collapsible,
        selectable,
    ]);

    /* ============================================================================
       🧩 Controls split (DS vs local)
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

            <SelectRow label="Dataset">
                <Select
                    value={dataset}
                    onChange={(v) => setDataset(v as DatasetKey)}
                    options={(Object.keys(DATASETS) as DatasetKey[]).map((k) => k)}
                />
                <div className="mt-2 text-[11px] opacity-45">{DATASETS[dataset].label}</div>
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
            <SelectRow label="Scope mode">
                <Select
                    value={scopeMode}
                    onChange={(v) => setScopeMode(v as ScopeMode)}
                    options={["desc", "asc", "siblings", "full"]}
                />
                <div className="mt-2 text-[11px] opacity-45">
                    fratrie = <span className="font-mono">siblings</span> (B)
                </div>
            </SelectRow>

            <SelectRow label="Search">
                <TextInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Ex: Louis, Arya, Aegon…"
                />
                <div className="mt-2 text-[11px] opacity-45">
                    Match = intent “empowered” via nodeIntent (et/ou ton moteur interne).
                </div>
            </SelectRow>

            <SelectRow label="Lineage highlight">
                <div className="space-y-2">
                    <CheckboxRow
                        label="lineageHighlight"
                        checked={lineageHighlight}
                        onChange={setLineageHighlight}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Mini-map / Fullscreen / Toolbar">
                <div className="space-y-2">
                    <CheckboxRow
                        label="showMiniMap"
                        checked={showMiniMap}
                        onChange={setShowMiniMap}
                    />
                    <CheckboxRow
                        label="enableFullscreen"
                        checked={enableFullscreen}
                        onChange={setEnableFullscreen}
                    />
                    <CheckboxRow
                        label="showToolbar"
                        checked={showToolbar}
                        onChange={setShowToolbar}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Toolbar actions">
                <div className="grid grid-cols-2 gap-2">
                    {(
                        [
                            "fit",
                            "reset",
                            "zoom_in",
                            "zoom_out",
                            "fullscreen",
                            "expand_all",
                            "collapse_all",
                            "toggle_grid",
                        ] as ToolbarAction[]
                    ).map((a) => {
                        const checked = toolbarActions.includes(a);
                        return (
                            <label
                                key={a}
                                className="flex items-center gap-2 text-[12px] opacity-85"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                        const next = new Set(toolbarActions);
                                        if (e.target.checked) next.add(a);
                                        else next.delete(a);
                                        setToolbarActions(Array.from(next));
                                    }}
                                />
                                {a}
                            </label>
                        );
                    })}
                </div>
            </SelectRow>

            <SelectRow label="Layout">
                <Select
                    value={layout}
                    onChange={(v) => setLayout(v as LayoutMode)}
                    options={["auto", "custom"]}
                />
            </SelectRow>

            <SelectRow label="Orientation">
                <Select
                    value={orientation}
                    onChange={(v) => setOrientation(v as Orientation)}
                    options={["vertical", "horizontal"]}
                />
            </SelectRow>

            <SelectRow label="Link style">
                <Select
                    value={linkStyle}
                    onChange={(v) => setLinkStyle(v as LinkStyle)}
                    options={["curve", "elbow", "straight"]}
                />
            </SelectRow>

            <SelectRow label="Sizing">
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-[11px] opacity-70">
                        nodeWidth
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={nodeWidth}
                            onChange={(e) => setNodeWidth(Number(e.target.value))}
                            min={140}
                            max={520}
                        />
                    </label>

                    <label className="text-[11px] opacity-70">
                        nodeHeight
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={nodeHeight}
                            onChange={(e) => setNodeHeight(Number(e.target.value))}
                            min={48}
                            max={220}
                        />
                    </label>

                    <label className="text-[11px] opacity-70">
                        levelGap
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={levelGap}
                            onChange={(e) => setLevelGap(Number(e.target.value))}
                            min={20}
                            max={260}
                        />
                    </label>

                    <label className="text-[11px] opacity-70">
                        siblingGap
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={siblingGap}
                            onChange={(e) => setSiblingGap(Number(e.target.value))}
                            min={0}
                            max={180}
                        />
                    </label>

                    <label className="text-[11px] opacity-70 col-span-2">
                        padding
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={padding}
                            onChange={(e) => setPadding(Number(e.target.value))}
                            min={0}
                            max={240}
                        />
                    </label>
                </div>
            </SelectRow>

            <SelectRow label="Interactions">
                <div className="space-y-2">
                    <CheckboxRow label="zoomable" checked={zoomable} onChange={setZoomable} />
                    <CheckboxRow label="pannable" checked={pannable} onChange={setPannable} />
                    <CheckboxRow label="autoFit" checked={autoFit} onChange={setAutoFit} />
                </div>
            </SelectRow>

            <SelectRow label="Tree features">
                <div className="space-y-2">
                    <CheckboxRow
                        label="collapsible"
                        checked={collapsible}
                        onChange={setCollapsible}
                    />
                    <CheckboxRow label="selectable" checked={selectable} onChange={setSelectable} />
                </div>
            </SelectRow>

            <SelectRow label="Grid">
                <div className="space-y-2">
                    <CheckboxRow label="showGrid" checked={showGrid} onChange={setShowGrid} />
                    <label className="text-[11px] opacity-70">
                        gridSize
                        <input
                            className="mt-1 w-full rounded-xl bg-black/25 ring-1 ring-white/10 px-2 py-2 text-sm"
                            type="number"
                            value={gridSize}
                            onChange={(e) => setGridSize(Number(e.target.value))}
                            min={10}
                            max={140}
                        />
                    </label>
                </div>
            </SelectRow>

            <SelectRow label="State (debug)">
                <div className="space-y-2 text-[12px] opacity-70">
                    <div>
                        selectedId: <span className="font-mono">{selectedId ?? "null"}</span>
                    </div>
                    <div>
                        collapsed: <span className="font-mono">{collapsedIds.length}</span>
                    </div>
                </div>
            </SelectRow>
        </>
    );

    return (
        <PlaygroundComponentShell
            identity={IntentTreeIdentity}
            propsTable={IntentTreePropsTable}
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
                    <div className="w-full min-w-0 h-[70vh] rounded-2xl overflow-hidden">
                        <IntentTree<PersonNode>
                            {...dsInput}
                            mode={mode}
                            root={root}
                            getId={(n) => n.id}
                            getChildren={(n) => n.children}
                            getLabel={(n) => n.name}
                            getSubtitle={(n) => n.subtitle}
                            layout={layout}
                            orientation={orientation}
                            linkStyle={linkStyle}
                            nodeWidth={nodeWidth}
                            nodeHeight={nodeHeight}
                            levelGap={levelGap}
                            siblingGap={siblingGap}
                            padding={padding}
                            zoomable={zoomable}
                            pannable={pannable}
                            autoFit={autoFit}
                            showGrid={showGrid}
                            gridSize={gridSize}
                            collapsible={collapsible}
                            selectable={selectable}
                            collapsedIds={collapsedIds}
                            onCollapsedChange={setCollapsedIds}
                            selectedId={selectedId}
                            onSelectionChange={(id) => setSelectedId(id)}
                            nodeIntent={nodeIntent}
                            getNodePosition={getNodePosition}
                            renderNode={renderNode as any}
                            // ✅ advanced props (selon ton IntentTree)
                            scopeMode={scopeMode as any}
                            lineageHighlight={lineageHighlight as any}
                            getSearchText={searchQuery as any}
                            onSearchSelect={setSearchQuery as any}
                            miniMap={showMiniMap as any}
                            fullscreenable={enableFullscreen as any}
                            toolbar={showToolbar as any}
                            toolbarActions={toolbarActions as any}
                        />
                    </div>
                </div>
            )}
        />
    );
}
