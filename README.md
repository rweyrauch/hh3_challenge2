# Horus Heresy 3rd-Edition Challenge Phase Simulator

A browser-based simulator for the **Challenge Sub-Phase** from *Horus Heresy 3rd Edition*. Play as one of 190+ characters across 15 factions in 1v1 duels, while a heuristic AI controls your opponent.

**[Play Online](https://rweyrauch.github.io/hh3_challenge2/)**

---

## Features

- **Full rules implementation** — Hit/Wound tables, Armor/Invulnerable saves, AP, all core Gambits, and special rules (Eternal Warrior, Rending, Feel No Pain, Poisoned, etc.)
- **190+ playable characters** across 15 factions: Legio Custodes, Legion Astartes, Loyalist & Traitor Legions, Orks, Daemons, Mechanicum, Divisio Assassinorum, Militia, Solar Auxilia, Anathema Psykana, Blackshields, Cults Abominatio, Skitarii, and Legio Titanicus
- **60 Gambits** — 9 core gambits plus 51 faction-specific gambits with unique mechanics (Force weapons, psychic checks, pre-strike shooting, subfaction traits, and more)
- **Heuristic AI opponent** — scores and selects Gambits based on combat state; beatable but not trivial
- **Simulate mode** — automatically tests every opening Gambit over hundreds of simulated challenges and ranks them; the top Gambit can be carried straight into a real match with a visual highlight
- **Real-time combat log** — color-coded rolls and results for every phase
- **Immutable state engine** — pure functional core with a dice abstraction layer for full testability
- **126 passing unit tests**

---

## The Challenge Phase

Each round of a Challenge plays out in four steps:

| Step | Description |
|------|-------------|
| **Face-Off** | Both sides secretly choose a Gambit |
| **Focus** | Roll for Challenge Advantage (attack order); Gambits like *Seize the Initiative* apply here |
| **Strike** | Execute attacks: Hit → Wound → Save → Damage; the Advantage holder strikes first |
| **Glory** | Calculate Combat Resolution Points (CRP); decide to continue or withdraw |

The challenge ends when one combatant is slain (casualty) or a fighter successfully uses **Withdraw**.

---

## Simulate Mode

The **Simulate** button on the character selection screen runs a fully automated batch analysis before you start a match.

1. **Select both characters** as normal, then click **Simulate** instead of Begin.
2. The simulator plays out **500 full challenges per Gambit** (all Gambits available to your character), advancing every phase automatically — the AI drives both sides using heuristic selection.
3. A **ranked results table** is shown once all simulations finish:

   | Rank | Gambit | Win% | CRP Δ | Score |
   |------|--------|------|-------|-------|
   | 1 | *best gambit* | 72% | +2.1 | 0.73 |
   | 2 | … | … | … | … |

   - **Win%** — percentage of simulations won outright (casualty or CRP)
   - **CRP Δ** — average (player CRP − AI CRP) across all simulations
   - **Score** — composite metric: `Win% × 0.7 + clamp(CRP Δ / total wounds, 0, 1) × 0.3`

4. Click **Play with best Gambit** to launch a real match. The top-ranked Gambit is highlighted with a ★ badge in the Face-Off panel for Round 1, then the highlight clears automatically.

---

## Factions & Characters

| Faction | Example Characters |
|---------|--------------------|
| Legion Astartes | Praetor (many variants), Centurion, Champion, Chaplain |
| Loyalist Legions | Dark Angels, White Scars, Space Wolves, Salamanders, and more |
| Traitor Legions | Emperor's Children, Iron Warriors, Night Lords, Word Bearers, and more |
| Legio Custodes | Constantin Valdor, Tribune, Shield Captain, Custodian Guard |
| Daemons | Ruinstorm Sovereigns, Hierarchs, Kabandha |
| Mechanicum | Archmagos, Tech-Priest Auxilia, Cybernetica Dominus; subfactions: Archimandrite, Cybernetica, Malagra, Myrmidax |
| Divisio Assassinorum | Eversor, Callidus, Culexus, Adamus, Venenum |
| Orks (unofficial) | Warboss & Mega Warboss (clan variants: Goffs, Blood Axes, etc.) |
| Militia & Levies | Force Commander, Discipline Master, Lieutenant, Lancemaster |
| Solar Auxilia | Legate-Marshall, Auxilia Captain, First Prime |
| Anathema Psykana | Jenetia Krole, Knight-Centura |
| Blackshields | Endryd Haar |
| Cults Abominatio | Infernus Abomination |
| Skitarii | Battle-Pilgrym Marshal |
| Legio Titanicus | Secutarii Axiarch |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.4 | Strict-mode, ES2020 |
| Vite | 5.2 | Dev server & bundler |
| Bootstrap | 5.3 | Responsive UI (dark theme) |
| Vitest | 1.6 | Unit testing |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/rweyrauch/hh3_challenge2.git
cd hh3_challenge2
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Other Commands

```bash
npm run build       # Type-check + production build (outputs to /dist)
npm run test        # Run all 126 unit tests
npm run test:watch  # Watch mode for TDD
npm run preview     # Preview the production build locally
```

---

## Project Structure

```
src/
├── engine/          # Core simulation logic (immutable state machine)
│   ├── challengeEngine.ts   # Phase orchestration
│   ├── focusStep.ts         # Focus Roll resolution
│   ├── strikeStep.ts        # Hit → Wound → Save → Damage
│   ├── gloryStep.ts         # CRP calculation & challenge end
│   ├── gambitEffects.ts     # All Gambit modifier functions
│   ├── tables.ts            # Rulebook Hit/Wound look-up tables
│   ├── dice.ts              # DiceRoller interface (real + fake for tests)
│   └── simulationRunner.ts  # Batch gambit analysis (Simulate mode)
├── ai/
│   └── heuristicAI.ts       # Gambit scoring & selection
├── data/
│   ├── factions/            # Character definitions (stats, weapons, special rules)
│   └── gambits/             # Core & faction-specific Gambit definitions
├── ui/
│   ├── app.ts               # Screen router
│   └── screens/             # Selection, Combat, Result, and Simulation screens
└── models/                  # Shared TypeScript interfaces
```

---

## Architecture

The simulation engine is built around an **immutable state machine**:

```
setup → faceOff → focus → strike-player → strike-ai → glory → (faceOff | ended)
```

- **No side effects** — `advance(state, input) → (newState, waitingForInput)`
- **Dice abstraction** — `RealDiceRoller` uses `Math.random()`; `FakeDiceRoller` replays fixed sequences for deterministic tests
- **Separation of concerns** — engine, AI, data, and UI are fully decoupled

---

## Testing

```bash
npm run test
```

```
src/engine/__tests__/
├── tables.test.ts            21 tests — Hit/Wound table look-ups
├── combatInitiative.test.ts  14 tests — CI calculations with all modifiers
├── gambitEffects.test.ts     24 tests — All Gambit modifiers per phase
├── strikeStep.test.ts        44 tests — Attack sequence, special rules, casualties
├── gloryStep.test.ts          9 tests — CRP, withdrawal, Taunt & Bait
├── focusStep.test.ts          9 tests — Focus rolls, advantage resolution
└── challengeEngine.test.ts    5 tests — State machine transitions
                              ───────────
                              126 tests total (100% passing)
```

---

## Disclaimer

This project is a fan-made simulator for personal and educational use. *Horus Heresy*, *Legions Imperialis*, and all related names are trademarks of Games Workshop Ltd. This project is not affiliated with or endorsed by Games Workshop.
