// src/copy/fr.ts

export const fr = {
    meta: {
        title: "Intent Design System",
        description:
            "Un design system narratif où le sens précède le style. L’intention est la source de vérité.",
    },

    hero: {
        eyebrow: "Intent Design System",
        titleLine1: "Concevoir des interfaces",
        titleLine2: "avec intention",
        lead: {
            line1: "Un design system narratif où le sens précède le style.",
            strong: "Les visuels sont des conséquences.",
            line2: "L’intention est la source de vérité.",
        },
    },

    concepts: {
        eyebrow: "Concepts",
        title: "Un design system qui commence par le sens",
        lead: {
            line1: "Intent Design System n’est pas une librairie de couleurs. C’est un contrat sémantique : l’interface déclare",
            highlight: "ce qu’elle signifie",
            line2: "puis les visuels suivent, comme des conséquences.",
        },

        cards: {
            intent: {
                eyebrow: "🎯 Intention",
                title: "L’intention d’abord",
                body: {
                    line1Prefix:
                        "Les composants ne choisissent pas des couleurs. Ils choisissent une ",
                    strong: "posture de message",
                    line1Suffix:
                        " : calme, gratifiante, prudente, critique, thématique, teintée ou atmosphérique.",
                    rule: "Règle : le sens précède le style.",
                },
            },

            variants: {
                eyebrow: "🧭 Variantes",
                title: "La structure, pas le sens",
                body: {
                    line1Prefix: "Les variantes décrivent ",
                    strong: "comment l’intention occupe l’espace",
                    line1Suffix:
                        " : flat (silencieuse), outlined (précise), elevated (stratifiée), ghost (éphémère).",
                    rule: "Règle : la variante ne change jamais l’intention.",
                },
            },

            tone: {
                eyebrow: "🎨 Ton",
                title: "Le ton est une conséquence",
                body: {
                    line1: "Le ton exprime une famille de couleur (émeraude, ambre, rose…), mais il ne définit pas le sens. Le ton peut être explicite (toned) ou implicite (intentions sémantiques).",
                    rule: "Règle : le ton suit l’intention, pas l’inverse.",
                },
            },

            glow: {
                eyebrow: "✨ Aura",
                title: "L’aura est une présence, pas une décoration",
                body: {
                    line1Prefix:
                        "L’aura est un système d’emphase. On l’utilise avec parcimonie pour dire ",
                    strong: "ça compte",
                    line1Suffix:
                        " (soit via un glow implicite sur les intents, soit via une aura esthétique en mode glowed).",
                    rule: "Règle : l’aura doit mériter d’exister.",
                },
            },
        },

        note: {
            eyebrow: "Note de design",
            body: "L’objectif n’est pas de faire une “UI jolie”. L’objectif est une UI qui sait toujours ce qu’elle essaie de dire, et qui le dit avec retenue.",
        },
    },

    manifesto: {
        eyebrow: "Manifeste",
        title: "Un contrat narratif entre l’interface et le joueur",

        paragraphs: {
            opening: "Chaque interface parle. Mais toutes ne savent pas ce qu’elles veulent dire.",

            intent: "La plupart des design systems commencent par des tokens et des palettes. Celui-ci commence par l’intention. Avant qu’une couleur apparaisse, avant qu’une aura n’émerge, avant qu’un bouton demande à être pressé : il y a du sens.",

            restraint:
                "Le système privilégie la retenue : le silence est un outil de design, le contraste n’existe que s’il est rare, et l’aura ne doit jamais devenir un bruit de fond.",
        },

        directive: {
            eyebrow: "Directive fondamentale",
            line1: "Les visuels ne sont pas des décisions.",
            line2Strong: "conséquences",
        },

        actions: {
            playground: "Ouvrir le playground",
            github: "Lire sur GitHub",
        },
    },

    preview: {
        eyebrow: "Aperçu",
        title: "Quelques états sémantiques",
        lead: [
            "Ce n’est pas le package. Juste un aperçu visuel pour présenter le vocabulaire.",
            "Les vrais composants et le resolver vivent dans le playground.",
        ],

        tile: {
            badge: "aperçu",
            notePrefix:
                "Cette tuile est un aperçu statique pour la landing. Le vrai comportement se trouve dans",
            playgroundPath: "/playground",

            items: {
                informed: {
                    label: "Informed",
                    hint: "Le monde parle, sans pression.",
                },
                empowered: {
                    label: "Empowered",
                    hint: "Tu as réussi. La confiance augmente.",
                },
                warned: {
                    label: "Warned",
                    hint: "Attention requise, sans panique.",
                },
                threatened: {
                    label: "Threatened",
                    hint: "État critique. Il y a des conséquences.",
                },
                themed: {
                    label: "Themed",
                    hint: "Lié à l’identité de ton app.",
                },
                glowed: {
                    label: "Glowed",
                    hint: "Présence. Atmosphère. Accent.",
                },
            },
        },

        cta: {
            playground: "Tester les vrais composants",
        },
    },

    footer: {
        brand: "Intent Design System",
        tagline: "Design narratif. Le sens avant le style.",

        links: {
            playground: "Playground",
            github: "GitHub",
            npm: "NPM",
        },

        bottom: {
            copyrightPrefix: "©",
            author: "Julien Julien",
            note: "Conçu pour RPG Renaissance, et au-delà.",
        },
    },

    playground: {
        eyebrow: "Playground",
        title: "Tester le resolver et les composants réels",
        lead: "Cette page est le seul endroit où la landing importe le package. Modifie intent, variant, tone et glow pour voir le système réagir.",

        ui: {
            controlsTitle: "Contrôles",

            intent: "INTENT",
            variant: "VARIANT",
            tone: "TONE",
            glow: "GLOW",
            intensity: "INTENSITY",
            mode: "MODE",
            state: "ÉTAT",

            disabled: "désactivé",

            previewDark: "DARK",
            previewLight: "LIGHT",

            buttonLabel: "IntentControlButton",
            surfaceTitle: "Aperçu IntentSurface",
            surfaceBody: "Hooks stables + variables CSS. Pas de classes Tailwind dynamiques.",

            resolvedTitle: "Resolved (debug)",
            warningsTitle: "Warnings",

            hintToneOnly: 'Le tone est appliqué uniquement quand intent="toned".',
            hintGlowNormal:
                'Mode normal : glow = false/true. Passe en intent="glowed" pour choisir un glow esthétique.',
            hintGlowGlowed:
                "Mode glowed : uniquement les glows esthétiques (aurora/ember/cosmic/...).",
        },
    },

    doc: {
        meta: {
            title: "Docs · Intent Design System",
            description:
                "Une page de documentation narrative et pratique pour Intent Design System : concepts, installation et usage.",
        },

        eyebrow: "Documentation",
        title: "Un petit guide pour Intent Design System",
        lead: "L’intention est la source de vérité. Cette page pose le vocabulaire, les règles, et comment démarrer sans bruit.",

        ctaPlayground: "Ouvrir le playground",
        ctaGithub: "Lire sur GitHub",

        githubUrl: "https://github.com/iamjulienjulien/intent-design-system",
        npmUrl: "https://www.npmjs.com/package/intent-design-system",

        quickstart: {
            eyebrow: "Démarrage",
            title: "Installer, importer, rendre votre première intention",
            body: "IDS fournit du CSS runtime (tokens + styles intent) et une petite API React. Importez le CSS une fois, puis utilisez les composants.",
            installTitle: "Installer",
            installCode: `npm i intent-design-system`,
            usageTitle: "Utilisation",
            usageCode: `import "intent-design-system/styles";

import { IntentSurface, IntentControlButton } from "intent-design-system";

export function Example() {
    return (
        <IntentSurface intent="informed" variant="elevated" className="p-6 rounded-2xl">
            <div className="text-sm font-semibold">Le sens d’abord</div>
            <div className="text-xs opacity-70">Le visuel est une conséquence.</div>

            <div className="mt-4">
                <IntentControlButton intent="empowered" variant="elevated">
                    Continuer
                </IntentControlButton>
            </div>
        </IntentSurface>
    );
}`,
            note: 'Astuce : tone ne s’applique que si intent="toned". Les glows esthétiques ne s’appliquent que si intent="glowed".',
        },

        concepts: {
            eyebrow: "Concepts",
            title: "Un vocabulaire (et des règles) fiables",
            cards: [
                {
                    eyebrow: "🎯 Intent",
                    title: "Le sens d’abord",
                    body: "Choisissez une posture sémantique : informed, empowered, warned, threatened, themed, toned, ou glowed. Les composants ne “choisissent” pas leurs couleurs.",
                    rule: "Règle : le sens précède le style.",
                },
                {
                    eyebrow: "🧭 Variants",
                    title: "Structure, pas signification",
                    body: "Les variants décrivent comment le composant occupe l’espace : flat, outlined, elevated, ghost.",
                    rule: "Règle : un variant ne change jamais l’intent.",
                },
                {
                    eyebrow: "🎨 Tone",
                    title: "Tone est une conséquence",
                    body: 'Tone sélectionne une famille de couleurs. Il est explicite uniquement avec intent="toned" et implicite pour les intents sémantiques.',
                    rule: "Règle : tone suit intent.",
                },
                {
                    eyebrow: "✨ Glow",
                    title: "Glow est une présence",
                    body: "Glow est un système d’emphase. Utilisez-le avec parcimonie pour préserver le sens. En mode glowed, on choisit une aura esthétique.",
                    rule: "Règle : glow doit mériter son existence.",
                },
            ],
        },

        links: {
            eyebrow: "Liens",
            title: "Pour aller plus loin",
            playground: "Playground",
            github: "GitHub",
            npm: "NPM",
            noteEyebrow: "Note de design",
            noteBody:
                "Le but n’est pas de faire “joli”. Le but est une UI qui sait toujours ce qu’elle veut dire, et le dit avec retenue.",
        },
    },
} as const;

export type CopyFr = typeof fr;
