"use client";

// src/app/playground/components/intent-code-viewer/PlaygroundIntentCodeViewerClient.tsx
// PlaygroundIntentCodeViewerClient
// - Uses PlaygroundComponentShell to test IntentCodeViewer
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentCodeViewer,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentCodeViewerIdentity,
    IntentCodeViewerPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type ViewerLang = "text" | "ts" | "tsx" | "json" | "bash" | "css" | "sql";

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
   🧪 DEMO DATA
============================================================================ */

const DEMO_CODE_TS = `import React from "react";

type User = { id: string; name: string };

export function Example() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            setUsers(await res.json());
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button onClick={load} disabled={loading}>
                {loading ? "Loading…" : "Load users"}
            </button>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    );
}
`;

const DEMO_CODE_JSON = `{
    "id": "ch_14",
    "title": "Serment de Renouveau",
    "status": "current",
    "progress": 0.62,
    "tags": ["renewal", "discipline", "clarity"]
}
`;

/**
 * Minimal “fake Prism-like” highlighted HTML.
 * Purpose: let you validate that token colors respond to intent, without wiring Prism/Shiki.
 */
const DEMO_HTML_PRISMISH = `<span class="token keyword">const</span> <span class="token function">answer</span> <span class="token operator">=</span> <span class="token number">42</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token parameter">a</span><span class="token punctuation">,</span> <span class="token parameter">b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token parameter">a</span> <span class="token operator">+</span> <span class="token parameter">b</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// comments should be softer</span>
<span class="token string">"strings should pop"</span>
`;

type ContentMode = "plain" | "highlighted";

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentCodeViewerClient() {
    // ✅ preview mode (controls single preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS controls
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local controls
    const [contentMode, setContentMode] = useState<ContentMode>("plain");
    const [language, setLanguage] = useState<ViewerLang>("ts");

    const [showHeader, setShowHeader] = useState(true);
    const [showMeta, setShowMeta] = useState(true);
    const [copyable, setCopyable] = useState(true);

    const [wrap, setWrap] = useState(false);
    const [showLineNumbers, setShowLineNumbers] = useState(false);
    const [maxHeightEnabled, setMaxHeightEnabled] = useState(false);

    const [showFooter, setShowFooter] = useState(false);

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

    const computedCode = useMemo(() => {
        if (language === "json") return DEMO_CODE_JSON;
        if (language === "bash") return `npm i intent-design-system\npnpm dev\n# hello`;
        if (language === "css") return `.intent-code-viewer { border-radius: 1.25rem; }`;
        if (language === "sql") return `select * from journeys where status = 'current';`;
        // ts/tsx/text
        return DEMO_CODE_TS;
    }, [language]);

    const computedHtml = useMemo(() => {
        // For demo: use prismish tokens no matter the language
        return DEMO_HTML_PRISMISH;
    }, []);

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
            <SelectRow label="Content">
                <Select
                    value={contentMode}
                    onChange={(v) => setContentMode(v as ContentMode)}
                    options={["plain", "highlighted"]}
                />
                <div className="mt-2 text-[11px] opacity-55">
                    <span className="font-mono">highlighted</span> utilise un HTML “Prism-like”
                    (tokens) pour tester les couleurs intent sans brancher Prism/Shiki.
                </div>
            </SelectRow>

            <SelectRow label="Language">
                <Select
                    value={language}
                    onChange={(v) => setLanguage(v as ViewerLang)}
                    options={["ts", "tsx", "json", "bash", "css", "sql", "text"]}
                />
            </SelectRow>

            <SelectRow label="Header">
                <div className="space-y-2">
                    <CheckboxRow label="showHeader" checked={showHeader} onChange={setShowHeader} />
                    <CheckboxRow label="showMeta" checked={showMeta} onChange={setShowMeta} />
                    <CheckboxRow label="copyable" checked={copyable} onChange={setCopyable} />
                </div>
            </SelectRow>

            <SelectRow label="Body">
                <div className="space-y-2">
                    <CheckboxRow label="wrap" checked={wrap} onChange={setWrap} />
                    <CheckboxRow
                        label="showLineNumbers"
                        checked={showLineNumbers}
                        onChange={setShowLineNumbers}
                    />
                    <CheckboxRow
                        label="maxHeight (320px)"
                        checked={maxHeightEnabled}
                        onChange={setMaxHeightEnabled}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Footer">
                <div className="space-y-2">
                    <CheckboxRow label="showFooter" checked={showFooter} onChange={setShowFooter} />
                </div>
            </SelectRow>
        </>
    );

    /* ============================================================================
       🧾 Code panel snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const headerLines = showHeader
            ? `    title="IntentCodeViewer"\n${
                  showMeta ? `    meta="${language.toUpperCase()}"\n` : ""
              }`
            : "";

        const contentLine =
            contentMode === "highlighted" ? `    html={highlightedHtml}\n` : `    code={code}\n`;

        const footerLine = showFooter ? `    footer={<span>Footer slot</span>}\n` : "";

        const maxHeightLine = maxHeightEnabled ? `    maxHeight={320}\n` : "";

        return `import { IntentCodeViewer } from "intent-design-system";

export function Example({ code, highlightedHtml }: { code: string; highlightedHtml: string }) {
  return (
    <IntentCodeViewer
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
${headerLines}      language="${language}"
      wrap={${wrap}}
      showLineNumbers={${showLineNumbers}}
${maxHeightLine}      copyable={${copyable}}
${footerLine}${contentLine}    />
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
        showHeader,
        showMeta,
        copyable,
        contentMode,
        language,
        wrap,
        showLineNumbers,
        maxHeightEnabled,
        showFooter,
    ]);

    const titleNode = showHeader ? "IntentCodeViewer" : undefined;
    const metaNode =
        showHeader && showMeta ? (
            <span className="font-mono">{language.toUpperCase()}</span>
        ) : undefined;

    return (
        <PlaygroundComponentShell
            identity={IntentCodeViewerIdentity}
            propsTable={IntentCodeViewerPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className="w-full min-w-0">
                        <IntentCodeViewer
                            {...dsInput}
                            mode={mode}
                            title={titleNode}
                            meta={metaNode}
                            language={language}
                            wrap={wrap}
                            showLineNumbers={showLineNumbers}
                            maxHeight={maxHeightEnabled ? 320 : "auto"}
                            copyable={copyable}
                            footer={showFooter ? <span>Footer slot</span> : undefined}
                            code={contentMode === "plain" ? computedCode : undefined}
                            html={contentMode === "highlighted" ? computedHtml : undefined}
                        />
                        <div className="mt-3 text-xs opacity-55">
                            Astuce: passe en <span className="font-mono">highlighted</span> pour
                            voir les tokens réagir à l’intent (keyword/string/number/comment).
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
