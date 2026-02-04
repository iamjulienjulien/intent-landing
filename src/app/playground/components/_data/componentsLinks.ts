// src/app/playground/components/_data/componentLinks.ts
// componentLinks
// - Centralized list of playground component links
// - Includes category badge + emoji for UI rendering

export type ComponentBadge =
    | "Surface"
    | "Control"
    | "Layout"
    | "Indicator"
    | "Feedback"
    | "Data"
    | "Design";

export type ComponentLink = {
    title: string;
    description: string;
    href: string;
    badge: ComponentBadge;
    badgeEmoji: string;
};

function emojiForBadge(badge: ComponentBadge): string {
    const b = badge.toLowerCase();
    if (b === "surface") return "🧱";
    if (b === "control") return "🕹️";
    if (b === "layout") return "🧭";
    if (b === "indicator") return "🚦";
    if (b === "feedback") return "🔔";
    if (b === "data") return "🧬";
    if (b === "data") return "🎨";
    return "✨";
}

export const COMPONENT_LINKS: ComponentLink[] = [
    // ─────────────────────────────
    // 🧱 Surface
    // ─────────────────────────────
    {
        title: "IntentSurface",
        description: "Semantic surface container with ring, bg, and optional glow layers.",
        href: "/playground/components/intent-surface",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },
    {
        title: "IntentCommandPalette",
        description:
            "Command palette (⌘K/Ctrl+K): overlay + panel + search + list, keyboard nav, glow-ready.",
        href: "/playground/components/intent-command-palette",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },

    // ─────────────────────────────
    // 🔔 Feedback
    // ─────────────────────────────
    {
        title: "IntentToast",
        description:
            "Intent-first toast notification: auto-dismiss, optional action, dismissible, placements.",
        href: "/playground/components/intent-toast",
        badge: "Feedback",
        badgeEmoji: emojiForBadge("Feedback"),
    },

    // ─────────────────────────────
    // 🧬 Data
    // ─────────────────────────────
    {
        title: "IntentCodeViewer",
        description:
            "Intent-first code/data viewer: highlight tokens reflect intent, optional header/meta, copy, wrap, line numbers.",
        href: "/playground/components/intent-code-viewer",
        badge: "Data",
        badgeEmoji: emojiForBadge("Data"),
    },
    {
        title: "IntentTable",
        description:
            "Intent-first table for structured data: render columns, loading/empty states, density, stripes, selection.",
        href: "/playground/components/intent-table",
        badge: "Data",
        badgeEmoji: emojiForBadge("Data"),
    },
    {
        title: "IntentTree",
        description:
            "Intent-first hierarchical tree (SVG): zoom/pan, collapse, selection, custom nodes/links. Built for genealogies.",
        href: "/playground/components/intent-tree",
        badge: "Data",
        badgeEmoji: emojiForBadge("Data"),
    },

    // ─────────────────────────────
    // 🧭 Layout
    // ─────────────────────────────
    {
        title: "IntentJourney",
        description:
            "Intent-first journey (stepper/timeline): vertical or horizontal, statuses, clickable steps, keyboard nav.",
        href: "/playground/components/intent-journey",
        badge: "Layout",
        badgeEmoji: emojiForBadge("Layout"),
    },
    {
        title: "IntentDivider",
        description:
            "Intent-first layout divider: horizontal or vertical line with optional label.",
        href: "/playground/components/intent-divider",
        badge: "Layout",
        badgeEmoji: emojiForBadge("Layout"),
    },

    // ─────────────────────────────
    // 🕹️ Control
    // ─────────────────────────────
    {
        title: "IntentControlButton",
        description: "Primary control button: intent-driven visuals, glow-ready, stable hooks.",
        href: "/playground/components/intent-control-button",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlInput",
        description:
            "Intent-first input/textarea: standalone or wrapped by IntentControlField (insideField).",
        href: "/playground/components/intent-control-input",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlSelect",
        description: "Intent-first custom select: combobox + listbox, keyboard nav, glow-ready.",
        href: "/playground/components/intent-control-select",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlTags",
        description:
            "Intent-first multi-value input (tags/tokens). Standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-tags",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlField",
        description:
            "Intent-first field wrapper: label/description/error, optional leading/trailing slots, layout variants.",
        href: "/playground/components/intent-control-field",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlToggle",
        description:
            "Intent-first toggle switch: track + thumb, optional label/description, glow-ready.",
        href: "/playground/components/intent-control-toggle",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlSegmented",
        description:
            "Intent-first segmented control: toggle button group (single/multi) for state selection (not navigation).",
        href: "/playground/components/intent-control-segmented",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlTabs",
        description:
            "Intent-first tabs (segmented control): keyboard nav, optional equal/fullWidth, glow-ready.",
        href: "/playground/components/intent-control-tabs",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlLink",
        description: "Navigation/link control with the same intent mechanics as buttons.",
        href: "/playground/components/intent-control-link",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentPickerTone",
        description:
            "Intent-first tone picker: Tailwind palette + themed/ink options, native select, stable and accessible.",
        href: "/playground/components/intent-picker-tone",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentPickerGlow",
        description:
            "Intent-first glow picker: ignite the aura (toggle) or choose an omen (aurora/ember/cosmic/mythic/royal/mono).",
        href: "/playground/components/intent-picker-glow",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },

    // ─────────────────────────────
    // 🚦 Indicator
    // ─────────────────────────────
    {
        title: "IntentIndicator",
        description: "Small semantic indicator for statuses, steps, or system states.",
        href: "/playground/components/intent-indicator",
        badge: "Indicator",
        badgeEmoji: emojiForBadge("Indicator"),
    },
];
