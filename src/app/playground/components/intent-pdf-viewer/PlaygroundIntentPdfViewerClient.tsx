"use client";

// src/app/playground/components/intent-pdf-viewer/PlaygroundIntentPdfViewerClient.tsx
// PlaygroundIntentPdfViewerClient
// - Uses PlaygroundComponentShell to test IntentPdfViewer
// - Uses DS exports: Identity + PropsTable
// - Uses a local /public PDF: /a-game-of-thrones-the-board-game-rulebook.pdf

import React, { useMemo, useState } from "react";

import {
    IntentPdfViewer,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports from DS
    IntentPdfViewerIdentity,
    IntentPdfViewerPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type PdfRenderer = "iframe" | "object";
type PdfFit = "contain" | "cover" | "auto";

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
   🧪 DEMO DATA
============================================================================ */

const DEMO_PDF_SRC = "/a-game-of-thrones-the-board-game-rulebook.pdf";

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentPdfViewerClient() {
    // ✅ preview mode (controls preview tile background + mode passed to component)
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS controls
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local controls
    const [renderer, setRenderer] = useState<PdfRenderer>("iframe");
    const [fit, setFit] = useState<PdfFit>("contain");

    const [showHeader, setShowHeader] = useState(true);
    const [showMeta, setShowMeta] = useState(true);

    const [openable, setOpenable] = useState(true);
    const [downloadable, setDownloadable] = useState(false);

    const [hideToolbar, setHideToolbar] = useState(false);
    const [allowFullScreen, setAllowFullScreen] = useState(true);

    const [height, setHeight] = useState<string>("520");
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
            <SelectRow label="PDF">
                <div className="space-y-2">
                    <div className="text-xs opacity-60">
                        Source: <span className="font-mono">{DEMO_PDF_SRC}</span>
                    </div>
                </div>
            </SelectRow>

            <SelectRow label="Renderer">
                <Select
                    value={renderer}
                    onChange={(v) => setRenderer(v as PdfRenderer)}
                    options={["iframe", "object"]}
                />
                <div className="mt-2 text-[11px] opacity-55">
                    <span className="font-mono">object</span> peut mieux fallback selon navigateurs.
                </div>
            </SelectRow>

            <SelectRow label="Fit">
                <Select
                    value={fit}
                    onChange={(v) => setFit(v as PdfFit)}
                    options={["contain", "cover", "auto"]}
                />
                <div className="mt-2 text-[11px] opacity-55">
                    Hook CSS (certains viewers natifs ignorent{" "}
                    <span className="font-mono">object-fit</span>).
                </div>
            </SelectRow>

            <SelectRow label="Header">
                <div className="space-y-2">
                    <CheckboxRow label="showHeader" checked={showHeader} onChange={setShowHeader} />
                    <CheckboxRow label="showMeta" checked={showMeta} onChange={setShowMeta} />
                </div>
            </SelectRow>

            <SelectRow label="Actions">
                <div className="space-y-2">
                    <CheckboxRow label="openable" checked={openable} onChange={setOpenable} />
                    <CheckboxRow
                        label="downloadable"
                        checked={downloadable}
                        onChange={setDownloadable}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Viewer">
                <div className="space-y-2">
                    <CheckboxRow
                        label="hideToolbar"
                        checked={hideToolbar}
                        onChange={setHideToolbar}
                    />
                    <CheckboxRow
                        label="allowFullScreen"
                        checked={allowFullScreen}
                        onChange={setAllowFullScreen}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Size">
                <Select
                    value={height}
                    onChange={setHeight}
                    options={["360", "420", "520", "640", "780"]}
                />
                <div className="mt-2">
                    <CheckboxRow
                        label="maxHeight (560px scroll)"
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
            ? `    title="Rulebook"\n${
                  showMeta ? `    meta={<span className="font-mono">GOT · PDF</span>}\n` : ""
              }`
            : "";

        const footerLine = showFooter ? `    footer={<span>Footer slot</span>}\n` : "";

        const maxHeightLine = maxHeightEnabled ? `    maxHeight={560}\n` : "";

        return `import { IntentPdfViewer } from "intent-design-system";

export function Example() {
  return (
    <IntentPdfViewer
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      src="${DEMO_PDF_SRC}"
${headerLines}      renderer="${renderer}"
      fit="${fit}"
      height={${Number(height)}}
${maxHeightLine}      hideToolbar={${hideToolbar}}
      allowFullScreen={${allowFullScreen}}
      openable={${openable}}
      downloadable={${downloadable}}
${footerLine}    />
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
        renderer,
        fit,
        height,
        maxHeightEnabled,
        hideToolbar,
        allowFullScreen,
        openable,
        downloadable,
        showHeader,
        showMeta,
        showFooter,
    ]);

    const titleNode = showHeader ? "Rulebook" : undefined;
    const metaNode =
        showHeader && showMeta ? (
            <span className="font-mono">A Game of Thrones · Rulebook</span>
        ) : undefined;

    return (
        <PlaygroundComponentShell
            identity={IntentPdfViewerIdentity}
            propsTable={IntentPdfViewerPropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <IntentPdfViewer
                        {...dsInput}
                        mode={mode}
                        src={DEMO_PDF_SRC}
                        title={titleNode}
                        meta={metaNode}
                        renderer={renderer}
                        fit={fit}
                        height={Number(height)}
                        maxHeight={maxHeightEnabled ? 560 : "auto"}
                        hideToolbar={hideToolbar}
                        allowFullScreen={allowFullScreen}
                        openable={openable}
                        downloadable={downloadable}
                        footer={
                            showFooter ? (
                                <span className="opacity-80">
                                    Conseil: active <span className="font-mono">hideToolbar</span>{" "}
                                    pour un rendu plus “clean” (selon navigateur).
                                </span>
                            ) : undefined
                        }
                        onOpen={(s) => {
                            // eslint-disable-next-line no-console
                            console.log("IntentPdfViewer onOpen:", s);
                        }}
                        onDownload={(s) => {
                            // eslint-disable-next-line no-console
                            console.log("IntentPdfViewer onDownload:", s);
                        }}
                    />

                    <div className="mt-3 text-xs opacity-55">
                        Astuce: teste <span className="font-mono">renderer="object"</span> si Safari
                        fait son prince capricieux 🐉
                    </div>
                </div>
            )}
        />
    );
}
