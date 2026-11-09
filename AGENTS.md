# Codex instructions — 新年新希望 / New Year Resolution

Read docs/GAME_DESIGN.md, docs/GAME_SYSTEMS.md, docs/HISTORICAL_DATA.md, and docs/ROADMAP.md before making architecture or gameplay changes.

Build a bilingual Traditional Chinese/English, historically grounded Taiwan life simulation text RPG. The default UI language is Traditional Chinese. Do not replace historical facts with invented figures. Label estimates and fictional gameplay values. Preserve seeded determinism, save compatibility, and automated tests. Separate the simulation engine from the UI. Ask before introducing paid APIs, scraping restricted sites, or changing the hosting model.

For each feature: implement domain types, deterministic engine logic, tests, UI, and documentation. Keep changes small and runnable. Never claim a feature is complete without testing it.
