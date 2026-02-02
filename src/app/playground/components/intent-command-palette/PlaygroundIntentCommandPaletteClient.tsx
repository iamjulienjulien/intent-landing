"use client";

// src/app/playground/components/intent-command-palette/PlaygroundIntentCommandPaletteClient.tsx
// PlaygroundIntentCommandPaletteClient
// - Uses PlaygroundComponentShell to test IntentCommandPalette
// - Uses DS exports: Identity + PropsTable
// - Includes sample groups/items + selection log

import React, { useMemo, useState } from "react";

import {
    IntentCommandPalette,
    type IntentCommandPaletteGroup,
    type IntentCommandPaletteItem,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentCommandPaletteIdentity,
    IntentCommandPalettePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type Hotkey = "mod+k" | "mod+p";

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
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentCommandPaletteClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS
    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Local controls
    const [open, setOpen] = useState(false);
    const [enableGlobalHotkey, setEnableGlobalHotkey] = useState(true);
    const [hotkey, setHotkey] = useState<Hotkey>("mod+k");

    const [closeOnSelect, setCloseOnSelect] = useState(true);
    const [placeholder, setPlaceholder] = useState("Search…");
    const [emptyLabel, setEmptyLabel] = useState("No results");

    const [showFooter, setShowFooter] = useState(true);
    const [useIcons, setUseIcons] = useState(true);
    const [addDisabledItems, setAddDisabledItems] = useState(true);

    const [selectionLog, setSelectionLog] = useState<string[]>([]);

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

    const groups = useMemo<IntentCommandPaletteGroup[]>(() => {
        const icon = (glyph: string) =>
            useIcons ? (
                <span aria-hidden className="opacity-80">
                    {glyph}
                </span>
            ) : undefined;

        const mk = (
            id: string,
            label: string,
            description?: string,
            extra?: Partial<IntentCommandPaletteItem>
        ) =>
            ({
                id,
                label,
                description,
                leftIcon: extra?.leftIcon ?? icon("✦"),
                rightHint: extra?.rightHint,
                disabled: extra?.disabled,
                keywords: extra?.keywords,
                onSelect: (item) => {
                    const line = `${new Date().toLocaleTimeString()} · ${item.label}`;
                    setSelectionLog((prev) => [line, ...prev].slice(0, 8));
                },
            }) satisfies IntentCommandPaletteItem;

        const base: IntentCommandPaletteGroup[] = [
            {
                id: "navigation",
                label: "Navigation",
                items: [
                    mk("go-home", "Go to Home", "Return to the main screen", {
                        leftIcon: icon("⌂"),
                        rightHint: "Enter",
                        keywords: ["home", "start"],
                    }),
                    mk("open-map", "Open Map", "Jump to the map view", {
                        leftIcon: icon("⌖"),
                        rightHint: "Enter",
                        keywords: ["poi", "leaflet", "map"],
                    }),
                    mk("open-quests", "Open Quests", "See your active quests", {
                        leftIcon: icon("⚑"),
                        rightHint: "Enter",
                        keywords: ["missions", "chapters"],
                    }),
                ],
            },
            {
                id: "actions",
                label: "Actions",
                items: [
                    mk("new-quest", "New Quest", "Create a quest from an idea", {
                        leftIcon: icon("＋"),
                        rightHint: "Enter",
                        keywords: ["create", "add"],
                    }),
                    mk("new-note", "New Note", "Capture a quick thought", {
                        leftIcon: icon("✎"),
                        rightHint: "Enter",
                        keywords: ["memo", "scratch"],
                    }),
                    mk("toggle-mode", "Toggle Mode", "Switch dark/light", {
                        leftIcon: icon("◐"),
                        rightHint: "Enter",
                        keywords: ["theme", "appearance"],
                    }),
                ],
            },
        ];

        if (addDisabledItems) {
            base.push({
                id: "danger",
                label: "Danger Zone",
                items: [
                    mk("wipe-cache", "Wipe Cache", "Clear local cache (demo)", {
                        leftIcon: icon("⚠"),
                        rightHint: "Enter",
                        disabled: true,
                        keywords: ["reset", "clear"],
                    }),
                ],
            });
        }

        return base;
    }, [useIcons, addDisabledItems]);

    const footer = useMemo(() => {
        if (!showFooter) return null;

        return (
            <div className="flex items-center justify-between text-xs opacity-70">
                <div className="flex items-center gap-2">
                    <span className="font-mono">↑↓</span>
                    <span>navigate</span>
                    <span className="opacity-40">·</span>
                    <span className="font-mono">Enter</span>
                    <span>select</span>
                    <span className="opacity-40">·</span>
                    <span className="font-mono">Esc</span>
                    <span>close</span>
                </div>

                <div className="font-mono opacity-60">
                    {hotkey === "mod+p" ? "⌘/Ctrl P" : "⌘/Ctrl K"}
                </div>
            </div>
        );
    }, [showFooter, hotkey]);

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
                <div className="space-y-2">
                    <CheckboxRow label="disabled" checked={disabled} onChange={setDisabled} />
                </div>
            </SelectRow>
        </>
    );

    const controlsLocal = (
        <>
            <SelectRow label="Open">
                <div className="space-y-2">
                    <CheckboxRow label="open" checked={open} onChange={setOpen} />
                </div>
                <div className="mt-2 text-[11px] opacity-45">
                    Astuce: utilise{" "}
                    <span className="font-mono">
                        {hotkey === "mod+p" ? "⌘/Ctrl P" : "⌘/Ctrl K"}
                    </span>{" "}
                    si hotkey activé.
                </div>
            </SelectRow>

            <SelectRow label="Hotkey">
                <div className="space-y-2">
                    <CheckboxRow
                        label="enableGlobalHotkey"
                        checked={enableGlobalHotkey}
                        onChange={setEnableGlobalHotkey}
                    />
                </div>

                <div className="mt-2">
                    <Select
                        value={hotkey}
                        onChange={(v) => setHotkey(v as Hotkey)}
                        options={["mod+k", "mod+p"]}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow
                        label="closeOnSelect"
                        checked={closeOnSelect}
                        onChange={setCloseOnSelect}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Copy">
                <div className="space-y-2">
                    <TextInput
                        value={placeholder}
                        onChange={setPlaceholder}
                        placeholder="placeholder"
                    />
                    <TextInput
                        value={emptyLabel}
                        onChange={setEmptyLabel}
                        placeholder="emptyLabel"
                    />
                </div>
            </SelectRow>

            <SelectRow label="Data">
                <div className="space-y-2">
                    <CheckboxRow label="showFooter" checked={showFooter} onChange={setShowFooter} />
                    <CheckboxRow label="useIcons" checked={useIcons} onChange={setUseIcons} />
                    <CheckboxRow
                        label="addDisabledItems"
                        checked={addDisabledItems}
                        onChange={setAddDisabledItems}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Selection log">
                <div className="rounded-xl bg-black/25 ring-1 ring-white/10 p-3 text-xs">
                    {selectionLog.length === 0 ? (
                        <div className="opacity-55">Aucune sélection pour l’instant.</div>
                    ) : (
                        <ul className="space-y-1">
                            {selectionLog.map((s) => (
                                <li key={s} className="opacity-75">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
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

        return `import { IntentCommandPalette } from "intent-design-system";

export function Example() {
  return (
    <IntentCommandPalette
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      open={${open}}
      onOpenChange={() => {}}
      enableGlobalHotkey={${enableGlobalHotkey}}
      hotkey="${hotkey}"
      closeOnSelect={${closeOnSelect}}
      placeholder="${placeholder.replaceAll('"', '\\"')}"
      emptyLabel="${emptyLabel.replaceAll('"', '\\"')}"
      groups={/* ... */[]}
      footer={${showFooter ? "<div>↑↓ · Enter · Esc</div>" : "undefined"}}
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
        open,
        enableGlobalHotkey,
        hotkey,
        closeOnSelect,
        placeholder,
        emptyLabel,
        showFooter,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentCommandPaletteIdentity}
            propsTable={IntentCommandPalettePropsTable}
            locale="fr"
            dsControls={controlsDs}
            extraControls={controlsLocal}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className={cn(
                                "rounded-xl px-3 py-2 text-sm",
                                "bg-black/25 ring-1 ring-white/10",
                                "hover:bg-black/35 transition"
                            )}
                            onClick={() => setOpen(true)}
                        >
                            Open palette
                        </button>

                        <div className="text-xs opacity-55">
                            Raccourci:{" "}
                            <span className="font-mono">
                                {hotkey === "mod+p" ? "⌘/Ctrl P" : "⌘/Ctrl K"}
                            </span>
                        </div>
                    </div>

                    {/* ✅ The palette itself */}
                    <IntentCommandPalette
                        {...dsInput}
                        mode={mode}
                        open={open}
                        onOpenChange={setOpen}
                        enableGlobalHotkey={enableGlobalHotkey}
                        hotkey={hotkey}
                        closeOnSelect={closeOnSelect}
                        placeholder={placeholder}
                        emptyLabel={emptyLabel}
                        groups={groups}
                        footer={footer ?? undefined}
                    />
                </div>
            )}
        />
    );
}
