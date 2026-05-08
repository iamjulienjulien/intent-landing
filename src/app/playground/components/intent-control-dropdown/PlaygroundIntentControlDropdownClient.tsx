"use client";

// src/app/playground/components/intent-control-dropdown/PlaygroundIntentControlDropdownClient.tsx
// PlaygroundIntentControlDropdownClient
// - Uses PlaygroundComponentShell to test IntentControlDropdown
// - Uses DS exports: Identity + PropsTable
// - Split controls: DS vs Playground
// - Has Code drawer (copy/paste snippet)

import React, { useMemo, useState } from "react";

import {
    IntentControlDropdown,
    type IntentControlDropdownItem,
    resolveIntentWithWarnings,
    type Intent,
    type Variant,
    type Tone,
    type Glow,
    type Intensity,

    // ✅ docs exports
    IntentControlDropdownIdentity,
    IntentControlDropdownPropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type PreviewMode = "dark" | "light";
type DropdownAlign = "start" | "end";
type DropdownSide = "bottom" | "top";

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
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentControlDropdownClient() {
    // Preview tile bg + component mode
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    // DS props
    const [intent, setIntent] = useState<Intent>("informed");
    const [variant, setVariant] = useState<Variant>("elevated");
    const [tone, setTone] = useState<Tone>("emerald");
    const [glow, setGlow] = useState<boolean | Glow>(false);
    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Dropdown local props
    const [readOnly, setReadOnly] = useState(false);
    const [closeOnSelect, setCloseOnSelect] = useState(true);

    const [align, setAlign] = useState<DropdownAlign>("start");
    const [side, setSide] = useState<DropdownSide>("bottom");
    const [offset, setOffset] = useState(8);
    const [matchTriggerWidth, setMatchTriggerWidth] = useState(false);

    const [useCustomTrigger, setUseCustomTrigger] = useState(false);
    const [withHeader, setWithHeader] = useState(false);
    const [withFooter, setWithFooter] = useState(false);
    const [divider, setDivider] = useState(true);

    const [withDisabledItem, setWithDisabledItem] = useState(true);
    const [withDangerItem, setWithDangerItem] = useState(true);
    const [withSeparators, setWithSeparators] = useState(true);

    const [lastAction, setLastAction] = useState<string>("—");

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

    const items: IntentControlDropdownItem[] = useMemo(() => {
        const base: IntentControlDropdownItem[] = [
            {
                id: "open",
                label: "Ouvrir",
                searchText: "ouvrir open",
                icon: <span aria-hidden>🔎</span>,
                meta: <span className="font-mono">Enter</span>,
                onSelect: () => setLastAction("Ouvrir"),
            },
            {
                id: "edit",
                label: "Éditer",
                searchText: "editer edit",
                icon: <span aria-hidden>✏️</span>,
                meta: <span className="font-mono">E</span>,
                onSelect: () => setLastAction("Éditer"),
            },
        ];

        const maybeSep = withSeparators
            ? [{ id: "sep-a", label: "", separatorBefore: true } as any]
            : [];

        const maybeDisabled: IntentControlDropdownItem[] = withDisabledItem
            ? [
                  {
                      id: "disabled",
                      label: "Action désactivée",
                      searchText: "disabled",
                      icon: <span aria-hidden>🚫</span>,
                      disabled: true,
                      onSelect: () => setLastAction("Ne devrait pas arriver"),
                  },
              ]
            : [];

        const maybeDanger: IntentControlDropdownItem[] = withDangerItem
            ? [
                  {
                      id: "delete",
                      label: "Supprimer",
                      searchText: "supprimer delete remove",
                      icon: <span aria-hidden>🗑️</span>,
                      dangerous: true,
                      onSelect: () => setLastAction("Supprimer"),
                  },
              ]
            : [];

        const withLink: IntentControlDropdownItem[] = [
            {
                id: "link",
                label: "Aller au playground",
                searchText: "link href playground",
                icon: <span aria-hidden>↗</span>,
                meta: <span className="font-mono">↩</span>,
                href: "/playground/components/intent-control-dropdown",
            },
        ];

        return [
            ...base,
            ...maybeSep,
            ...maybeDisabled,
            ...maybeDanger,
            ...(withSeparators ? maybeSep : []),
            ...withLink,
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withDisabledItem, withDangerItem, withSeparators]);

    /* ============================================================================
       🧩 Controls split (DS vs Playground)
    ============================================================================ */

    const dsControls = (
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

    const extraControls = (
        <>
            <SelectRow label="Behavior">
                <div className="space-y-2">
                    <CheckboxRow label="readOnly" checked={readOnly} onChange={setReadOnly} />
                    <CheckboxRow
                        label="closeOnSelect"
                        checked={closeOnSelect}
                        onChange={setCloseOnSelect}
                    />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Tip: teste le clavier (↑ ↓ Home End Enter Esc). Typeahead fonctionne aussi.
                </div>
            </SelectRow>

            <SelectRow label="Placement">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">align</div>
                        <Select
                            value={align}
                            onChange={(v) => setAlign(v as DropdownAlign)}
                            options={["start", "end"]}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-[11px] opacity-40">side</div>
                        <Select
                            value={side}
                            onChange={(v) => setSide(v as DropdownSide)}
                            options={["bottom", "top"]}
                        />
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-[11px] opacity-40">offset</div>
                    <input
                        type="number"
                        value={offset}
                        onChange={(e) => setOffset(parseInt(e.target.value || "0", 10))}
                        className={cn(
                            "w-full rounded-xl bg-black/25 ring-1 ring-white/10",
                            "px-3 py-2 text-sm opacity-85",
                            "focus:outline-none focus:ring-2 focus:ring-white/15"
                        )}
                    />
                    <CheckboxRow
                        label="matchTriggerWidth"
                        checked={matchTriggerWidth}
                        onChange={setMatchTriggerWidth}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Trigger / Slots">
                <div className="space-y-2">
                    <CheckboxRow
                        label="useCustomTrigger"
                        checked={useCustomTrigger}
                        onChange={setUseCustomTrigger}
                    />
                    <CheckboxRow label="withHeader" checked={withHeader} onChange={setWithHeader} />
                    <CheckboxRow label="withFooter" checked={withFooter} onChange={setWithFooter} />
                    <CheckboxRow label="divider" checked={divider} onChange={setDivider} />
                </div>
            </SelectRow>

            <SelectRow label="Items">
                <div className="space-y-2">
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
                        label="withSeparators"
                        checked={withSeparators}
                        onChange={setWithSeparators}
                    />
                </div>
            </SelectRow>

            <div className="text-[11px] opacity-55">
                Dernière action: <span className="font-mono">{lastAction}</span>
            </div>
        </>
    );

    /* ============================================================================
       🧾 Code drawer snippet
    ============================================================================ */

    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";

        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        const headerLine = withHeader
            ? `    header={<div className="text-xs opacity-70">Header du menu</div>}\n`
            : "";

        const footerLine = withFooter
            ? `    footer={<div className="text-xs opacity-70">Footer du menu</div>}\n`
            : "";

        const triggerBlock = useCustomTrigger
            ? `    renderTrigger={({ ref, open, onClick, onKeyDown, ...a11y }) => (
      <button
        ref={ref as any}
        type="button"
        className="rounded-2xl px-4 py-2 text-sm ring-1 ring-white/10 bg-black/25"
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...a11y}
      >
        Custom trigger {open ? "▲" : "▼"}
      </button>
    )}\n`
            : `    buttonLabel="Actions"\n`;

        return `import * as React from "react";
import { IntentControlDropdown, type IntentControlDropdownItem } from "intent-design-system";

const items: IntentControlDropdownItem[] = [
  { id: "open", label: "Ouvrir", icon: "🔎", onSelect: () => console.log("open") },
  { id: "edit", label: "Éditer", icon: "✏️", onSelect: () => console.log("edit") },
  { id: "delete", label: "Supprimer", icon: "🗑️", dangerous: true, onSelect: () => console.log("delete") },
];

export function Example() {
  return (
    <IntentControlDropdown
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      closeOnSelect={${closeOnSelect}}
      align="${align}"
      side="${side}"
      offset={${offset}}
      matchTriggerWidth={${matchTriggerWidth}}
      divider={${divider}}
${headerLine}${footerLine}${triggerBlock}      items={items}
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
        readOnly,
        closeOnSelect,
        align,
        side,
        offset,
        matchTriggerWidth,
        divider,
        withHeader,
        withFooter,
        useCustomTrigger,
    ]);

    /* ============================================================================
       ✅ Render
    ============================================================================ */

    const headerNode = withHeader ? (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <div className="text-xs tracking-[0.18em] opacity-55">MENU</div>
                <div className="mt-1 text-sm font-semibold opacity-90">IntentControlDropdown</div>
            </div>
            <div className="text-[11px] opacity-60 font-mono">⌘K</div>
        </div>
    ) : null;

    const footerNode = withFooter ? (
        <div className="flex items-center justify-between gap-3 text-xs opacity-70">
            <div>Footer: meta, shortcuts, infos…</div>
            <div className="font-mono">Esc</div>
        </div>
    ) : null;

    return (
        <PlaygroundComponentShell
            identity={IntentControlDropdownIdentity}
            propsTable={IntentControlDropdownPropsTable}
            locale="fr"
            dsControls={dsControls}
            extraControls={extraControls}
            warnings={resolvedWithWarnings.warnings}
            resolvedJson={resolvedWithWarnings}
            previewMode={previewMode}
            codeString={codeString}
            renderPreview={(mode) => (
                <div className="w-full min-w-0 space-y-3">
                    <div className="flex items-center gap-3">
                        <IntentControlDropdown
                            {...dsInput}
                            mode={mode}
                            items={items}
                            readOnly={readOnly}
                            closeOnSelect={closeOnSelect}
                            align={align}
                            side={side}
                            offset={offset}
                            matchTriggerWidth={matchTriggerWidth}
                            header={headerNode}
                            footer={footerNode}
                            divider={divider}
                            renderTrigger={
                                useCustomTrigger
                                    ? ({ ref, open, onClick, onKeyDown, ...a11y }) => (
                                          <button
                                              ref={ref as any}
                                              type="button"
                                              className={cn(
                                                  "rounded-2xl px-4 py-2 text-sm",
                                                  "ring-1 ring-white/10 bg-black/25",
                                                  "transition opacity-90 hover:opacity-100"
                                              )}
                                              onClick={onClick}
                                              onKeyDown={onKeyDown}
                                              {...a11y}
                                          >
                                              Custom trigger{" "}
                                              <span className="opacity-70">{open ? "▲" : "▼"}</span>
                                          </button>
                                      )
                                    : undefined
                            }
                            buttonLabel="Actions"
                        />
                        <div className="text-xs opacity-70">
                            last=<span className="font-mono"> {lastAction}</span>
                        </div>
                    </div>

                    <div className="text-xs opacity-70">
                        mode=<span className="font-mono">{mode}</span>, variant=
                        <span className="font-mono"> {variant}</span>, intent=
                        <span className="font-mono"> {intent}</span>, align=
                        <span className="font-mono"> {align}</span>, side=
                        <span className="font-mono"> {side}</span>
                    </div>

                    <div className="text-[11px] opacity-55">
                        Astuce: ouvre puis utilise ↑ ↓ + Enter. Tape{" "}
                        <span className="font-mono">e</span> pour typeahead “Éditer”.
                    </div>
                </div>
            )}
        />
    );
}
