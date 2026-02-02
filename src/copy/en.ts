// src/copy/en.ts

export const en = {
    meta: {
        title: "Intent Design System",
        description:
            "A narrative-first design system where meaning comes before style. Intent is the source of truth.",
    },

    hero: {
        eyebrow: "Intent Design System",
        titleLine1: "Design interfaces",
        titleLine2: "with intent",
        lead: {
            line1: "A narrative-first design system where meaning comes before style.",
            strong: "Visuals are consequences.",
            line2: "Intent is the source of truth.",
        },
    },

    concepts: {
        eyebrow: "Concepts",
        title: "A design system that starts with meaning",
        lead: {
            line1: "Intent Design System is not a color library. It’s a semantic contract: the UI declares",
            highlight: "what it means",
            line2: "then visuals follow as consequences.",
        },

        cards: {
            intent: {
                eyebrow: "🎯 Intent",
                title: "Intent comes first",
                body: {
                    line1Prefix: "Components don’t choose colors. They choose a ",
                    strong: "message posture",
                    line1Suffix:
                        ": calm, rewarding, cautionary, critical, themed, tinted, or atmospheric.",
                    rule: "Rule: meaning precedes style.",
                },
            },

            variants: {
                eyebrow: "🧭 Variants",
                title: "Structure, not meaning",
                body: {
                    line1Prefix: "Variants describe ",
                    strong: "how the intent occupies space",
                    line1Suffix:
                        ": flat (silent), outlined (precise), elevated (layered), ghost (ephemeral).",
                    rule: "Rule: variant never changes intent.",
                },
            },

            tone: {
                eyebrow: "🎨 Tone",
                title: "Tone is a consequence",
                body: {
                    line1: "Tone expresses a color family (emerald, amber, rose…), but it does not define meaning. Tone can be explicit (toned) or implicit (semantic intents).",
                    rule: "Rule: tone follows intent, not the opposite.",
                },
            },

            glow: {
                eyebrow: "✨ Glow",
                title: "Glow is presence, not decoration",
                body: {
                    line1Prefix: "Glow is an emphasis system. It’s used sparingly to say ",
                    strong: "this matters",
                    line1Suffix:
                        " (either as an implicit glow on intents, or as an aesthetic aura in glowed mode).",
                    rule: "Rule: glow must earn its existence.",
                },
            },
        },

        note: {
            eyebrow: "Design note",
            body: "The goal isn’t “pretty UI”. The goal is a UI that always knows what it’s trying to say, and says it with restraint.",
        },
    },

    manifesto: {
        eyebrow: "Manifesto",
        title: "A narrative contract between the interface and the player",

        paragraphs: {
            opening: "Every interface speaks. Not every interface knows what it wants to say.",

            intent: "Most design systems begin with tokens and palettes. This one begins with intent. Before color appears, before glow emerges, before a button asks to be pressed: there is meaning.",

            restraint:
                "The system favors restraint: silence is a design tool, contrast only works if it is rare, and glow must never become background noise.",
        },

        directive: {
            eyebrow: "Prime directive",
            line1: "Visuals are not decisions.",
            line2Strong: "consequences",
        },

        actions: {
            playground: "Open the playground",
            github: "Read on GitHub",
        },
    },

    preview: {
        eyebrow: "Preview",
        title: "A few semantic states",
        lead: [
            "This is not the package. Just a quick visual teaser to communicate the vocabulary.",
            "The actual components and resolver live in the playground.",
        ],

        tile: {
            badge: "preview",
            notePrefix: "This tile is a static preview for the landing. The real behavior lives in",
            playgroundPath: "/playground",

            items: {
                informed: {
                    label: "Informed",
                    hint: "The world speaks, without pressure.",
                },
                empowered: {
                    label: "Empowered",
                    hint: "You succeeded. Confidence increases.",
                },
                warned: {
                    label: "Warned",
                    hint: "Attention required, no panic.",
                },
                threatened: {
                    label: "Threatened",
                    hint: "Critical state. Consequences exist.",
                },
                themed: {
                    label: "Themed",
                    hint: "Bound to your app identity.",
                },
                glowed: {
                    label: "Glowed",
                    hint: "Presence. Atmosphere. Emphasis.",
                },
            },
        },

        cta: {
            playground: "Try the real components",
        },
    },

    footer: {
        brand: "Intent Design System",
        tagline: "Narrative-first design. Meaning before style.",

        links: {
            playground: "Playground",
            github: "GitHub",
            npm: "NPM",
        },

        bottom: {
            copyrightPrefix: "©",
            author: "Julien Julien",
            note: "Built for RPG Renaissance and beyond.",
        },
    },

    playground: {
        eyebrow: "Playground",
        title: "Try the real resolver and components",
        lead: "This page is the only place where the landing imports the package. Tweak intent, variant, tone and glow to see the system react.",

        ui: {
            controlsTitle: "Controls",

            intent: "INTENT",
            variant: "VARIANT",
            tone: "TONE",
            glow: "GLOW",
            intensity: "INTENSITY",
            mode: "MODE",
            state: "STATE",

            disabled: "disabled",

            previewDark: "DARK",
            previewLight: "LIGHT",

            buttonLabel: "IntentControlButton",
            surfaceTitle: "IntentSurface preview",
            surfaceBody: "Stable hooks + CSS variables. No dynamic Tailwind classes.",

            resolvedTitle: "Resolved (debug)",
            warningsTitle: "Warnings",

            hintToneOnly: 'Tone is applied only when intent="toned".',
            hintGlowNormal:
                'Normal mode: glow is false/true. Switch to intent="glowed" for aesthetic glows.',
            hintGlowGlowed: "Glowed mode: only aesthetic glows (aurora/ember/cosmic/...).",
        },
    },

    doc: {
        meta: {
            title: "Docs · Intent Design System",
            description:
                "A practical, narrative-first documentation page for Intent Design System: concepts, install, and usage.",
        },

        eyebrow: "Documentation",
        title: "A small guide to Intent Design System",
        lead: "Intent is the source of truth. This page explains the vocabulary, the rules, and how to start using the system without noise.",

        ctaPlayground: "Open the playground",
        ctaGithub: "Read on GitHub",

        githubUrl: "https://github.com/iamjulienjulien/intent-design-system",
        npmUrl: "https://www.npmjs.com/package/intent-design-system",

        quickstart: {
            eyebrow: "Quickstart",
            title: "Install, import, and render your first intent",
            body: "IDS ships runtime CSS (tokens + intent styles) and a small React API. Import the CSS once, then use components in your UI.",
            installTitle: "Install",
            installCode: `npm i intent-design-system`,
            usageTitle: "Usage",
            usageCode: `import "intent-design-system/styles/tokens.css";
import "intent-design-system/styles/intent.css";

import { IntentSurface, IntentControlButton } from "intent-design-system";

export function Example() {
    return (
        <IntentSurface intent="informed" variant="elevated" className="p-6 rounded-2xl">
            <div className="text-sm font-semibold">Meaning first</div>
            <div className="text-xs opacity-70">Visuals are consequences.</div>

            <div className="mt-4">
                <IntentControlButton intent="empowered" variant="elevated">
                    Continue
                </IntentControlButton>
            </div>
        </IntentSurface>
    );
}`,
            note: 'Tip: tone only applies when intent="toned". Aesthetic glows only apply when intent="glowed".',
        },

        concepts: {
            eyebrow: "Concepts",
            title: "Vocabulary (and rules) you can rely on",
            cards: [
                {
                    eyebrow: "🎯 Intent",
                    title: "Meaning comes first",
                    body: "Choose a semantic posture: informed, empowered, warned, threatened, themed, toned, or glowed. Components don’t pick colors by themselves.",
                    rule: "Rule: meaning precedes style.",
                },
                {
                    eyebrow: "🧭 Variants",
                    title: "Structure, not meaning",
                    body: "Variants describe how the component occupies space: flat, outlined, elevated, ghost.",
                    rule: "Rule: variant never changes intent.",
                },
                {
                    eyebrow: "🎨 Tone",
                    title: "Tone is a consequence",
                    body: 'Tone selects a color family. It’s explicit only with intent="toned" and implicit for semantic intents.',
                    rule: "Rule: tone follows intent.",
                },
                {
                    eyebrow: "✨ Glow",
                    title: "Glow is presence",
                    body: "Glow is emphasis. Use it sparingly so it keeps meaning. In glowed mode, you choose an aesthetic aura.",
                    rule: "Rule: glow must earn its existence.",
                },
            ],
        },

        links: {
            eyebrow: "Links",
            title: "Where to go next",
            playground: "Playground",
            github: "GitHub",
            npm: "NPM",
            noteEyebrow: "Design note",
            noteBody:
                "The goal isn’t “pretty UI”. It’s a UI that always knows what it’s trying to say, and says it with restraint.",
        },
    },
} as const;

export type CopyEn = typeof en;
