# Vibe Coding Kit

## What's here

```
.github/
├── copilot-instructions.md              ← Always active. Visual rules, tech stack, anti-patterns.
├── prompts/
│   └── plan-my-app.prompt.md            ← Plan your app structure before building.
├── skills/
│   ├── dashboard-components/
│   │   └── SKILL.md                     ← How to build KPIs, charts, tables, alerts.
│   ├── mobile-app-patterns/
│   │   └── SKILL.md                     ← How to build mobile screens, nav, cards, headers.
│   └── web-app-patterns/
│       └── SKILL.md                     ← How to build web dashboards, sidebar, grids.
└── agents/
    └── prototype-builder.agent.md       ← Autonomous builder. Reads skills, checks files, verifies output.
```

## Setup

1. Open VS Code. Create a new folder for your prototype (or open an existing project).
2. Copy the `.github` folder into your project root.
3. Open Copilot Chat (Ctrl+Alt+I on Windows / Cmd+Shift+I on Mac).
4. Enable tools: click the **sliders icon** at the bottom of the Copilot Chat input. In the panel that opens, tick the checkbox next to **Built-In** to select all tools. Click **OK**.
5. Verify:
   - Type `/` in chat — you should see `/plan-my-app`
   - Click the mode dropdown — you should see `PrototypeBuilder`
   - Instructions are loaded automatically — you don't need to do anything

## How to use

### Step 1 — Plan

1. Set mode to **Plan** (bottom of chat input)
2. Type `/plan-my-app` and describe your problem statement
3. Copilot will ask clarifying questions, then produce a structured plan
4. Review and approve the plan

### Step 2 — Build

1. Switch mode to **Agent**
2. Select **PrototypeBuilder** from the agent dropdown
3. Ask it to build screens one at a time: "Build the home screen", "Build the goals screen"
4. The agent automatically reads skills, checks existing files, and verifies before presenting

### Step 3 — Iterate

- Ask the agent to fix specific issues: "The currency is wrong", "Add a sparkline to the cash flow section"
- Ask for new screens: "Now build the settings screen"
- The agent maintains context and reuses existing types and mock data

## How the layers work

```
You type a request
       ↓
Instructions load automatically (visual rules, tech stack, currency)
       ↓
Agent reads relevant skills (dashboard components, mobile patterns)
       ↓
Agent checks existing files (types.ts, mockData.ts, components)
       ↓
Agent builds and verifies (creates files, runs dev server, self-reviews)
```

**Instructions** — always on, every request. You never invoke them.

**Skills** — component knowledge that the agent reads before building. You don't invoke these directly.

**Agent** — the builder. It reads skills, checks your codebase, creates files, runs the dev server, and self-reviews before presenting.

**Prompt** — `/plan-my-app` is used once at the start to plan. After that, the agent handles building.

## Adapting to your use case

These files work for any domain — finance, healthcare, retail, travel, sports, automotive, manufacturing, or anything else. The instructions and skills are domain-agnostic.

Just describe your problem statement and persona clearly. The agent adapts.

If you want to customize:
- Edit `copilot-instructions.md` to change the color palette or tech stack
- The skills and agent work as-is for most prototyping scenarios
