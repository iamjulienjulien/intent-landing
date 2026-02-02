// src/app/playground/layout.tsx
import * as React from "react";
import { PlaygroundComponentSwitcher } from "./_components/PlaygroundComponentSwitcher";
import { COMPONENT_LINKS } from "./components/_data/componentsLinks";

type ComponentLink = {
    title: string;
    description: string;
    href: string;
    badge: string;
};

const componentLinks: ComponentLink[] = [
    {
        title: "IntentSurface",
        description: "Semantic surface container with ring, bg, and optional glow layers.",
        href: "/playground/components/intent-surface",
        badge: "Surface",
    },
    {
        title: "IntentCommandPalette",
        description:
            "Command palette (⌘K/Ctrl+K): overlay + panel + search + list, keyboard nav, glow-ready.",
        href: "/playground/components/intent-command-palette",
        badge: "Surface",
    },
    {
        title: "IntentToast",
        description:
            "Intent-first toast notification: auto-dismiss, optional action, dismissible, placements.",
        href: "/playground/components/intent-toast",
        badge: "Feedback",
    },
    {
        title: "IntentCodeViewer",
        description:
            "Intent-first code/data viewer: highlight tokens reflect intent, optional header/meta, copy, wrap, line numbers.",
        href: "/playground/components/intent-code-viewer",
        badge: "Data",
    },
    {
        title: "IntentJourney",
        description:
            "Intent-first journey (stepper/timeline): vertical or horizontal, statuses, clickable steps, keyboard nav.",
        href: "/playground/components/intent-journey",
        badge: "Layout",
    },
    {
        title: "IntentControlButton",
        description: "Primary control button: intent-driven visuals, glow-ready, stable hooks.",
        href: "/playground/components/intent-control-button",
        badge: "Control",
    },
    {
        title: "IntentControlSelect",
        description: "Intent-first custom select: combobox + listbox, keyboard nav, glow-ready.",
        href: "/playground/components/intent-control-select",
        badge: "Control",
    },
    {
        title: "IntentControlField",
        description:
            "Intent-first field wrapper: label/description/error, optional leading/trailing slots, layout variants.",
        href: "/playground/components/intent-control-field",
        badge: "Control",
    },
    {
        title: "IntentControlToggle",
        description:
            "Intent-first toggle switch: track + thumb, optional label/description, glow-ready.",
        href: "/playground/components/intent-control-toggle",
        badge: "Control",
    },
    {
        title: "IntentControlTabs",
        description:
            "Intent-first tabs (segmented control): keyboard nav, optional equal/fullWidth, glow-ready.",
        href: "/playground/components/intent-control-tabs",
        badge: "Control",
    },
    {
        title: "IntentControlLink",
        description: "Navigation/link control with the same intent mechanics as buttons.",
        href: "/playground/components/intent-control-link",
        badge: "Control",
    },
    {
        title: "IntentIndicator",
        description: "Small semantic indicator for statuses, steps, or system states.",
        href: "/playground/components/intent-indicator",
        badge: "Indicator",
    },
    {
        title: "IntentDivider",
        description:
            "Intent-first layout divider: horizontal or vertical line with optional label.",
        href: "/playground/components/intent-divider",
        badge: "Layout",
    },
];

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Global palette: mod+k */}
            <PlaygroundComponentSwitcher componentLinks={COMPONENT_LINKS} />

            {children}
        </>
    );
}
