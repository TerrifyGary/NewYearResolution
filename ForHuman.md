# ForHuman — a practical guide to maintaining this game

This guide is for making changes yourself, without an AI agent or AI token. This is a local TypeScript/Vue project: the game does not need an AI service, paid API, or hosted server to run.

The project is a Taiwan life-simulation text RPG. Its interface is in `apps/web`; the simulation rules live separately in `packages/engine`. That separation is important: the engine decides what happens, and the interface displays it and asks the player what to do.

## Get it running

You need Node.js 22.12 or newer (24 is recommended) and npm. The first dependency install may need an internet connection; development and test commands use the installed packages on your computer.

From the project folder:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite, usually `http://127.0.0.1:5173/`. Stop the server with `Ctrl+C`.

Before sharing a change, run:

```sh
npm test
npm run build
```

`npm test` runs the automated engine and interface tests; the long-life simulation tests can take a few minutes. `npm run build` checks Vue/TypeScript and creates the static website in `dist/`. Neither command requires an AI token. Python is only needed for the separate data/asset scripts described below.

## Where to make a change

| What you want to change | Start here |
| --- | --- |
| Screen layout, buttons, wording, or player interaction | `apps/web/src/App.vue` and the relevant smaller `.vue` component; styles are in `apps/web/src/style.css`. |
| What happens after a player choice, year advancement, or game rule | The relevant module in `packages/engine/src/` (see the module guide below). |
| A game concept or saved-state field | `packages/shared/src/types.ts` and, for additional per-person life data, `packages/shared/src/life.ts`. |
| Whether saved games accept a field or value | `packages/engine/src/life-schema.ts`; the complete save format and version migrations are in `packages/engine/src/save.ts`. |
| School, population, job, name, or other reference data | Relevant files in `packages/world-data/src/`; check `docs/HISTORICAL_DATA.md` before changing historical claims. |
| A regression or newly supported behavior | The matching test in `tests/`. Add or update a test with the change. |
| Project purpose, source notes, or system behavior | The relevant file in `docs/`, then update that documentation along with the feature. |

For a new feature, a good order is: define its data/type, implement deterministic engine behavior, test that behavior, connect the UI, then update the relevant documentation. For a text-only UI edit, you normally do not need to touch the engine.

## Folder map

### Project root

- `index.html` is the browser page that loads the app.
- `package.json` defines scripts and dependencies. `package-lock.json` pins the installed package versions; do not hand-edit it.
- `vite.config.ts` configures the development server and static build; `tsconfig.json` configures TypeScript checks.
- `AGENTS.md` contains project-specific development rules. These apply whether or not an AI agent is used.
- `.github/workflows/pages.yml` runs tests/build in GitHub Actions and can deploy GitHub Pages when deployment is enabled.

### `apps/web/` — the website and presentation

- `src/main.ts` starts Vue and mounts the app.
- `src/App.vue` is the main game interface and connects user actions to the engine.
- Other `.vue` files split out parts of the interface, such as records, family, belongings, finances, naming, and music/sports views.
- `src/storage.ts` saves and loads the game in this browser's IndexedDB. It is not a cloud save service.
- `src/presentation.ts` and `src/style.css` handle presentation/text and visual styling, not the core simulation rules.
- `public/` contains static browser assets, including the standalone uniform library and illustrations. Files there are copied into the built website.

### `packages/engine/` — the simulation

This is the best place to look when a rule or outcome needs changing. It should remain independent of Vue and the browser UI.

- `src/index.ts` is the main game-flow API: start a game, choose a focus, advance, present options, resolve decisions, and continue as a successor.
- Other `src/*.ts` modules implement areas such as education, family, progression, careers, finance, health, events, and keepsakes. Follow the domain of the behavior you are changing.
- `src/save.ts` serializes and validates saved games and migrates older supported save versions.
- `src/life-schema.ts` validates optional life-state data. If a new value must persist in a save, check both its shared type and its validation/migration path.

### `packages/shared/` — types used across the app

`src/types.ts` defines shared concepts such as people, events, game state, and bilingual text (`zh` and `en`). `src/life.ts` defines additional life-state fields. Add types here when both the UI and engine need to agree on the shape of the data; do not duplicate competing definitions in the UI.

### `packages/world-data/` — game reference data

- `src/` contains the data modules and JSON catalogues used by the game (for example schools, geography, population, names, careers, and calendars).
- `raw/` contains CSV inputs used by the data import tools.
- `src/index.ts` provides shared data/provenance exports.

Some entries represent documented historical sources; others are explicitly estimates or fictional gameplay settings. Check the dataset's notes and `docs/HISTORICAL_DATA.md` before changing values. Do not turn an estimate into a claimed historical fact.

### `scripts/` — maintenance and data tools

- `data-import/` contains Python scripts for importing school/population data.
- `assets/` contains tools for preparing school-directory and uniform assets.
- `analysis/` contains analysis tools, such as the stage/event audit.
- `npm run uniforms:build` runs `scripts/assets/uniforms.py`; use it only when you intentionally need to rebuild uniform assets. Inspect its inputs/outputs before running it if you are unsure.

Scripts may regenerate data or assets. Treat their outputs as generated results, not as the first place to make a source change.

### `tests/`, `docs/`, and generated folders

- `tests/` contains Vitest tests. Files named `*.test.ts` cover particular engine systems, saves, data, or UI behavior.
- `docs/` describes game design, implemented systems, data sources, known limitations, and the roadmap. `README.md` is the quick-start and project overview.
- `dist/` is generated by `npm run build`; `node_modules/` is installed by `npm ci`. Do not edit either by hand or commit them.

## A safe manual-change routine

1. **Protect your work.** Run `git status --short` and `git diff` before editing, so you know what has already changed. Commit or copy your own work somewhere safe before a risky change. Do not overwrite edits you did not make.
2. **Find the owning layer.** Change the engine for rules, shared types for shared data shapes, world data for reference inputs, and Vue files for display/interaction.
3. **Keep the engine repeatable.** New simulation outcomes must use the existing seeded game state/random flow, not `Math.random()`. The same starting seed and choices should produce the same results. Rendering, switching languages, or looking at a screen should not change simulation outcomes.
4. **Keep both languages in sync.** Most game-facing text is represented as `{ zh, en }`; update both Traditional Chinese and English when changing shared game text. Traditional Chinese is the default interface language.
5. **Protect existing saves.** Save data is versioned. When changing a persisted field or its allowed values, inspect `packages/engine/src/save.ts`, `packages/engine/src/life-schema.ts`, and the save-related tests. Preserve old saves with an explicit migration when needed; never silently reroll identity or past outcomes.
6. **Test what you changed.** Run the closest test while working, then `npm test` and `npm run build` before considering the change done. If a test fails, read the failure and fix the cause rather than deleting the test.
7. **Review the final diff.** Run `git diff --check` and inspect `git diff` to ensure only intended files changed. Keep generated output and local save exports out of commits.

## The important history and data rules

Before changing game architecture or gameplay, read `docs/GAME_DESIGN.md`, `docs/GAME_SYSTEMS.md`, `docs/HISTORICAL_DATA.md`, and `docs/ROADMAP.md`.

- Separate verified facts, derived values, estimates, and fictional game values. Label estimates and fictional balance values; do not invent exact historical statistics.
- Keep the simulation engine separate from the UI.
- Keep seeded behavior and compatibility with existing saved games.
- Ask before introducing paid APIs, scraping restricted websites, or changing how/where the game is hosted.

## If something goes wrong

- **Dependencies are missing:** run `npm ci` from the project root.
- **TypeScript/Vue errors:** run `npm run build` and follow the first relevant error to the file/type it names.
- **A gameplay rule changed unexpectedly:** inspect the engine module and its matching test; verify that the UI is only sending a valid choice and not implementing the rule itself.
- **A save no longer loads:** do not delete the user's browser data. Check the Zod schema and version migration in `packages/engine/src/save.ts`, and reproduce the issue with a copied/exported save if possible.
- **You need the current scope or known limitations:** start with `docs/IMPLEMENTATION_STATUS.md` and the relevant system document in `docs/`.

For the original quick-start and gameplay overview, see `README.md`.
