"use client";

// src/app/playground/components/_components/PlaygroundComponentShell.tsx
// PlaygroundComponentShell
// - Reusable host for all /playground/components/* pages
// - Layout: identity header + controls (split) + single preview tile (+ code drawer) + system api table + props table + warnings + resolved debug
// - No forced text color; rely on inheritance + opacity

import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type ModeName = "dark" | "light";
type PreviewBg = "auto" | "dark" | "light";

type LocalizedText = {
    fr: string;
    en: string;
};

export type DocsPropRow = {
    name: string;
    description: LocalizedText;
    type: string;
    required: boolean;
    default?: string;
    fromSystem: boolean;
};

export type DocsComponentIdentity = {
    name: string;
    emoji?: string;
    description?: LocalizedText;
    since?: string;
    kind?: string; // surface/control/indicator...
    stability?: "experimental" | "stable";
};

type PlaygroundComponentShellProps = {
    identity: DocsComponentIdentity;
    propsTable?: DocsPropRow[];

    /** ✅ Split controls */
    dsControls: React.ReactNode;
    extraControls?: React.ReactNode;

    renderPreview: (mode: ModeName) => React.ReactNode;

    /** ✅ the playground chooses the active mode */
    previewMode?: ModeName; // default: "dark"

    /**
     * ✅ background of the preview tile
     * - "auto": matches previewMode
     * - "dark": force dark tile bg
     * - "light": force light tile bg
     */
    previewBg?: PreviewBg; // default: "auto"

    /** ✅ code shown by the "Code" button */
    codeString?: string;

    warnings?: Array<{ code: string; message: string }>;
    resolvedJson?: unknown;

    defaultFixedTileWidthPx?: number; // default: 420
    locale?: "fr" | "en"; // default: "fr"

    /** ✅ allow preview tile to expand to full width (1-column layout) */
    previewExpandable?: boolean; // default: false

    /** ✅ initial state when previewExpandable is true */
    defaultPreviewExpanded?: boolean; // default: false
};

/* ============================================================================
   📚 System API table
============================================================================ */

type DocsSystemApiRow = {
    name: string;
    kind: "type" | "constant";
    description: LocalizedText;
    valueOrRef?: string; // value for constants, or "union ref" for types
};

const SYSTEM_API_TABLE: DocsSystemApiRow[] = [
    {
        name: "IntentName",
        kind: "type",
        description: {
            fr: "Type union des intents sémantiques.",
            en: "Union type for semantic intents.",
        },
        valueOrRef: `"informed" | "empowered" | "warned" | "threatened" | "themed" | "toned" | "glowed"`,
    },
    {
        name: "VariantName",
        kind: "type",
        description: {
            fr: "Type union des variants visuels.",
            en: "Union type for visual variants.",
        },
        valueOrRef: `"flat" | "outlined" | "elevated" | "ghost"`,
    },
    {
        name: "ToneName",
        kind: "type",
        description: {
            fr: "Type union des tones (familles Tailwind + theme + black).",
            en: "Union type for tones (Tailwind families + theme + black).",
        },
        valueOrRef: `("slate" | "gray" | ... | "theme" | "black")`,
    },
    {
        name: "GlowName",
        kind: "type",
        description: {
            fr: "Type union des aesthetic glows (utilisable quand intent='glowed').",
            en: "Union type for aesthetic glows (usable when intent='glowed').",
        },
        valueOrRef: `"aurora" | "ember" | "cosmic" | "mythic" | "royal" | "mono"`,
    },
    {
        name: "Intensity",
        kind: "type",
        description: {
            fr: "Intensité des effets (glow/contraste).",
            en: "Intensity for effects (glow/contrast).",
        },
        valueOrRef: `"soft" | "medium" | "strong"`,
    },
    {
        name: "ModeName",
        kind: "type",
        description: {
            fr: "Mode colorimétrique.",
            en: "Color mode.",
        },
        valueOrRef: `"dark" | "light"`,
    },
    {
        name: "DEFAULT_INTENT",
        kind: "constant",
        description: {
            fr: "Intent par défaut si aucun intent n’est fourni.",
            en: "Default intent when none is provided.",
        },
        valueOrRef: `informed`,
    },
    {
        name: "DEFAULT_VARIANT",
        kind: "constant",
        description: {
            fr: "Variant par défaut si aucun variant n’est fourni.",
            en: "Default variant when none is provided.",
        },
        valueOrRef: `elevated`,
    },
    {
        name: "DEFAULT_GLOW_BY_INTENT",
        kind: "constant",
        description: {
            fr: "Mapping intent → glow par défaut (quand glow est implicite).",
            en: "Mapping intent → default glow (when glow is implicit).",
        },
        valueOrRef: `DEFAULT_GLOW_BY_INTENT`,
    },
];

function SystemApiTable({ locale }: { locale: "fr" | "en" }) {
    const typeRows = SYSTEM_API_TABLE.filter((r) => r.kind === "type");
    const constantRows = SYSTEM_API_TABLE.filter((r) => r.kind === "constant");

    const title = locale === "fr" ? "TYPES & CONSTANTES" : "TYPES & CONSTANTS";
    const groupTitle = (k: "type" | "constant") =>
        locale === "fr"
            ? k === "type"
                ? "TYPES"
                : "CONSTANTES"
            : k === "type"
              ? "TYPES"
              : "CONSTANTS";

    const GroupRow = ({ label }: { label: string }) => (
        <tr>
            <td
                colSpan={2}
                className={cn(
                    "px-5 py-3 text-xs tracking-[0.18em] font-medium",
                    "bg-white/5 text-white/55 border-y border-white/10"
                )}
            >
                {label}
            </td>
        </tr>
    );

    const renderRow = (r: DocsSystemApiRow) => (
        <tr key={r.name} className="border-b border-white/5 align-top">
            <td className="px-5 py-3">
                <div className="flex items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs opacity-90">{r.name}</span>

                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1",
                                    r.kind === "type"
                                        ? "bg-black/10 ring-white/10 opacity-70"
                                        : "bg-white/5 ring-white/10 opacity-80"
                                )}
                            >
                                {r.kind === "type"
                                    ? locale === "fr"
                                        ? "type"
                                        : "type"
                                    : locale === "fr"
                                      ? "const"
                                      : "const"}
                            </span>
                        </div>

                        <div className="mt-1 text-[12px] leading-5 opacity-70">
                            {r.description[locale]}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-3 whitespace-nowrap">
                <span className="font-mono text-xs opacity-75">{r.valueOrRef ?? "—"}</span>
            </td>
        </tr>
    );

    return (
        <div className="rounded-2xl bg-black/15 ring-1 ring-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 bg-black/10">
                <div className="text-xs tracking-[0.18em] opacity-55">{title}</div>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs opacity-60">
                        <tr className="border-b border-white/10">
                            <th className="text-left font-medium px-5 py-3 min-w-105">
                                {locale === "fr" ? "API" : "API"}
                            </th>
                            <th className="text-left font-medium px-5 py-3 whitespace-nowrap">
                                {locale === "fr" ? "Valeur / Référence" : "Value / Reference"}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="opacity-85">
                        {typeRows.length > 0 ? (
                            <>
                                <GroupRow label={groupTitle("type")} />
                                {typeRows.map(renderRow)}
                            </>
                        ) : null}

                        {constantRows.length > 0 ? (
                            <>
                                <GroupRow label={groupTitle("constant")} />
                                {constantRows.map(renderRow)}
                            </>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ============================================================================
   📋 Props table
============================================================================ */

function PropsTable({ rows, locale }: { rows: DocsPropRow[]; locale: "fr" | "en" }) {
    const systemRows = rows.filter((r) => r.fromSystem);
    const localRows = rows.filter((r) => !r.fromSystem);

    const groupTitle = (key: "system" | "local") => {
        if (locale === "fr") return key === "system" ? "PROPS SYSTÈME" : "PROPS LOCALES";
        return key === "system" ? "SYSTEM PROPS" : "LOCAL PROPS";
    };

    const requiredLabel = () => (locale === "fr" ? "requis" : "required");

    const GroupRow = ({ title, tone }: { title: string; tone: "system" | "local" }) => (
        <tr>
            <td
                colSpan={3}
                className={cn(
                    "px-5 py-3 text-xs tracking-[0.18em] font-medium",
                    tone === "system"
                        ? "bg-purple-500/10 text-purple-200/80 border-y border-purple-200/10"
                        : "bg-white/5 text-white/55 border-y border-white/10"
                )}
            >
                {title}
            </td>
        </tr>
    );

    const renderRow = (r: DocsPropRow, tone: "system" | "local") => (
        <tr
            key={r.name}
            className={cn(
                "border-b align-top",
                tone === "system" ? "border-emerald-200/10" : "border-white/5"
            )}
        >
            <td className="px-5 py-3">
                <div className="flex items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs opacity-90">{r.name}</span>

                            {r.required ? (
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1",
                                        tone === "system"
                                            ? "bg-emerald-500/10 ring-emerald-200/15 text-emerald-100/80"
                                            : "bg-white/5 ring-white/10 opacity-80"
                                    )}
                                >
                                    {requiredLabel()}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-1 text-[12px] leading-5 opacity-70">
                            {r.description[locale]}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-3 whitespace-nowrap">
                <span className="font-mono text-xs opacity-80">{r.type}</span>
            </td>

            <td className="px-5 py-3 whitespace-nowrap">
                <span className="font-mono text-xs opacity-70">{r.default ?? "—"}</span>
            </td>
        </tr>
    );

    return (
        <div className="rounded-2xl bg-black/15 ring-1 ring-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 bg-black/10">
                <div className="text-xs tracking-[0.18em] opacity-55">PROPS</div>
            </div>

            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs opacity-60">
                        <tr className="border-b border-white/10">
                            <th className="text-left font-medium px-5 py-3 min-w-105">Prop</th>
                            <th className="text-left font-medium px-5 py-3 whitespace-nowrap">
                                Type
                            </th>
                            <th className="text-left font-medium px-5 py-3 whitespace-nowrap">
                                Default
                            </th>
                        </tr>
                    </thead>

                    <tbody className="opacity-85">
                        {systemRows.length > 0 ? (
                            <>
                                <GroupRow title={groupTitle("system")} tone="system" />
                                {systemRows.map((r) => renderRow(r, "system"))}
                            </>
                        ) : null}

                        {localRows.length > 0 ? (
                            <>
                                <GroupRow title={groupTitle("local")} tone="local" />
                                {localRows.map((r) => renderRow(r, "local"))}
                            </>
                        ) : null}

                        {systemRows.length === 0 && localRows.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-5 py-6 text-sm opacity-60">
                                    {locale === "fr"
                                        ? "Aucune prop documentée."
                                        : "No documented props."}
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ============================================================================
   ✅ MAIN
============================================================================ */

export function PlaygroundComponentShell(props: PlaygroundComponentShellProps) {
    const {
        identity,
        propsTable,
        dsControls,
        extraControls,
        renderPreview,
        warnings,
        resolvedJson,
        defaultFixedTileWidthPx = 420,
        locale = "fr",

        previewMode = "dark",
        previewBg = "auto",
        codeString,
        previewExpandable = false,
        defaultPreviewExpanded = false,
    } = props;

    const [showCode, setShowCode] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const [previewExpanded, setPreviewExpanded] = React.useState<boolean>(
        previewExpandable ? defaultPreviewExpanded : false
    );

    const fixedW = previewExpanded ? "" : `md:w-[${defaultFixedTileWidthPx}px]`;

    const bgMode: ModeName = previewBg === "auto" ? previewMode : previewBg;

    const previewTileCls =
        bgMode === "light"
            ? "rounded-2xl ring-1 ring-black/10 bg-white text-black"
            : "rounded-2xl ring-1 ring-white/10 bg-black/30";

    const codeTheme = bgMode === "light" ? oneLight : oneDark;

    async function copyCode() {
        if (!codeString) return;
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            // fallback
            try {
                const ta = document.createElement("textarea");
                ta.value = codeString;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1200);
            } catch {
                // noop
            }
        }
    }

    React.useEffect(() => {
        if (!previewExpandable && previewExpanded) setPreviewExpanded(false);
    }, [previewExpandable, previewExpanded]);

    return (
        <div className="space-y-6">
            {/* Header (Identity) */}
            <div className="rounded-2xl bg-black/15 ring-1 ring-white/10 p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-[0.18em] opacity-55">COMPONENT</div>

                        <div className="mt-2 flex items-center gap-2">
                            {identity.emoji ? (
                                <span className="text-lg">{identity.emoji}</span>
                            ) : null}
                            <div className="text-lg font-semibold opacity-90">{identity.name}</div>
                        </div>

                        {identity.description?.[locale] ? (
                            <div className="mt-2 text-sm opacity-75 max-w-3xl">
                                {identity.description[locale]}
                            </div>
                        ) : null}

                        <div className="mt-3 flex flex-wrap gap-2">
                            {identity.kind ? (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-white/5 ring-1 ring-white/10 opacity-75">
                                    {identity.kind}
                                </span>
                            ) : null}

                            {identity.stability ? (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-white/5 ring-1 ring-white/10 opacity-75">
                                    {identity.stability}
                                </span>
                            ) : null}

                            {identity.since ? (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] bg-white/5 ring-1 ring-white/10 opacity-75">
                                    since {identity.since}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div
                className={cn(
                    "grid gap-6 min-w-0",
                    previewExpanded ? "grid-cols-1" : "lg:grid-cols-[420px_1fr]"
                )}
            >
                {/* Controls column */}
                <div className={cn("space-y-4", previewExpanded ? "order-2" : "order-1")}>
                    {/* DS controls */}
                    <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4">
                        <div className="text-xs tracking-[0.18em] opacity-55">DESIGN SYSTEM</div>
                        <div className="mt-4 space-y-4">{dsControls}</div>
                    </div>

                    {/* Extra controls */}
                    {extraControls ? (
                        <div className="rounded-2xl bg-black/15 ring-1 ring-white/10 p-4">
                            <div className="text-xs tracking-[0.18em] opacity-55">PLAYGROUND</div>
                            <div className="mt-4 space-y-4">{extraControls}</div>
                        </div>
                    ) : null}
                </div>

                {/* Preview + debug */}
                <div className={cn("space-y-4 min-w-0", previewExpanded ? "order-1" : "order-2")}>
                    {/* ✅ Single preview tile (NO extra text) */}
                    <div className="flex min-w-0">
                        <div className={cn(previewTileCls, "w-full", fixedW, "min-w-0")}>
                            {/* ✅ Header row + separator */}
                            <div
                                className={cn(
                                    "flex items-center justify-between gap-3",
                                    "p-4 pb-3 border-b",
                                    bgMode === "light" ? "border-black/10" : "border-white/10"
                                )}
                            >
                                <div className="text-xs tracking-[0.18em] opacity-55">PREVIEW</div>

                                <div className="flex items-center gap-2">
                                    {previewExpandable ? (
                                        <button
                                            type="button"
                                            onClick={() => setPreviewExpanded((v) => !v)}
                                            className={cn(
                                                "rounded-xl px-3 py-2 text-xs ring-1 transition",
                                                bgMode === "light"
                                                    ? "bg-black/5 ring-black/10 hover:bg-black/10"
                                                    : "bg-white/5 ring-white/10 hover:bg-white/10"
                                            )}
                                            aria-pressed={previewExpanded ? "true" : "false"}
                                            title={
                                                previewExpanded ? "Exit full width" : "Full width"
                                            }
                                        >
                                            {previewExpanded ? "↙︎ Shrink" : "↗︎ Expand"}
                                        </button>
                                    ) : null}

                                    {codeString ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowCode((v) => !v)}
                                            className={cn(
                                                "rounded-xl px-3 py-2 text-xs ring-1 transition",
                                                bgMode === "light"
                                                    ? "bg-black/5 ring-black/10 hover:bg-black/10"
                                                    : "bg-white/5 ring-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            Code
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="w-full min-w-0 p-4">{renderPreview(previewMode)}</div>
                        </div>
                    </div>

                    {/* ✅ Code card */}
                    {codeString && showCode ? (
                        <div
                            className={cn(
                                "rounded-2xl ring-1 overflow-hidden min-w-0",
                                bgMode === "light"
                                    ? "bg-white text-black ring-black/10"
                                    : "bg-black/45 ring-white/10"
                            )}
                        >
                            <div
                                className={cn(
                                    "px-4 py-3 border-b flex items-center justify-between gap-3",
                                    bgMode === "light"
                                        ? "border-black/10 bg-black/5"
                                        : "border-white/10 bg-black/30"
                                )}
                            >
                                <div className="text-xs tracking-[0.18em] opacity-55">CODE</div>

                                <button
                                    type="button"
                                    onClick={copyCode}
                                    className={cn(
                                        "rounded-xl px-3 py-2 text-xs ring-1 transition",
                                        bgMode === "light"
                                            ? "bg-black/5 ring-black/10 hover:bg-black/10"
                                            : "bg-white/5 ring-white/10 hover:bg-white/10"
                                    )}
                                >
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>

                            <div className="min-w-0 overflow-x-auto">
                                <SyntaxHighlighter
                                    language="tsx"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: "transparent",
                                        padding: "16px",
                                        fontSize: "12px",
                                        lineHeight: "1.5",
                                        minWidth: "max-content",
                                    }}
                                    codeTagProps={{ style: { whiteSpace: "pre" } }}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    ) : null}

                    {/* Warnings */}
                    {warnings && warnings.length > 0 ? (
                        <div className="rounded-2xl bg-black/25 ring-1 ring-white/10 p-4">
                            <div className="text-xs tracking-[0.18em] opacity-55">WARNINGS</div>
                            <div className="mt-2 space-y-2">
                                {warnings.map((w) => (
                                    <div key={w.code} className="text-sm opacity-80">
                                        <span className="font-mono opacity-90">{w.code}</span>
                                        <span className="opacity-40"> · </span>
                                        <span className="opacity-70">{w.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Resolved debug */}
                    {resolvedJson !== undefined ? (
                        <div className="rounded-2xl bg-black/45 ring-1 ring-white/10 overflow-hidden min-w-0">
                            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
                                <div className="text-xs tracking-[0.18em] opacity-55">RESOLVED</div>
                            </div>

                            <div className="min-w-0 overflow-x-auto">
                                <SyntaxHighlighter
                                    language="json"
                                    style={codeTheme}
                                    customStyle={{
                                        margin: 0,
                                        background: "transparent",
                                        padding: "16px",
                                        fontSize: "12px",
                                        lineHeight: "1.5",
                                        minWidth: "max-content",
                                    }}
                                    codeTagProps={{ style: { whiteSpace: "pre" } }}
                                >
                                    {JSON.stringify(resolvedJson, null, 2)}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Props table */}
            {propsTable && propsTable.length > 0 ? (
                <PropsTable rows={propsTable} locale={locale} />
            ) : null}

            {/* System API table */}
            <SystemApiTable locale={locale} />
        </div>
    );
}
