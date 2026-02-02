# Intent Design System — Landing

Public landing & playground for **Intent Design System**.  
This site documents the philosophy, concepts, and visual language of the system, and provides a dedicated playground to experiment with intents, variants, tones, and glows.

---

## 🌍 Purpose

This repository powers the website:

**https://intent.julienjulien.fr**

It serves three goals:

1. **Explain** the Intent Design System philosophy (editorial, narrative-first)
2. **Document** the core concepts (intent, tone, glow, variants)
3. **Demonstrate** the system via an isolated playground

The landing itself is **editorial-first**.  
The actual `intent-design-system` package is **only used inside the playground page**.

---

## 🧠 Philosophy (short version)

Intent Design System starts with **meaning**, not visuals.

Interfaces do not ask:

> “Which color should I use?”

They ask:

> “What is my intent?”

Visuals are consequences.

For the full manifesto, see the website or `/content/manifesto`.

---

## 🧱 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS v4**
- **npm**
- **Vercel-ready**

No CMS.  
No runtime dependencies for the landing itself.  
Static-first, fast, and portable.

---

## 🌐 Internationalization

The site is fully **bilingual**:

- 🇺🇸 English
- 🇫🇷 French

All editorial content lives in `/content` and is language-scoped.

Example:

```
content/
  manifesto.en.ts
  manifesto.fr.ts
```

---

## 📁 Project Structure

```
src/
  app/
    layout.tsx
    page.tsx          # Landing (EN / FR)
    playground/       # Interactive playground
  components/
    Landing/
    Playground/
  content/
    manifesto.en.ts
    manifesto.fr.ts
```

---

## 🎮 Playground

The `/playground` page is the **only place** where the
`intent-design-system` package is imported.

This keeps:

- the landing pure and editorial
- the playground technical and experimental

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 🧭 Roadmap

- [x] Editorial landing (Hero, Manifesto, Concepts)
- [x] Language switch (EN / FR)
- [x] Playground (IntentSurface, controls, live preview)
- [x] Visual examples (static & interactive)
- [x] Deployment on `intent.julienjulien.fr`

---

## ✨ Author

**Julien Julien**  
Developer · Designer · Narrative systems  
🇫🇷 Angers, France

- https://julienjulien.fr

---

## 📜 License

MIT — free to use, adapt, and explore.

Design with intent.

---

## 👋 About the developer

**Julien Julien**  
Full Stack Developer & narrative project creator.

> I design sustainable digital applications and tools  
> where code, structure, and storytelling move forward together.
>
> I favor clear, evolutive systems,  
> built for the long term rather than the instant.

📍 Angers, France 🇫🇷  
🌍 https://julienjulien.fr
