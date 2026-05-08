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
    | "Visualization"
    | "Design"
    | "Genealogy"
    | "Content";

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
    if (b === "visualization") return "📊";
    if (b === "design") return "🎨";
    if (b === "genealogy") return "🌳";
    if (b === "content") return "🖋️";
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
        title: "IntentSurfacePanel",
        description:
            "Section container surface: header/footer optionnels, padding scale, bleed mode, dividers. Intent-first + glow layers.",
        href: "/playground/components/intent-surface-panel",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },
    {
        title: "IntentSurfaceCard",
        description:
            "Item surface (Card): media/header/footer optionnels, padding scale, bleed mode, dividers, interactive/pressed states. Intent-first + glow layers.",
        href: "/playground/components/intent-surface-card",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },
    {
        title: "IntentSurfaceWidget",
        description:
            "Compact dashboard widget surface: light header, emoji/title, badges/actions, optional collapse and dismiss.",
        href: "/playground/components/intent-surface-widget",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },
    {
        title: "IntentSurfaceSkeleton",
        description:
            "Intent-first loading placeholder for widgets, cards, panels, and generic surfaces with header/body/footer anatomy.",
        href: "/playground/components/intent-surface-skeleton",
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
    {
        title: "IntentDrawer",
        description:
            "Sliding drawer (overlay + panel): left/right/top/bottom, sizes, focus trap, ESC/overlay close, scroll lock.",
        href: "/playground/components/intent-drawer",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },

    {
        title: "IntentDialog",
        description:
            "Modal dialog (overlay + centered panel): sizes, focus trap, ESC/overlay close, scroll lock, glow-ready.",
        href: "/playground/components/intent-dialog",
        badge: "Surface",
        badgeEmoji: emojiForBadge("Surface"),
    },
    {
        title: "IntentPopover",
        description:
            "Intent-first popover / tooltip surface: hover/click/manual, smart positioning, arrow, interactive mode.",
        href: "/playground/components/intent-popover",
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
    {
        title: "IntentConfirmDialog",
        description:
            "Intent-first confirmation dialog (modal): overlay + panel, keyboard (Esc/Enter), focus trap, confirm/cancel actions.",
        href: "/playground/components/intent-confirm-dialog",
        badge: "Feedback",
        badgeEmoji: emojiForBadge("Feedback"),
    },
    {
        title: "IntentLoader",
        description:
            "Intent-first animated loader: cosmic spinner/orbit/comet/radar/warp/galaxy variants, labels, progress, centered and framed modes.",
        href: "/playground/components/intent-loader",
        badge: "Feedback",
        badgeEmoji: emojiForBadge("Feedback"),
    },
    {
        title: "IntentProgressBar",
        description:
            "Intent-first progress bar: determinate or indeterminate, horizontal/vertical, labels, marker, stripes, pulse and glow-ready.",
        href: "/playground/components/intent-progress-bar",
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
    {
        title: "IntentStat",
        description:
            "Intent-first stat block for dashboards: value + label + optional delta/trend, icon and right slot, glow-ready.",
        href: "/playground/components/intent-stat",
        badge: "Data",
        badgeEmoji: emojiForBadge("Data"),
    },
    {
        title: "IntentPdfViewer",
        description:
            "Intent-first PDF viewer: embedded preview (iframe/object), optional header/meta, open/download actions, toolbar hide, fullscreen.",
        href: "/playground/components/intent-pdf-viewer",
        badge: "Data",
        badgeEmoji: emojiForBadge("Data"),
    },

    // ─────────────────────────────
    // 🖋️ Content
    // ─────────────────────────────

    {
        title: "IntentContentText",
        description:
            "Intent-first text content: resolved text color, optional glow gradient, text halo, typography helpers, icons and narrative presets.",
        href: "/playground/components/intent-content-text",
        badge: "Content",
        badgeEmoji: emojiForBadge("Content"),
    },

    // ─────────────────────────────
    // 🎨 Design
    // ─────────────────────────────
    {
        title: "IntentThemePreview",
        description:
            "Compact theme preview grid: validate intents + aesthetic glows across mode/variant/intensity/toneStep at a glance.",
        href: "/playground/components/intent-theme-preview",
        badge: "Design",
        badgeEmoji: emojiForBadge("Design"),
    },
    {
        title: "IntentPickerTone",
        description:
            "Intent-first tone picker: Tailwind palette + themed/ink options, native select, stable and accessible.",
        href: "/playground/components/intent-picker-tone",
        badge: "Design",
        badgeEmoji: emojiForBadge("Design"),
    },
    {
        title: "IntentPickerGlow",
        description:
            "Intent-first glow picker: ignite the aura (toggle) or choose an omen (aurora/ember/cosmic/mythic/royal/mono).",
        href: "/playground/components/intent-picker-glow",
        badge: "Design",
        badgeEmoji: emojiForBadge("Design"),
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
        title: "IntentTimeline",
        description:
            "Intent-first linear timeline for events: vertical/horizontal, marker variants, grouping headers, selection, optional expand/collapse, keyboard nav.",
        href: "/playground/components/intent-timeline",
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
    {
        title: "IntentToolbar",
        description:
            "Intent-first toolbar surface: left/center/right slots, wrap/align/justify, optional sticky and divider, glow-ready.",
        href: "/playground/components/intent-toolbar",
        badge: "Layout",
        badgeEmoji: emojiForBadge("Layout"),
    },
    {
        title: "IntentStepper",
        description:
            "Intent-first stepper for multi-step forms and workflows: clickable steps, inferred or explicit statuses, progress bar, compact mode.",
        href: "/playground/components/intent-stepper",
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
        title: "IntentControlCombobox",
        description:
            "Intent-first combobox (typeahead/autocomplete): accessible dropdown, full keyboard support, standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-combobox",
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
        title: "IntentControlDate",
        description:
            "Intent-first date control: single input (native or text) or split day/month/year inputs with validation, paste parsing, and ISO value model.",
        href: "/playground/components/intent-control-date",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        description: "Time control (single or split hour/minute) with paste + validation.",
        title: "IntentControlTime",
        href: "/playground/components/intent-control-time",
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
        title: "IntentControlButtonGroup",
        description:
            "Intent-first grouped buttons/links: single or multiple toggle selection, attached mode, orientation, keyboard navigation.",
        href: "/playground/components/intent-control-button-group",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlDropdown",
        description:
            "Dropdown / actions menu in a popover: custom trigger or IntentControlButton trigger, keyboard nav + typeahead, header/footer slots, glow-ready.",
        href: "/playground/components/intent-control-dropdown",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlFiles",
        description:
            "Intent-first file picker / dropzone: single or multiple files, drag & drop, clear/remove actions, validation, standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-files",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlColor",
        description:
            "Intent-first color picker: selectable swatches, grid/list layouts, preset color sets, optional custom native picker, standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-color",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlRange",
        description:
            "Intent-first range slider: standalone or naked, labels, value display, leading/trailing slots, glow-ready.",
        href: "/playground/components/intent-control-range",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlMarkdown",
        description:
            "Intent-first Markdown editor: toolbar, shortcuts, preview/split, standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-markdown",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlData",
        description:
            "Intent-first structural data editor (JSON/YAML/XML/…): textarea + syntax overlay, read-only, line numbers, standalone or wrapped by IntentControlField.",
        href: "/playground/components/intent-control-data",
        badge: "Control",
        badgeEmoji: emojiForBadge("Control"),
    },
    {
        title: "IntentControlNavList",
        description:
            "Intent-first vertical navigation (sidebar-style): wrapper + listbox items, active/inactive overrides, keyboard nav + typeahead, optional href items.",
        href: "/playground/components/intent-control-navlist",
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
    // ─────────────────────────────
    // 📊 Visualization
    // ─────────────────────────────
    {
        title: "IntentVisualizationBar",
        description:
            "Intent-first bar chart (SVG): global intent + per-bar intent override, accessible, stable hooks.",
        href: "/playground/components/intent-visualization-bar",
        badge: "Visualization",
        badgeEmoji: emojiForBadge("Visualization"),
    },

    // ─────────────────────────────
    // 🌳 Genealogy
    // ─────────────────────────────

    {
        title: "IntentGenealogyHierarchy",
        description:
            "Intent-first genealogy hierarchy (SVG): couples, trunk + sibling bar, selection, pan/zoom. Built for Space Memoria.",
        href: "/playground/components/intent-genealogy-hierarchy",
        badge: "Genealogy",
        badgeEmoji: emojiForBadge("Genealogy"),
    },
];
