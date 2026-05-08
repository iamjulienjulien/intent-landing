"use client";

// src/app/playground/components/intent-control-navlist/PlaygroundIntentControlNavListClient.tsx
// PlaygroundIntentControlNavListClient
// - Uses PlaygroundComponentShell to test IntentControlNavList
// - Uses DS exports: Identity + PropsTable
// - ✅ Updated for PlaygroundComponentShell split controls (dsControls / extraControls)
// - ✅ Adds previewMode toggle + codeString for the Code drawer

import React, { useMemo, useState } from "react";

import {
    IntentControlNavList,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,
    IntentControlNavListIdentity,
    IntentControlNavListPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type NavListSize = "xs" | "sm" | "md" | "lg";
type NavListDensity = "compact" | "comfortable";
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

/* ============================================================================
   ✅ PLAYGROUND
============================================================================ */

export default function PlaygroundIntentControlNavListClient() {
    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");

    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Preview + component mode
    const [mode, setMode] = useState<PreviewMode>("dark");

    // NavList props
    const [size, setSize] = useState<NavListSize>("md");
    const [density, setDensity] = useState<NavListDensity>("comfortable");
    const [fullWidth, setFullWidth] = useState(true);
    const [readOnly, setReadOnly] = useState(false);

    // Wrapper slots
    const [withHeader, setWithHeader] = useState(true);
    const [withFooter, setWithFooter] = useState(false);
    const [divider, setDivider] = useState(true);

    // Items behavior
    const [active, setActive] = useState("overview");
    const [withIcons, setWithIcons] = useState(true);
    const [withDescriptions, setWithDescriptions] = useState(true);
    const [withMeta, setWithMeta] = useState(true);
    const [withDisabledItem, setWithDisabledItem] = useState(true);
    const [withDangerItem, setWithDangerItem] = useState(true);
    const [withHrefItem, setWithHrefItem] = useState(true);
    const [preventLinkNavigation, setPreventLinkNavigation] = useState(true);

    // Item styling overrides
    const [useActiveOverride, setUseActiveOverride] = useState(true);
    const [useInactiveOverride, setUseInactiveOverride] = useState(false);
    const [itemGlow, setItemGlow] = useState(false);

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

    const items = useMemo(() => {
        const base: Array<any> = [
            {
                id: "overview",
                label: "Overview",
                icon: withIcons ? <span aria-hidden>⌁</span> : undefined,
                description: withDescriptions ? "Dashboard & highlights" : undefined,
                meta: withMeta ? <span aria-hidden>⌘1</span> : undefined,
                searchText: "overview",
            },
            {
                id: "tokens",
                label: "Tokens",
                icon: withIcons ? <span aria-hidden>⟡</span> : undefined,
                description: withDescriptions ? "Theme, intents, tones" : undefined,
                meta: withMeta ? <span aria-hidden>⌘2</span> : undefined,
                searchText: "tokens",
            },
            {
                id: "docs",
                label: "Docs",
                icon: withIcons ? <span aria-hidden>⧉</span> : undefined,
                description: withDescriptions ? "Components & usage" : undefined,
                meta: withMeta ? <span aria-hidden>↗</span> : undefined,
                searchText: "docs",
            },
        ];

        if (withHrefItem) {
            base.push({
                id: "external",
                label: "External link",
                icon: withIcons ? <span aria-hidden>⟴</span> : undefined,
                description: withDescriptions ? "href item (anchor)" : undefined,
                meta: withMeta ? <span aria-hidden>↗</span> : undefined,
                href: "https://example.com",
                target: "_blank",
                rel: "noreferrer",
                searchText: "external",
            });
        }

        if (withDisabledItem) {
            base.push({
                id: "locked",
                label: "Locked",
                icon: withIcons ? <span aria-hidden>⛉</span> : undefined,
                description: withDescriptions ? "Disabled item" : undefined,
                disabled: true,
                meta: withMeta ? <span aria-hidden>⛔</span> : undefined,
                searchText: "locked",
            });
        }

        if (withDangerItem) {
            base.push({
                id: "danger",
                label: "Danger zone",
                icon: withIcons ? <span aria-hidden>⚑</span> : undefined,
                description: withDescriptions ? "Destructive action" : undefined,
                dangerous: true,
                meta: withMeta ? <span aria-hidden>!</span> : undefined,
                searchText: "danger",
                onSelect: () => {
                    // noop (demo)
                    console.log("Danger selected");
                },
            });
        }

        return base.map((it) => ({
            id: String(it.id),
            label: it.label,
            icon: it.icon,
            meta: it.meta,
            description: it.description,
            disabled: Boolean(it.disabled),
            dangerous: Boolean(it.dangerous),
            href: it.href,
            target: it.target,
            rel: it.rel,
            searchText: it.searchText,
            onSelect: it.onSelect,
        }));
    }, [withIcons, withDescriptions, withMeta, withDisabledItem, withDangerItem, withHrefItem]);

    // Ensure active stays on enabled item
    React.useEffect(() => {
        const current = items.find((it) => it.id === active);
        if (current && !current.disabled) return;

        const firstEnabled = items.find((it) => !it.disabled);
        if (firstEnabled) setActive(firstEnabled.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const headerNode = withHeader ? (
        <div className="space-y-1">
            <div className="text-sm font-semibold">Navigation</div>
            <div className="text-xs opacity-60">
                Teste <span className="font-mono">↑/↓</span>,{" "}
                <span className="font-mono">Home/End</span>, et le typeahead.
            </div>
        </div>
    ) : null;

    const footerNode = withFooter ? (
        <div className="text-xs opacity-60">
            Footer slot. Essayez <span className="font-mono">readOnly</span> vs{" "}
            <span className="font-mono">disabled</span>.
        </div>
    ) : null;

    const activeOverride = useMemo(() => {
        if (!useActiveOverride) return undefined;
        // A little “selected pill” feel: push active toward empowered/outlined
        return {
            intent: "empowered" as Intent,
            variant: "outlined" as Variant,
            intensity: "medium" as Intensity,
        };
    }, [useActiveOverride]);

    const inactiveOverride = useMemo(() => {
        if (!useInactiveOverride) return undefined;
        return {
            intent: "informed" as Intent,
            variant: "ghost" as Variant,
            intensity: "soft" as Intensity,
        };
    }, [useInactiveOverride]);

    const dsControls = (
        <>
            <SelectRow label="Mode">
                <Select
                    value={mode}
                    onChange={(v) => setMode(v as PreviewMode)}
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
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                </div>
            </SelectRow>
        </>
    );

    const extraControls = (
        <>
            <SelectRow label="Size">
                <Select
                    value={size}
                    onChange={(v) => setSize(v as NavListSize)}
                    options={["xs", "sm", "md", "lg"]}
                />
            </SelectRow>

            <SelectRow label="Density">
                <Select
                    value={density}
                    onChange={(v) => setDensity(v as NavListDensity)}
                    options={["compact", "comfortable"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="divider" checked={divider} onChange={setDivider} />
                </div>
            </SelectRow>

            <SelectRow label="Slots">
                <div className="space-y-2">
                    <CheckboxRow label="withHeader" checked={withHeader} onChange={setWithHeader} />
                    <CheckboxRow label="withFooter" checked={withFooter} onChange={setWithFooter} />
                </div>
            </SelectRow>

            <SelectRow label="Items">
                <div className="space-y-2">
                    <CheckboxRow label="withIcons" checked={withIcons} onChange={setWithIcons} />
                    <CheckboxRow
                        label="withDescriptions"
                        checked={withDescriptions}
                        onChange={setWithDescriptions}
                    />
                    <CheckboxRow label="withMeta" checked={withMeta} onChange={setWithMeta} />
                    <CheckboxRow
                        label="withDisabledItem"
                        checked={withDisabledItem}
                        onChange={setWithDisabledItem}
                    />
                    <CheckboxRow
                        label="withDangerItem"
                        checked={withDangerItem}
                        onChange={setWithDangerItem}
                    />
                    <CheckboxRow
                        label="withHrefItem"
                        checked={withHrefItem}
                        onChange={setWithHrefItem}
                    />
                    <CheckboxRow
                        label="preventLinkNavigation"
                        checked={preventLinkNavigation}
                        onChange={setPreventLinkNavigation}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Item styling">
                <div className="space-y-2">
                    <CheckboxRow
                        label="activeItem override"
                        checked={useActiveOverride}
                        onChange={setUseActiveOverride}
                    />
                    <CheckboxRow
                        label="inactiveItem override"
                        checked={useInactiveOverride}
                        onChange={setUseInactiveOverride}
                    />
                    <CheckboxRow label="itemGlow" checked={itemGlow} onChange={setItemGlow} />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: focus le listbox puis <span className="font-mono">↑/↓</span>,{" "}
                <span className="font-mono">Home/End</span>,{" "}
                <span className="font-mono">Enter/Espace</span>. Typeahead: tape “d”, “t”, “o”… 😼
            </div>
        </>
    );

    // ✅ Code snapshot (no JSON.stringify ReactNodes)
    const codeString = useMemo(() => {
        const safe = (v: unknown) => JSON.stringify(v);

        const toneLine = toneEnabled ? `tone=${safe(tone)}` : "";
        const glowLine = (() => {
            if (aestheticEnabled) {
                const g = typeof glow === "string" ? glow : "aurora";
                return `glow=${safe(g)}`;
            }
            if (glow === true) return `glow={true}`;
            return "";
        })();

        const dsLines = [
            `intent=${safe(intent)}`,
            `variant=${safe(variant)}`,
            toneLine,
            glowLine,
            `intensity=${safe(intensity)}`,
            `disabled={${safe(disabled)}}`,
            `mode=${safe(mode)}`,
        ].filter(Boolean);

        const activeOverrideLine = useActiveOverride
            ? `activeItem={{ intent: "empowered", variant: "outlined", intensity: "medium" }}`
            : "";

        const inactiveOverrideLine = useInactiveOverride
            ? `inactiveItem={{ intent: "informed", variant: "ghost", intensity: "soft" }}`
            : "";

        const itemsCode = `[
    { id: "overview", label: "Overview", icon: <span aria-hidden>⌁</span>, description: "Dashboard & highlights", meta: <span aria-hidden>⌘1</span> },
    { id: "tokens", label: "Tokens", icon: <span aria-hidden>⟡</span>, description: "Theme, intents, tones", meta: <span aria-hidden>⌘2</span> },
    { id: "docs", label: "Docs", icon: <span aria-hidden>⧉</span>, description: "Components & usage", meta: <span aria-hidden>↗</span> },
    { id: "external", label: "External link", href: "https://example.com", target: "_blank", rel: "noreferrer" },
    { id: "locked", label: "Locked", disabled: true },
    { id: "danger", label: "Danger zone", dangerous: true, onSelect: () => console.log("danger") },
]`;

        return `import { IntentControlNavList } from "intent-design-system";

export function Example() {
    const items = ${itemsCode};

    return (
        <IntentControlNavList
            ${dsLines.join("\n            ")}
            items={items}
            value=${safe(active)}
            onValueChange={(id) => console.log(id)}
            size=${safe(size)}
            density=${safe(density)}
            fullWidth={${safe(fullWidth)}}
            readOnly={${safe(readOnly)}}
            header={<div>Navigation</div>}
            footer={<div>Footer slot</div>}
            divider={${safe(divider)}}
            itemGlow={${safe(itemGlow)}}
            preventLinkNavigation={${safe(preventLinkNavigation)}}
            ${activeOverrideLine}
            ${inactiveOverrideLine}
        />
    );
}`;
    }, [
        intent,
        variant,
        toneEnabled,
        tone,
        aestheticEnabled,
        glow,
        intensity,
        disabled,
        mode,
        active,
        size,
        density,
        fullWidth,
        readOnly,
        divider,
        itemGlow,
        preventLinkNavigation,
        useActiveOverride,
        useInactiveOverride,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlNavListIdentity}
            propsTable={IntentControlNavListPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={mode}
            codeString={codeString}
            previewExpandable
            renderPreview={(m) => (
                <div className="w-full min-w-0">
                    <div className="grid gap-4 md:grid-cols-[320px,1fr]">
                        <div className="w-full min-w-0">
                            <IntentControlNavList
                                {...(dsInput as any)}
                                mode={m}
                                items={items as any}
                                value={active}
                                onValueChange={setActive}
                                size={size}
                                density={density}
                                fullWidth={fullWidth}
                                readOnly={readOnly}
                                header={headerNode ?? undefined}
                                footer={footerNode ?? undefined}
                                divider={divider}
                                itemGlow={itemGlow}
                                preventLinkNavigation={preventLinkNavigation}
                                activeItem={activeOverride as any}
                                inactiveItem={inactiveOverride as any}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
                                <div className="text-xs tracking-[0.18em] opacity-55">CONTENT</div>
                                <div className="mt-3 text-sm opacity-85">
                                    Active: <span className="font-mono">{active}</span>
                                </div>
                                <div className="mt-2 text-sm opacity-70">
                                    Ici tu peux render ta vraie page et utiliser le NavList comme
                                    sidebar.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
