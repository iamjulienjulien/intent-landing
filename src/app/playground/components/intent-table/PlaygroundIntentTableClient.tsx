"use client";

// src/app/playground/components/intent-table/PlaygroundIntentTableClient.tsx
// PlaygroundIntentTableClient
// - Uses PlaygroundComponentShell to test IntentTable
// - Uses DS exports: Identity + PropsTable

import React, { useMemo, useState } from "react";

import {
    IntentTable,
    resolveIntentWithWarnings,
    type IntentName,
    type VariantName,
    type ToneName,
    type GlowName,
    type Intensity,

    // ✅ docs exports from DS
    IntentTableIdentity,
    IntentTablePropsTable,
} from "intent-design-system";

import { PlaygroundComponentShell } from "../_components/PlaygroundComponentShell";

/* ============================================================================
   🧰 HELPERS
============================================================================ */

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

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

/* ============================================================================
   🧪 MOCK DATA (Game of Thrones Houses)
============================================================================ */

type HouseRegion =
    | "north"
    | "riverlands"
    | "vale"
    | "westerlands"
    | "reach"
    | "stormlands"
    | "dorne"
    | "crownlands"
    | "iron-islands"
    | "beyond-the-wall"
    | "essos";

type HouseTier = "great-house" | "principal" | "major" | "minor";

type HouseRole =
    | "lord-paramount" // Great Houses + LP
    | "great-house" // House royale / dynasties principales
    | "vassal" // maison vassale / bannerman
    | "cadet" // branche cadette
    | "royal" // dynastie royale / impériale
    | "exiled" // dynastie en exil
    | "neutral"; // hors jeux / particularités

type HouseStatus =
    | "active" // influence forte / en place
    | "rising" // en ascension
    | "declining" // en difficulté
    | "extinct" // éteinte
    | "defeated" // vaincue / renversée
    | "unknown"; // incertain / variable

type HouseRow = {
    id: string;

    // Identité
    name: string;
    sigil?: string; // emoji-ish quick preview
    words?: string;

    // Localisation / pouvoir
    region: HouseRegion;
    seat?: string;
    allegiance?: string; // ex: "Stark", "Lannister", "Targaryen", "Crown", "Independent"
    tier: HouseTier;

    // Table-style fields (remplaçant tes "role / status / score")
    role: HouseRole;
    status: HouseStatus;

    // “Power index” (0-100) pour tests tri/filter
    score: number;

    // dernière mise à jour (factice) pour tests
    updatedAt: string;

    // Tags rapides pour chips / badges
    tags: Array<
        | "great-house"
        | "royal-blood"
        | "valyrian"
        | "old-gods"
        | "faith-of-seven"
        | "drowned-god"
        | "rhllor"
        | "maesters"
        | "knights"
        | "fleet"
        | "rich"
        | "ancient"
        | "ambitious"
        | "schemers"
        | "honor"
        | "vengeance"
        | "trade"
        | "desert"
        | "mountains"
        | "wolves"
        | "lions"
        | "dragons"
    >;
};

const MOCK_ROWS: HouseRow[] = [
    /* =========================
       🐺 THE NORTH (Stark + bannermen)
    ========================= */

    {
        id: "house_stark",
        name: "House Stark",
        sigil: "🐺",
        words: "Winter is Coming",
        region: "north",
        seat: "Winterfell",
        allegiance: "Independent / North",
        tier: "great-house",
        role: "lord-paramount",
        status: "active",
        score: 92,
        updatedAt: "2026-01-28",
        tags: ["great-house", "old-gods", "ancient", "honor", "wolves"],
    },
    {
        id: "house_bolton",
        name: "House Bolton",
        sigil: "🩸",
        words: "Our Blades Are Sharp",
        region: "north",
        seat: "The Dreadfort",
        allegiance: "North (variable)",
        tier: "major",
        role: "vassal",
        status: "defeated",
        score: 41,
        updatedAt: "2026-01-21",
        tags: ["ancient", "vengeance", "schemers"],
    },
    {
        id: "house_mormont",
        name: "House Mormont",
        sigil: "🐻",
        words: "Here We Stand",
        region: "north",
        seat: "Bear Island",
        allegiance: "Stark",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 66,
        updatedAt: "2026-01-20",
        tags: ["old-gods", "honor", "ancitious" as any], // (garde-fou: retire si tu veux strict)
    },
    {
        id: "house_karstark",
        name: "House Karstark",
        sigil: "🐺",
        words: "The Sun of Winter",
        region: "north",
        seat: "Karhold",
        allegiance: "Stark (historique)",
        tier: "major",
        role: "cadet",
        status: "declining",
        score: 52,
        updatedAt: "2026-01-18",
        tags: ["old-gods", "ancient", "wolves"],
    },
    {
        id: "house_umber",
        name: "House Umber",
        sigil: "🌿",
        words: "?",
        region: "north",
        seat: "Last Hearth",
        allegiance: "Stark",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 58,
        updatedAt: "2026-01-17",
        tags: ["old-gods", "honor", "ancient"],
    },
    {
        id: "house_glover",
        name: "House Glover",
        sigil: "🪓",
        words: "?",
        region: "north",
        seat: "Deepwood Motte",
        allegiance: "Stark",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 54,
        updatedAt: "2026-01-16",
        tags: ["old-gods", "honor"],
    },
    {
        id: "house_reed",
        name: "House Reed",
        sigil: "🌫️",
        words: "?",
        region: "north",
        seat: "Greywater Watch",
        allegiance: "Stark",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 49,
        updatedAt: "2026-01-15",
        tags: ["old-gods", "ancient", "mountains"],
    },

    /* =========================
       🦁 THE WESTERLANDS (Lannister + banners)
    ========================= */

    {
        id: "house_lannister",
        name: "House Lannister",
        sigil: "🦁",
        words: "Hear Me Roar!",
        region: "westerlands",
        seat: "Casterly Rock",
        allegiance: "Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "active",
        score: 95,
        updatedAt: "2026-01-27",
        tags: ["great-house", "rich", "schemers", "lions"],
    },
    {
        id: "house_clegane",
        name: "House Clegane",
        sigil: "🐶",
        words: "?",
        region: "westerlands",
        seat: "Clegane's Keep",
        allegiance: "Lannister",
        tier: "minor",
        role: "vassal",
        status: "declining",
        score: 28,
        updatedAt: "2026-01-19",
        tags: ["knights", "vengeance"],
    },
    {
        id: "house_payne",
        name: "House Payne",
        sigil: "⚔️",
        words: "?",
        region: "westerlands",
        seat: "Payne Hall",
        allegiance: "Lannister",
        tier: "minor",
        role: "vassal",
        status: "active",
        score: 33,
        updatedAt: "2026-01-14",
        tags: ["knights"],
    },
    {
        id: "house_crakehall",
        name: "House Crakehall",
        sigil: "🐗",
        words: "None So Fierce",
        region: "westerlands",
        seat: "Crakehall",
        allegiance: "Lannister",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 47,
        updatedAt: "2026-01-12",
        tags: ["knights", "honor"],
    },

    /* =========================
       🌹 THE REACH (Tyrell + banners)
    ========================= */

    {
        id: "house_tyrell",
        name: "House Tyrell",
        sigil: "🌹",
        words: "Growing Strong",
        region: "reach",
        seat: "Highgarden",
        allegiance: "Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "defeated",
        score: 71,
        updatedAt: "2026-01-26",
        tags: ["great-house", "ambitious", "schemers", "rich"],
    },
    {
        id: "house_tarly",
        name: "House Tarly",
        sigil: "🦌",
        words: "First in Battle",
        region: "reach",
        seat: "Horn Hill",
        allegiance: "Tyrell (historique)",
        tier: "major",
        role: "vassal",
        status: "declining",
        score: 55,
        updatedAt: "2026-01-23",
        tags: ["knights", "honor"],
    },
    {
        id: "house_hightower",
        name: "House Hightower",
        sigil: "🗼",
        words: "We Light the Way",
        region: "reach",
        seat: "Oldtown",
        allegiance: "Reach",
        tier: "principal",
        role: "vassal",
        status: "active",
        score: 78,
        updatedAt: "2026-01-22",
        tags: ["ancient", "rich", "maesters", "trade"],
    },
    {
        id: "house_redwyne",
        name: "House Redwyne",
        sigil: "🍇",
        words: "?",
        region: "reach",
        seat: "The Arbor",
        allegiance: "Tyrell",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 63,
        updatedAt: "2026-01-20",
        tags: ["fleet", "rich", "trade"],
    },

    /* =========================
       🦌 THE STORMLANDS (Baratheon + banners)
    ========================= */

    {
        id: "house_baratheon",
        name: "House Baratheon",
        sigil: "🦌",
        words: "Ours is the Fury",
        region: "stormlands",
        seat: "Storm's End",
        allegiance: "Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "declining",
        score: 60,
        updatedAt: "2026-01-25",
        tags: ["great-house", "knights", "ambitious"],
    },
    {
        id: "house_tarth",
        name: "House Tarth",
        sigil: "🌙",
        words: "?",
        region: "stormlands",
        seat: "Evenfall Hall",
        allegiance: "Stormlands",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 44,
        updatedAt: "2026-01-13",
        tags: ["knights", "honor"],
    },

    /* =========================
       🐟 THE RIVERLANDS (Tully + banners)
    ========================= */

    {
        id: "house_tully",
        name: "House Tully",
        sigil: "🐟",
        words: "Family, Duty, Honor",
        region: "riverlands",
        seat: "Riverrun",
        allegiance: "Stark (historique)",
        tier: "great-house",
        role: "lord-paramount",
        status: "declining",
        score: 57,
        updatedAt: "2026-01-24",
        tags: ["great-house", "honor", "knights"],
    },
    {
        id: "house_frey",
        name: "House Frey",
        sigil: "🌉",
        words: "We Stand Together",
        region: "riverlands",
        seat: "The Twins",
        allegiance: "Crown (variable)",
        tier: "major",
        role: "vassal",
        status: "defeated",
        score: 38,
        updatedAt: "2026-01-19",
        tags: ["schemers", "trade", "vengeance"],
    },
    {
        id: "house_mallister",
        name: "House Mallister",
        sigil: "🦅",
        words: "Above the Rest",
        region: "riverlands",
        seat: "Seagard",
        allegiance: "Riverlands",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 45,
        updatedAt: "2026-01-10",
        tags: ["knights", "honor", "fleet"],
    },

    /* =========================
       🦅 THE VALE (Arryn + banners)
    ========================= */

    {
        id: "house_arryn",
        name: "House Arryn",
        sigil: "🦅",
        words: "As High as Honor",
        region: "vale",
        seat: "The Eyrie",
        allegiance: "Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "active",
        score: 68,
        updatedAt: "2026-01-23",
        tags: ["great-house", "honor", "mountains", "knights"],
    },
    {
        id: "house_royce",
        name: "House Royce",
        sigil: "🪨",
        words: "We Remember",
        region: "vale",
        seat: "Runestone",
        allegiance: "Arryn",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 53,
        updatedAt: "2026-01-09",
        tags: ["ancient", "honor", "mountains"],
    },

    /* =========================
       ☀️ DORNE (Martell + banners)
    ========================= */

    {
        id: "house_martell",
        name: "House Martell",
        sigil: "☀️",
        words: "Unbowed, Unbent, Unbroken",
        region: "dorne",
        seat: "Sunspear",
        allegiance: "Independent / Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "active",
        score: 64,
        updatedAt: "2026-01-22",
        tags: ["great-house", "desert", "ambitious", "vengeance"],
    },
    {
        id: "house_dayne",
        name: "House Dayne",
        sigil: "⭐",
        words: "?",
        region: "dorne",
        seat: "Starfall",
        allegiance: "Martell",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 52,
        updatedAt: "2026-01-12",
        tags: ["ancient", "knights", "honor"],
    },

    /* =========================
       ⚓ IRON ISLANDS (Greyjoy + banners)
    ========================= */

    {
        id: "house_greyjoy",
        name: "House Greyjoy",
        sigil: "🐙",
        words: "We Do Not Sow",
        region: "iron-islands",
        seat: "Pyke",
        allegiance: "Independent / Crown (variable)",
        tier: "great-house",
        role: "lord-paramount",
        status: "declining",
        score: 59,
        updatedAt: "2026-01-21",
        tags: ["great-house", "drowned-god", "fleet", "ambitious"],
    },
    {
        id: "house_harlaw",
        name: "House Harlaw",
        sigil: "📚",
        words: "?",
        region: "iron-islands",
        seat: "Harlaw",
        allegiance: "Greyjoy",
        tier: "major",
        role: "vassal",
        status: "active",
        score: 44,
        updatedAt: "2026-01-11",
        tags: ["fleet", "trade"],
    },

    /* =========================
       👑 CROWNLANDS / ROYAL LINES
    ========================= */

    {
        id: "house_targaryen",
        name: "House Targaryen",
        sigil: "🐉",
        words: "Fire and Blood",
        region: "crownlands",
        seat: "Dragonstone",
        allegiance: "Exiled / Claimants",
        tier: "great-house",
        role: "exiled",
        status: "rising",
        score: 83,
        updatedAt: "2026-01-28",
        tags: ["great-house", "royal-blood", "valyrian", "dragons"],
    },
    {
        id: "house_baratheon_kingslanding",
        name: "House Baratheon of King's Landing",
        sigil: "👑",
        words: "Ours is the Fury",
        region: "crownlands",
        seat: "King's Landing",
        allegiance: "Crown",
        tier: "principal",
        role: "royal",
        status: "defeated",
        score: 46,
        updatedAt: "2026-01-18",
        tags: ["royal-blood", "ambitious", "schemers"],
    },
    {
        id: "house_baelish",
        name: "House Baelish",
        sigil: "🕷️",
        words: "?",
        region: "crownlands",
        seat: "Harrenhal (claim)",
        allegiance: "Crown (schemes)",
        tier: "minor",
        role: "neutral",
        status: "defeated",
        score: 22,
        updatedAt: "2026-01-16",
        tags: ["schemers", "ambitious", "trade"],
    },
];

/* ============================================================================
   ✅ MAIN
============================================================================ */

export default function PlaygroundIntentTableClient() {
    const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");

    const [intent, setIntent] = useState<IntentName>("informed");
    const [variant, setVariant] = useState<VariantName>("elevated");

    const [tone, setTone] = useState<ToneName>("emerald");
    const [glow, setGlow] = useState<boolean | GlowName>(false);

    const [intensity, setIntensity] = useState<Intensity>("medium");
    const [disabled, setDisabled] = useState(false);

    // Table controls
    const [compact, setCompact] = useState(false);
    const [striped, setStriped] = useState(true);
    const [hoverable, setHoverable] = useState(true);
    const [stickyHeader, setStickyHeader] = useState(false);

    const [selectable, setSelectable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const [rowIntentEnabled, setRowIntentEnabled] = useState(true);

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

    const data = useMemo(() => {
        if (loading) return MOCK_ROWS;
        return empty ? [] : MOCK_ROWS;
    }, [loading, empty]);

    const columns = useMemo(() => {
        return [
            {
                key: "name",
                header: "House",
                cell: (r: HouseRow) => (
                    <div className="min-w-0 flex items-start gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-black/25 ring-1 ring-white/10 flex items-center justify-center">
                            <span className="text-lg leading-none">{r.sigil ?? "🏰"}</span>
                        </div>

                        <div className="min-w-0">
                            <div className="font-medium truncate">{r.name}</div>
                            <div className="text-xs opacity-55 truncate">{r.id}</div>
                            {r.words ? (
                                <div className="text-xs opacity-60 truncate mt-0.5">
                                    “{r.words}”
                                </div>
                            ) : null}
                        </div>
                    </div>
                ),
                width: "34%",
                sortable: true,
            },
            {
                key: "realm",
                header: "Realm",
                cell: (r: HouseRow) => (
                    <div className="min-w-0">
                        <div className="text-sm opacity-85 truncate">
                            {r.region === "beyond-the-wall"
                                ? "Beyond the Wall"
                                : r.region === "iron-islands"
                                  ? "Iron Islands"
                                  : r.region === "crownlands"
                                    ? "Crownlands"
                                    : r.region === "riverlands"
                                      ? "Riverlands"
                                      : r.region === "stormlands"
                                        ? "Stormlands"
                                        : r.region === "westerlands"
                                          ? "Westerlands"
                                          : r.region === "vale"
                                            ? "The Vale"
                                            : r.region === "reach"
                                              ? "The Reach"
                                              : r.region === "dorne"
                                                ? "Dorne"
                                                : r.region === "north"
                                                  ? "The North"
                                                  : "Essos"}
                        </div>
                        <div className="text-xs opacity-55 truncate">{r.seat ?? "—"}</div>
                        <div className="text-xs opacity-55 truncate">{r.allegiance ?? "—"}</div>
                    </div>
                ),
                width: "22%",
                sortable: true,
            },
            {
                key: "tier",
                header: "Tier",
                cell: (r: HouseRow) => (
                    <span className="text-sm opacity-85">
                        {r.tier === "great-house"
                            ? "Great House"
                            : r.tier === "principal"
                              ? "Principal"
                              : r.tier === "major"
                                ? "Major"
                                : "Minor"}
                    </span>
                ),
                width: "12%",
                sortable: true,
            },
            {
                key: "role",
                header: "Role",
                cell: (r: HouseRow) => (
                    <span className="text-sm opacity-85">
                        {r.role === "lord-paramount"
                            ? "Lord Paramount"
                            : r.role === "great-house"
                              ? "Great House"
                              : r.role === "vassal"
                                ? "Vassal"
                                : r.role === "cadet"
                                  ? "Cadet Branch"
                                  : r.role === "royal"
                                    ? "Royal Dynasty"
                                    : r.role === "exiled"
                                      ? "Exiled"
                                      : "Neutral"}
                    </span>
                ),
                width: "12%",
                sortable: true,
            },
            {
                key: "status",
                header: "Status",
                cell: (r: HouseRow) => (
                    <span className="text-sm opacity-85">
                        {r.status === "active"
                            ? "Active"
                            : r.status === "rising"
                              ? "Rising"
                              : r.status === "declining"
                                ? "Declining"
                                : r.status === "extinct"
                                  ? "Extinct"
                                  : r.status === "defeated"
                                    ? "Defeated"
                                    : "Unknown"}
                    </span>
                ),
                width: "10%",
                sortable: true,
            },
            {
                key: "score",
                header: "Power",
                align: "right" as const,
                cell: (r: HouseRow) => <span className="tabular-nums">{r.score}</span>,
                width: "8%",
                sortable: true,
            },
            {
                key: "updated",
                header: "Updated",
                align: "right" as const,
                cell: (r: HouseRow) => <span className="text-sm opacity-75">{r.updatedAt}</span>,
                width: "12%",
                sortable: true,
            },
        ] as const;
    }, []);

    const rowIntent = useMemo(() => {
        if (!rowIntentEnabled) return undefined;

        // GoT demo: tint by house status
        return (row: HouseRow) => {
            // Active / Rising = "power" vibe
            if (row.status === "active")
                return { intent: "empowered", variant: "ghost" as VariantName };

            if (row.status === "rising")
                return { intent: "themed", variant: "ghost" as VariantName };

            // Declining = warning (fragile / tension)
            if (row.status === "declining")
                return { intent: "warned", variant: "ghost" as VariantName };

            // Defeated / Extinct = danger / failure / ruin
            if (row.status === "defeated" || row.status === "extinct")
                return { intent: "threatened", variant: "ghost" as VariantName };

            // Unknown = neutral, let the table stay calm
            return { intent: "informed", variant: "ghost" as VariantName };
        };
    }, [rowIntentEnabled]);

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
            <SelectRow label="Table">
                <div className="space-y-2">
                    <CheckboxRow label="compact" checked={compact} onChange={setCompact} />
                    <CheckboxRow label="striped" checked={striped} onChange={setStriped} />
                    <CheckboxRow label="hoverable" checked={hoverable} onChange={setHoverable} />
                    <CheckboxRow
                        label="stickyHeader"
                        checked={stickyHeader}
                        onChange={setStickyHeader}
                    />
                </div>
            </SelectRow>

            <SelectRow label="Row">
                <div className="space-y-2">
                    <CheckboxRow
                        label="rowIntent (status tint)"
                        checked={rowIntentEnabled}
                        onChange={setRowIntentEnabled}
                    />
                    <CheckboxRow label="selectable" checked={selectable} onChange={setSelectable} />
                </div>
            </SelectRow>

            <SelectRow label="Data">
                <div className="space-y-2">
                    <CheckboxRow label="loading" checked={loading} onChange={setLoading} />
                    <CheckboxRow label="empty" checked={empty} onChange={setEmpty} />
                </div>
                <div className="mt-2 text-[11px] opacity-40">
                    Astuce: <span className="font-mono">loading</span> a priorité sur{" "}
                    <span className="font-mono">empty</span> visuellement.
                </div>
            </SelectRow>
        </>
    );

    // ✅ code panel snippet
    const codeString = useMemo(() => {
        const toneLine = intent === "toned" ? `    tone="${tone}"\n` : "";
        const glowLine =
            intent === "glowed"
                ? `    glow="${typeof glow === "string" ? glow : "aurora"}"\n`
                : glow === true
                  ? `    glow\n`
                  : "";

        return `import { IntentTable } from "intent-design-system";

type Row = {
  id: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "paused" | "blocked";
  score: number;
  updatedAt: string;
};

const columns = [
  { key: "name", header: "Name", cell: (r: Row) => r.name },
  { key: "role", header: "Role", cell: (r: Row) => r.role },
  { key: "status", header: "Status", cell: (r: Row) => r.status },
  { key: "score", header: "Score", align: "right", cell: (r: Row) => r.score },
  { key: "updated", header: "Updated", align: "right", cell: (r: Row) => r.updatedAt },
] as const;

export function Example({ data }: { data: Row[] }) {
  return (
    <IntentTable<Row>
      mode="${previewMode}"
      intent="${intent}"
      variant="${variant}"
${toneLine}${glowLine}      intensity="${intensity}"
      columns={columns as any}
      data={data}
      keyField="id"
      compact={${compact}}
      striped={${striped}}
      hoverable={${hoverable}}
      stickyHeader={${stickyHeader}}
      selectable={${selectable}}
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
        compact,
        striped,
        hoverable,
        stickyHeader,
        selectable,
    ]);

    return (
        <PlaygroundComponentShell
            identity={IntentTableIdentity}
            propsTable={IntentTablePropsTable}
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
                    <div className="w-full min-w-0">
                        <IntentTable<HouseRow>
                            {...dsInput}
                            mode={mode}
                            data={data}
                            columns={columns as any}
                            keyField="id"
                            rowIntent={rowIntent as any}
                            loading={loading}
                            emptyLabel="No rows found."
                            loadingLabel="Loading rows…"
                            compact={compact}
                            striped={striped}
                            hoverable={hoverable}
                            stickyHeader={stickyHeader}
                            selectable={selectable}
                            footer={
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs opacity-65">{data.length} row(s)</div>
                                    <div className="text-xs opacity-65">
                                        Tip: click a row to toggle selection.
                                    </div>
                                </div>
                            }
                            caption="Example IntentTable preview"
                        />
                    </div>
                </div>
            )}
        />
    );
}
