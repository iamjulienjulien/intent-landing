"use client";

// src/app/playground/components/intent-genealogy-hierarchy/PlaygroundIntentGenealogyHierarchyClient.tsx
// PlaygroundIntentGenealogyHierarchyClient
// - Uses PlaygroundComponentShell to test IntentGenealogyHierarchy
// - DS controls + local genealogy controls + code drawer
// - Demo dataset: 3 generations + couples + sibling group

import React, { useMemo, useState } from "react";

import {
    IntentGenealogyHierarchy,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentGenealogyHierarchyIdentity,
    IntentGenealogyHierarchyPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧪 DEBUG
============================================================================ */

type DebugEvent = { t: number; msg: string };

function nowMs() {
    return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function safeJson(v: unknown) {
    try {
        return JSON.stringify(v);
    } catch {
        return String(v);
    }
}

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";

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

/* ============================================================================
   🧬 DEMO DATA
============================================================================ */

type Person = {
    id: string;
    name: string;
    subtitle?: string;
    meta?: string;

    parents?: string[];
    children?: string[];
    spouses?: string[];
};

function buildPeople() {
    const people: Person[] = [
        // ─────────────────────────
        // Ancestors (gen -1)
        // ─────────────────────────
        {
            id: "p1",
            name: "Aegon",
            subtitle: "Né 1948",
            meta: "p1",
            children: ["p3", "p4"],
            spouses: ["p2"],
        },
        {
            id: "p2",
            name: "Rhaella",
            subtitle: "Née 1951",
            meta: "p2",
            children: ["p3", "p4"],
            spouses: ["p1"],
        },

        {
            id: "p7",
            name: "Eddard",
            subtitle: "Né 1955",
            meta: "p7",
            children: ["p5"],
            spouses: ["p8"],
        },
        {
            id: "p8",
            name: "Catelyn",
            subtitle: "Née 1958",
            meta: "p8",
            children: ["p5"],
            spouses: ["p7"],
        },

        // ─────────────────────────
        // Root generation (gen 0)
        // ─────────────────────────
        {
            id: "p3",
            name: "Lyanna",
            subtitle: "Née 1978",
            meta: "p3",
            parents: ["p1", "p2"],
            children: ["p6"],
            spouses: ["p5"],
        },
        {
            id: "p5",
            name: "Rhaegar",
            subtitle: "Né 1975",
            meta: "p5",
            parents: ["p7", "p8"],
            children: ["p6"],
            spouses: ["p3"],
        },

        // sibling of root (to show grouping on same parents)
        {
            id: "p4",
            name: "Viserys",
            subtitle: "Né 1980",
            meta: "p4",
            parents: ["p1", "p2"],
        },

        // ─────────────────────────
        // Descendants (gen +1)
        // ─────────────────────────
        {
            id: "p6",
            name: "Jon",
            subtitle: "Né 2002",
            meta: "p6",
            parents: ["p3", "p5"],
        },
    ];

    const byId = new Map(people.map((p) => [p.id, p]));
    return { people, byId };
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

class PlaygroundErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { error: Error | null }
> {
    state = { error: null as Error | null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error) {
        // eslint-disable-next-line no-console
        console.error("[GenealogyPlayground] crashed:", error);
    }

    render() {
        if (!this.state.error) return this.props.children;

        return (
            <div className="rounded-2xl p-4 ring-1 ring-white/10 bg-black/25">
                <div className="font-semibold mb-2">⛔ Playground crashed</div>
                <pre className="text-xs whitespace-pre-wrap opacity-80">
                    {String(
                        this.state.error?.stack ?? this.state.error?.message ?? this.state.error
                    )}
                </pre>
            </div>
        );
    }
}

export default function PlaygroundIntentGenealogyHierarchyClient() {
    React.useEffect(() => {
        (window as any).__genealogy_playground_seen =
            ((window as any).__genealogy_playground_seen ?? 0) + 1;
        // eslint-disable-next-line no-console
        console.log("[GenealogyPlayground] mounted:", (window as any).__genealogy_playground_seen);
    }, []);
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    /* ============================================================================
       🧪 Debug mode
    ============================================================================ */

    const [debug, setDebug] = useState(false);
    const [safeMode, setSafeMode] = useState(false); // n’instancie pas le composant tant que tu ne lances pas
    const [armed, setArmed] = useState(false); // quand safeMode=true, on “arm” à la main
    const [debugTimeoutMs, setDebugTimeoutMs] = useState(1800);

    const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);
    const [debugTripped, setDebugTripped] = useState(false);

    const log = React.useCallback((msg: string) => {
        const e = { t: nowMs(), msg };
        // eslint-disable-next-line no-console
        console.log(`[GenealogyPlayground] ${msg}`);
        setDebugEvents((prev) => {
            const next = [...prev, e];
            return next.length > 80 ? next.slice(next.length - 80) : next;
        });
    }, []);

    // Render counter: si ça “tourne” sans afficher, on le voit.
    const renderCountRef = React.useRef(0);
    renderCountRef.current += 1;

    React.useEffect(() => {
        if (!debug) return;

        // compteur de renders dans une fenêtre courte
        let frames = 0;
        let raf = 0;

        const tick = () => {
            frames += 1;
            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);

        const id = window.setInterval(() => {
            const c = renderCountRef.current;
            log(`renderCount=${c} (rafFrames~${frames})`);
            frames = 0;
        }, 500);

        return () => {
            window.clearInterval(id);
            cancelAnimationFrame(raf);
        };
    }, [debug, log]);

    // Watchdog: si après N ms on n'a pas “stabilisé” ou monté le preview, on affiche un diagnostic.
    React.useEffect(() => {
        if (!debug) return;

        setDebugTripped(false);
        const start = nowMs();
        log(`debug watchdog armed (${debugTimeoutMs}ms)`);

        const id = window.setTimeout(
            () => {
                const elapsed = Math.round(nowMs() - start);
                setDebugTripped(true);
                log(`⛔ watchdog timeout after ${elapsed}ms (likely infinite render loop)`);
            },
            Math.max(200, debugTimeoutMs)
        );

        return () => window.clearTimeout(id);
    }, [debug, debugTimeoutMs, log]);

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const toneEnabled = intent === "toned";
    const aestheticEnabled = intent === "glowed";

    React.useEffect(() => {
        if (!aestheticEnabled && typeof glow === "string" && isAestheticGlow(glow)) setGlow(false);
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
    React.useEffect(() => {
        if (!debug) return;
        log(`dsInput=${safeJson(dsInput)}`);
        if (resolvedWithWarnings?.warnings?.length) {
            log(`warnings=${resolvedWithWarnings.warnings.length}`);
        }
    }, [debug, dsInput, resolvedWithWarnings, log]);

    /* ============================================================================
       Local controls
    ============================================================================ */

    const [maxAncestors, setMaxAncestors] = useState(3);
    const [maxDescendants, setMaxDescendants] = useState(3);

    const [nodeWidth, setNodeWidth] = useState(170);
    const [nodeHeight, setNodeHeight] = useState(52);
    const [spouseGap, setSpouseGap] = useState(18);
    const [unitGap, setUnitGap] = useState(36);
    const [rowGap, setRowGap] = useState(64);
    const [padding, setPadding] = useState(36);
    const [trunkGap, setTrunkGap] = useState(18);
    const [childStem, setChildStem] = useState(14);

    const [zoomable, setZoomable] = useState(true);
    const [pannable, setPannable] = useState(true);
    const [autoFit, setAutoFit] = useState(true);
    const [selectable, setSelectable] = useState(true);

    // Demo toggles
    const [withSpouses, setWithSpouses] = useState(true);
    const [showMeta, setShowMeta] = useState(true);
    const [useCustomRender, setUseCustomRender] = useState(false);

    // Root chooser
    const [rootId, setRootId] = useState("p3");

    const { byId } = useMemo(() => buildPeople(), []);
    React.useEffect(() => {
        if (!debug) return;
        log(`people loaded: byId.size=${byId.size}`);
    }, [debug, byId, log]);
    const root = useMemo(() => byId.get(rootId)!, [byId, rootId]);
    React.useEffect(() => {
        if (!debug) return;
        log(`root resolved: rootId=${rootId} root=${root ? root.id : "null"}`);
    }, [debug, rootId, root, log]);

    const getId = React.useCallback((p: Person) => p.id, []);

    const getParents = React.useCallback(
        (p: Person) => (p.parents ?? []).map((id) => byId.get(id)).filter(Boolean),
        [byId]
    );

    const getChildren = React.useCallback(
        (p: Person) => (p.children ?? []).map((id) => byId.get(id)).filter(Boolean),
        [byId]
    );

    const getSpouses = React.useCallback(
        (p: Person) => (p.spouses ?? []).map((id) => byId.get(id)).filter(Boolean),
        [byId]
    );

    /* ============================================================================
       Controls UI
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
                    options={
                        aestheticEnabled
                            ? ["aurora", "ember", "cosmic", "mythic", "royal", "mono"]
                            : ["false", "true"]
                    }
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
                <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Debug">
                <div className="space-y-2">
                    <CheckboxRow label="debug logs" checked={debug} onChange={setDebug} />
                    <CheckboxRow
                        label="safeMode (manual mount)"
                        checked={safeMode}
                        onChange={setSafeMode}
                    />
                    {safeMode ? (
                        <button
                            type="button"
                            onClick={() => {
                                setArmed(true);
                                if (debug) log("safeMode: armed=true");
                            }}
                            className={cn(
                                "w-full rounded-xl px-3 py-2 text-sm",
                                "bg-black/25 ring-1 ring-white/10",
                                "hover:ring-white/20"
                            )}
                        >
                            ▶ Mount preview
                        </button>
                    ) : null}

                    <div>
                        <div className="text-[11px] opacity-55 mb-1">watchdog timeout (ms)</div>
                        <input
                            type="number"
                            value={debugTimeoutMs}
                            min={200}
                            max={15000}
                            onChange={(e) => setDebugTimeoutMs(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                </div>
            </SelectRow>
            <SelectRow label="Root (focus)">
                <Select
                    value={rootId}
                    onChange={setRootId}
                    options={["p3", "p5", "p6", "p1", "p7"]}
                />
            </SelectRow>

            <SelectRow label="Graph">
                <div className="space-y-2">
                    <CheckboxRow
                        label="withSpouses"
                        checked={withSpouses}
                        onChange={setWithSpouses}
                    />
                    <CheckboxRow label="selectable" checked={selectable} onChange={setSelectable} />
                    <CheckboxRow label="autoFit" checked={autoFit} onChange={setAutoFit} />
                </div>
            </SelectRow>

            <SelectRow label="Viewport">
                <div className="space-y-2">
                    <CheckboxRow label="zoomable" checked={zoomable} onChange={setZoomable} />
                    <CheckboxRow label="pannable" checked={pannable} onChange={setPannable} />
                </div>
            </SelectRow>

            <SelectRow label="Content">
                <div className="space-y-2">
                    <CheckboxRow label="showMeta" checked={showMeta} onChange={setShowMeta} />
                    <CheckboxRow
                        label="custom renderNode (demo)"
                        checked={useCustomRender}
                        onChange={setUseCustomRender}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Depth">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">maxAncestors</div>
                        <input
                            type="number"
                            value={maxAncestors}
                            min={0}
                            max={8}
                            onChange={(e) => setMaxAncestors(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                    <div>
                        <div className="text-[11px] opacity-55 mb-1">maxDescendants</div>
                        <input
                            type="number"
                            value={maxDescendants}
                            min={0}
                            max={8}
                            onChange={(e) => setMaxDescendants(Number(e.target.value))}
                            className={cn(
                                "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                "px-3 py-2 text-sm opacity-85",
                                "focus:outline-none focus:ring-2 focus:ring-white/15"
                            )}
                        />
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Geometry">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        ["nodeWidth", nodeWidth, setNodeWidth, 120, 260],
                        ["nodeHeight", nodeHeight, setNodeHeight, 40, 110],
                        ["spouseGap", spouseGap, setSpouseGap, 0, 60],
                        ["unitGap", unitGap, setUnitGap, 0, 90],
                        ["rowGap", rowGap, setRowGap, 0, 140],
                        ["padding", padding, setPadding, 0, 120],
                        ["trunkGap", trunkGap, setTrunkGap, 0, 70],
                        ["childStem", childStem, setChildStem, 0, 50],
                    ].map(([label, v, setter, min, max]) => (
                        <div key={String(label)}>
                            <div className="text-[11px] opacity-55 mb-1">{String(label)}</div>
                            <input
                                type="number"
                                value={Number(v)}
                                min={Number(min)}
                                max={Number(max)}
                                onChange={(e) => (setter as any)(Number(e.target.value))}
                                className={cn(
                                    "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                                    "px-3 py-2 text-sm opacity-85",
                                    "focus:outline-none focus:ring-2 focus:ring-white/15"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: clique un noeud pour tester la sélection; scroll pour zoomer; drag le vide
                pour pan (si activé).
            </div>
        </>
    );

    /* ============================================================================
       Preview
    ============================================================================ */

    const preview = useMemo(() => {
        return (
            <div className="w-full min-w-0">
                <div className="h-130 w-full rounded-2xl overflow-hidden">
                    {debugTripped ? (
                        <div className="h-full w-full p-4 text-sm">
                            <div className="font-semibold mb-2">⛔ Debug watchdog tripped</div>
                            <div className="opacity-75 mb-3">
                                Le playground semble bloqué dans une boucle de render / layout.
                                Active safeMode puis “Mount preview” pour isoler.
                            </div>

                            <div className="rounded-xl bg-black/25 ring-1 ring-white/10 p-3">
                                <div className="text-xs opacity-60 mb-2">Last events</div>
                                <div className="space-y-1 text-xs font-mono whitespace-pre-wrap">
                                    {debugEvents.slice(-12).map((e, i) => (
                                        <div key={i}>
                                            [{Math.round(e.t)}] {e.msg}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : safeMode && !armed ? (
                        <div className="h-full w-full grid place-items-center p-6 text-sm">
                            <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4 max-w-md">
                                <div className="font-semibold mb-2">Safe mode</div>
                                <div className="opacity-75">
                                    Le composant n’est pas monté. Clique “Mount preview” dans Debug
                                    pour le monter.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <IntentGenealogyHierarchy<Person>
                            {...dsInput}
                            mode={previewMode}
                            root={root}
                            getId={getId}
                            getParents={getParents}
                            getChildren={getChildren}
                            {...(withSpouses ? { getSpouses } : {})}
                            getLabel={(p) => p.name}
                            getSubtitle={(p) => p.subtitle ?? ""}
                            {...(showMeta ? { getMeta: (p) => p.meta ?? "" } : {})}
                            maxAncestors={maxAncestors}
                            maxDescendants={maxDescendants}
                            nodeWidth={nodeWidth}
                            nodeHeight={nodeHeight}
                            spouseGap={spouseGap}
                            unitGap={unitGap}
                            rowGap={rowGap}
                            padding={padding}
                            trunkGap={trunkGap}
                            childStem={childStem}
                            zoomable={zoomable}
                            pannable={pannable}
                            autoFit={autoFit}
                            selectable={selectable}
                            renderNode={
                                useCustomRender
                                    ? ({ node, isSelected }) => (
                                          <div
                                              className={cn(
                                                  "intent-genealogy-card",
                                                  "flex items-center justify-between gap-3",
                                                  "px-3 py-2",
                                                  isSelected && "ring-2 ring-white/20"
                                              )}
                                          >
                                              <div className="min-w-0">
                                                  <div className="text-sm font-semibold truncate">
                                                      {node.data.name}
                                                  </div>
                                                  <div className="text-xs opacity-70 truncate">
                                                      {node.data.subtitle ?? "—"}
                                                  </div>
                                              </div>
                                              {showMeta ? (
                                                  <div className="text-[11px] opacity-60 font-mono">
                                                      {node.data.meta ?? node.id}
                                                  </div>
                                              ) : null}
                                          </div>
                                      )
                                    : undefined
                            }
                            onSelectionChange={(id, node) => {
                                if (debug)
                                    log(
                                        `select id=${String(id)} node=${node ? (node as any).id : "null"}`
                                    );
                            }}
                        />
                        // null
                    )}
                </div>

                <div className="mt-3 text-xs opacity-70">
                    root=<span className="font-mono">{rootId}</span>, variant=
                    <span className="font-mono"> {variant}</span>, intent=
                    <span className="font-mono"> {intent}</span>, spouses=
                    <span className="font-mono"> {String(withSpouses)}</span>
                </div>
            </div>
        );
    }, [
        dsInput,
        previewMode,
        root,
        rootId,
        variant,
        intent,
        withSpouses,
        showMeta,
        useCustomRender,
        maxAncestors,
        maxDescendants,
        nodeWidth,
        nodeHeight,
        spouseGap,
        unitGap,
        rowGap,
        padding,
        trunkGap,
        childStem,
        zoomable,
        pannable,
        autoFit,
        selectable,
        byId,
    ]);

    /* ============================================================================
       Code string (copy/paste)
       - no replaceAll
    ============================================================================ */

    const codeString = useMemo(() => {
        const esc = (s: string) => s.replace(/"/g, '\\"');

        const toneLine = intent === "toned" ? `      tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `      glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `      glow\n`
                  : "";

        const spousesLine = withSpouses ? `      getSpouses={getSpouses}\n` : "";

        const metaLine = showMeta ? `      getMeta={(p) => p.meta}\n` : "";

        return `import * as React from "react";
import { IntentGenealogyHierarchy } from "intent-design-system";

type Person = {
  id: string;
  name: string;
  subtitle?: string;
  meta?: string;
  parents?: string[];
  children?: string[];
  spouses?: string[];
};

export function Example() {
  const people: Person[] = [
    { id: "p1", name: "Aegon", subtitle: "Né 1948", meta: "p1", children: ["p3","p4"], spouses: ["p2"] },
    { id: "p2", name: "Rhaella", subtitle: "Née 1951", meta: "p2", children: ["p3","p4"], spouses: ["p1"] },
    { id: "p7", name: "Eddard", subtitle: "Né 1955", meta: "p7", children: ["p5"], spouses: ["p8"] },
    { id: "p8", name: "Catelyn", subtitle: "Née 1958", meta: "p8", children: ["p5"], spouses: ["p7"] },
    { id: "p3", name: "Lyanna", subtitle: "Née 1978", meta: "p3", parents: ["p1","p2"], children: ["p6"], spouses: ["p5"] },
    { id: "p5", name: "Rhaegar", subtitle: "Né 1975", meta: "p5", parents: ["p7","p8"], children: ["p6"], spouses: ["p3"] },
    { id: "p4", name: "Viserys", subtitle: "Né 1980", meta: "p4", parents: ["p1","p2"] },
    { id: "p6", name: "Jon", subtitle: "Né 2002", meta: "p6", parents: ["p3","p5"] },
  ];

  const byId = new Map(people.map((p) => [p.id, p]));
  const root = byId.get("${esc(rootId)}")!;

  const getId = (p: Person) => p.id;
  const getParents = (p: Person) => (p.parents ?? []).map((id) => byId.get(id)).filter(Boolean);
  const getChildren = (p: Person) => (p.children ?? []).map((id) => byId.get(id)).filter(Boolean);
  const getSpouses = (p: Person) => (p.spouses ?? []).map((id) => byId.get(id)).filter(Boolean);

  return (
    <div style={{ height: 520 }}>
      <IntentGenealogyHierarchy<Person>
        mode="${previewMode}"
        intent="${intent}"
        variant="${variant}"
${toneLine}${glowLine}        intensity="${intensity}"
        disabled={${disabled}}

        root={root}
        getId={getId}
        getParents={getParents}
        getChildren={getChildren}
${spousesLine}
        getLabel={(p) => p.name}
        getSubtitle={(p) => p.subtitle}
${metaLine}
        maxAncestors={${maxAncestors}}
        maxDescendants={${maxDescendants}}

        nodeWidth={${nodeWidth}}
        nodeHeight={${nodeHeight}}
        spouseGap={${spouseGap}}
        unitGap={${unitGap}}
        rowGap={${rowGap}}
        padding={${padding}}
        trunkGap={${trunkGap}}
        childStem={${childStem}}

        zoomable={${zoomable}}
        pannable={${pannable}}
        autoFit={${autoFit}}
        selectable={${selectable}}
      />
    </div>
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
        rootId,
        withSpouses,
        showMeta,
        maxAncestors,
        maxDescendants,
        nodeWidth,
        nodeHeight,
        spouseGap,
        unitGap,
        rowGap,
        padding,
        trunkGap,
        childStem,
        zoomable,
        pannable,
        autoFit,
        selectable,
    ]);

    // return <p>Ok</p>;
    // return <div className="p-6">OK genealogy playground</div>;
    return (
        <PlaygroundErrorBoundary>
            <PlaygroundComponentShell
                identity={IntentGenealogyHierarchyIdentity}
                propsTable={IntentGenealogyHierarchyPropsTable}
                locale="fr"
                dsControls={controlsDs}
                extraControls={controlsLocal}
                warnings={resolvedWithWarnings.warnings}
                resolvedJson={resolvedWithWarnings}
                previewMode={previewMode}
                codeString={codeString}
                renderPreview={() => preview}
            />
        </PlaygroundErrorBoundary>
    );
}
