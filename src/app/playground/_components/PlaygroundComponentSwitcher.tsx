"use client";

// src/app/playground/_components/PlaygroundComponentSwitcher.tsx
// PlaygroundComponentSwitcher
// - Global command palette to jump between playground components
// - Uses IntentCommandPalette from DS
// - mod+k open, type to filter, Enter navigates

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
    IntentCommandPalette,
    type IntentCommandPaletteGroup,
    type IntentCommandPaletteItem,
} from "intent-design-system";

type ComponentLink = {
    title: string;
    description: string;
    href: string;
    badge: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function badgeEmoji(badge: string) {
    const b = badge.toLowerCase();
    if (b === "surface") return "🧱";
    if (b === "control") return "🕹️";
    if (b === "layout") return "🧭";
    if (b === "indicator") return "🚦";
    if (b === "feedback") return "🔔";
    if (b === "data") return "🧬";
    return "✨";
}

export function PlaygroundComponentSwitcher({
    componentLinks,
    className,
}: {
    componentLinks: ComponentLink[];
    className?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const groups = React.useMemo((): IntentCommandPaletteGroup[] => {
        // group by badge
        const map = new Map<string, ComponentLink[]>();
        for (const c of componentLinks) {
            const key = c.badge || "Other";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }

        const sortedBadges = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));

        return sortedBadges.map((badge) => {
            const items: IntentCommandPaletteItem[] = (map.get(badge) ?? [])
                .slice()
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((c) => {
                    const isCurrent = pathname === c.href;

                    return {
                        id: c.href,
                        label: c.title,
                        description: c.description,
                        keywords: [
                            c.title,
                            c.badge,
                            c.href,
                            ...(c.description ? c.description.split(/\s+/) : []),
                        ],
                        leftIcon: (
                            <span aria-hidden className="intent-playground-cmdIcon">
                                {badgeEmoji(c.badge)}
                            </span>
                        ),
                        rightHint: isCurrent ? "Current" : "↵",
                        disabled: isCurrent,
                        onSelect: () => {
                            router.push(c.href);
                        },
                    };
                });

            return {
                id: `group-${badge.toLowerCase()}`,
                label: badge,
                items,
            };
        });
    }, [componentLinks, pathname, router]);

    return (
        <div className={cn("intent-playground-switcher", className)}>
            <IntentCommandPalette
                mode="dark"
                intent="informed"
                variant="elevated"
                intensity="strong"
                groups={groups}
                enableGlobalHotkey
                hotkey="mod+k"
                placeholder="Search a component…"
                footer={
                    <div className="intent-playground-cmdFooter">
                        <span className="intent-playground-kbd">↑</span>
                        <span className="intent-playground-kbd">↓</span>
                        <span className="opacity-60">navigate</span>
                        <span className="intent-playground-kbd">Enter</span>
                        <span className="opacity-60">open</span>
                        <span className="intent-playground-kbd">Esc</span>
                        <span className="opacity-60">close</span>
                    </div>
                }
            />
        </div>
    );
}
