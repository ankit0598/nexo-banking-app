---
description: "Plan the app structure before building anything. Use this FIRST. Switch to Plan mode before running this prompt."
---
# Plan My App

I need you to plan the structure of my prototype app before writing any code.

## What I'll give you

I'll describe my problem statement, the target user persona, and the key features I want.

## What I need back

1. **Screens** — List every screen the app needs. One line per screen: name + what it shows.

2. **Main screen breakdown** — The home/main screen is the most important. Break it into named sub-components with a clear render order: ①, ②, ③. Each sub-component gets a name and a one-line description.

3. **Navigation plan** — What is the navigation structure? Depends on platform:
   - Mobile: bottom nav with 4–5 items, which screens are tabs vs detail pages
   - Web: sidebar with grouped sections OR top nav, which items are top-level vs nested

4. **File structure** — List every file to create: types, mock data, store, components, screen files, app shell. One file per line.

5. **Build order** — Number the files in order. Always: types → mock data → store → components → screens → app shell with routing.

6. **Data model** — Define TypeScript interfaces for the core data objects. These go into `types.ts`.

## Rules — STRICT

- **DO NOT produce a plan immediately. You MUST ask questions first.** No exceptions. Even if the user's description seems clear, ask before planning.

- **Question 1 (always ask first):** What platform?
  - **Mobile** — phone screens, bottom nav, touch interactions, phone shell wrapper
  - **Web** — browser layout, sidebar or top nav, desktop-optimised

- **Question 2 (always ask after platform):** Ask 3–5 clarifying questions about the app. Examples:
  - What goes on the home/main screen vs secondary screens?
  - What entity types exist (accounts, patients, vehicles, items)?
  - What are the key metrics or statuses to show?
  - What currency and locale?
  - Who is the user persona?

- **Only after the user answers ALL questions, produce the plan.**

- Keep the main screen focused: 3–4 sections maximum.

- Navigation rules:
  - Mobile: 4–5 bottom nav items
  - Web: sidebar with 5–8 items grouped into sections, or top nav with 4–6 items

- Plan for realistic mock data — real-sounding names, plausible numbers, correct currency and units.

- Do NOT ask about tech stack, frameworks, or chart libraries — already defined in the project instructions.

## After the plan is approved

Switch to PrototypeBuilder mode and type: "Build the application as per the shared plan".
