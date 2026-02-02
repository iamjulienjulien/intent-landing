"use client";

// src/app/playground/components/intent-control-tabs/PlaygroundIntentControlTabsClient.tsx

import React, { useMemo, useState } from "react";

import {
    IntentControlTabs,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,
    IntentControlTabsIdentity,
    IntentControlTabsPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type TabsSize = "xs" | "sm" | "md" | "lg";
type TabsOrientation = "horizontal" | "vertical";
type PreviewMode = "dark" | "light";

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

export default function PlaygroundIntentControlTabsClient() {
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    const [size, setSize] = useState<TabsSize>("md");
    const [orientation, setOrientation] = useState<TabsOrientation>("horizontal");

    const [fullWidth, setFullWidth] = useState(true);
    const [equal, setEqual] = useState(true);
    const [readOnly, setReadOnly] = useState(false);

    const [active, setActive] = useState("overview");

    // Mode (preview + component mode)
    const [mode, setMode] = useState<PreviewMode>("dark");

    // Items / content controls
    const [withIcons, setWithIcons] = useState(true);
    const [withDisabledItem, setWithDisabledItem] = useState(true);
    const [iconOnly, setIconOnly] = useState(false);

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
        const base = [
            {
                value: "overview",
                label: iconOnly ? "" : "Overview",
                ariaLabel: iconOnly ? "Overview" : undefined,
                leftIcon: withIcons ? <span aria-hidden>⌁</span> : undefined,
            },
            {
                value: "tokens",
                label: iconOnly ? "" : "Tokens",
                ariaLabel: iconOnly ? "Tokens" : undefined,
                leftIcon: withIcons ? <span aria-hidden>⟡</span> : undefined,
            },
            {
                value: "docs",
                label: iconOnly ? "" : "Docs",
                ariaLabel: iconOnly ? "Docs" : undefined,
                leftIcon: withIcons ? <span aria-hidden>⧉</span> : undefined,
                rightIcon: withIcons ? <span aria-hidden>↗</span> : undefined,
            },
        ] as Array<any>;

        if (withDisabledItem) {
            base.push({
                value: "locked",
                label: iconOnly ? "" : "Locked",
                ariaLabel: iconOnly ? "Locked" : undefined,
                disabled: true,
                leftIcon: withIcons ? <span aria-hidden>⛉</span> : undefined,
            });
        }

        return base.map((it) => ({
            value: String(it.value),
            label: it.label,
            disabled: Boolean(it.disabled),
            leftIcon: it.leftIcon,
            rightIcon: it.rightIcon,
            ariaLabel: it.ariaLabel,
        }));
    }, [withIcons, withDisabledItem, iconOnly]);

    React.useEffect(() => {
        const current = items.find((it) => it.value === active);
        if (current && !current.disabled) return;

        const firstEnabled = items.find((it) => !it.disabled);
        if (firstEnabled) setActive(firstEnabled.value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

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
                    onChange={(v) => setSize(v as TabsSize)}
                    options={["xs", "sm", "md", "lg"]}
                />
            </SelectRow>

            <SelectRow label="Orientation">
                <Select
                    value={orientation}
                    onChange={(v) => setOrientation(v as TabsOrientation)}
                    options={["horizontal", "vertical"]}
                />
            </SelectRow>

            <SelectRow label="Layout">
                <div className="space-y-2">
                    <CheckboxRow label="fullWidth" checked={fullWidth} onChange={setFullWidth} />
                    <CheckboxRow label="equal" checked={equal} onChange={setEqual} />
                </div>
            </SelectRow>

            <SelectRow label="Items">
                <div className="space-y-2">
                    <CheckboxRow label="withIcons" checked={withIcons} onChange={setWithIcons} />
                    <CheckboxRow
                        label="withDisabledItem"
                        checked={withDisabledItem}
                        onChange={setWithDisabledItem}
                    />
                    <CheckboxRow label="iconOnly" checked={iconOnly} onChange={setIconOnly} />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Astuce: navigation clavier <span className="font-mono">←/→</span> (ou{" "}
                <span className="font-mono">↑/↓</span>),
                <span className="font-mono"> Home/End</span>. Teste{" "}
                <span className="font-mono">readOnly</span> vs{" "}
                <span className="font-mono">disabled</span>.
            </div>
        </>
    );

    // ✅ Code snapshot (simple + stable) — NO JSON.stringify(items) because ReactNode cycles
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

        const itemsCode = (() => {
            const icon = (glyph: string) =>
                withIcons ? `<span aria-hidden>${glyph}</span>` : "undefined";

            const label = (txt: string) => (iconOnly ? `""` : safe(txt));
            const aria = (txt: string) => (iconOnly ? safe(txt) : "undefined");

            const base = [
                `{
        value: "overview",
        label: ${label("Overview")},
        ariaLabel: ${aria("Overview")},
        leftIcon: ${icon("⌁")},
    }`,
                `{
        value: "tokens",
        label: ${label("Tokens")},
        ariaLabel: ${aria("Tokens")},
        leftIcon: ${icon("⟡")},
    }`,
                `{
        value: "docs",
        label: ${label("Docs")},
        ariaLabel: ${aria("Docs")},
        leftIcon: ${icon("⧉")},
        rightIcon: ${withIcons ? `<span aria-hidden>↗</span>` : "undefined"},
    }`,
            ];

            if (withDisabledItem) {
                base.push(`{
        value: "locked",
        label: ${label("Locked")},
        ariaLabel: ${aria("Locked")},
        disabled: true,
        leftIcon: ${icon("⛉")},
    }`);
            }

            return `[
    ${base.join(",\n    ")}
]`;
        })();

        return `import { IntentControlTabs } from "intent-design-system";

export function Example() {
    const items = ${itemsCode};

    return (
        <IntentControlTabs
            ${dsLines.join("\n            ")}
            items={items}
            value=${safe(active)}
            onValueChange={(v) => console.log(v)}
            size=${safe(size)}
            orientation=${safe(orientation)}
            fullWidth={${safe(fullWidth)}}
            equal={${safe(equal)}}
            readOnly={${safe(readOnly)}}
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
        orientation,
        fullWidth,
        equal,
        readOnly,
        withIcons,
        withDisabledItem,
        iconOnly,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentControlTabsIdentity}
            propsTable={IntentControlTabsPropsTable}
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
                    <div className={cn("w-full min-w-0", fullWidth ? "" : "inline-block")}>
                        <IntentControlTabs
                            {...dsInput}
                            mode={m}
                            items={items as any}
                            value={active}
                            onValueChange={setActive}
                            size={size}
                            orientation={orientation}
                            fullWidth={fullWidth}
                            equal={equal}
                            readOnly={readOnly}
                        />
                    </div>
                </div>
            )}
        />
    );
}
