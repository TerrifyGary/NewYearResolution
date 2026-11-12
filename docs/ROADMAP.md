## 2026-11-12 最新修正

見 [學生與人生時間段](TIME_BLOCK_AND_STUDENT_WORK.md) 及 [癌症資料覆蓋與限制](CANCER_MODEL.md)。25 歲起真正跨 2／3／3／4／5 年、帳目與風險逐年處理；此規則取代先前只減少年度目標次數的版本。其他癌別與滑鼠完整試玩尚未完成。

## 2026-11-12：碩班職涯、家庭與成年節奏

見 [本輪實作與驗證](GRADUATE_CAREER_AND_ADULT_LIFE.md)：已完成學位分流職缺、研究所自動報考偏好、職場日常輪替、自動留任與維持家庭、兩階段分開確認／子女照顧與扶養、滿值恢復事件與近期來源，以及30歲後2／3／4／5年規劃間隔。帳目與重要事件仍逐年計算；照顧安排是遊戲評估，非法律裁判。退休制度待下一階段。

## 2026-11-11：制服去字、完整來源校名與新款式

見 [制服地圖校名整併與夏季款式](UNIFORM_MAP_DIRECTORY.md)：562筆來源整併為593筆可搜尋身分；高中職校碼仍為506，現有100校／129款插畫。18校採來源站AI示意重繪、10校採第三方文字，均待校方核對；406校實樣仍待補。圖庫移除通用填圖與指定說明句，SVG不再印校名。參考校名未直接加入分發，存檔與RNG維持不變。

## 2026-11-09：畢業播放、收手求職與夏季制服

See [POST_GRADUATION_AND_UNIFORMS.md](POST_GRADUATION_AND_UNIFORMS.md) for the current fixes, compatibility and sourced-artwork coverage. Earlier uniform/playback scope below is historical.

# Current v0.7 addition

See [PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md](PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md) for current playback, uniform assets, inspection, CAP presentation, question banks, identity generation and adoption scope. Earlier sections below are historical.

# Current v0.6 addition

See [CHAPTERS_AND_MEMORIES.md](CHAPTERS_AND_MEMORIES.md) for current implemented behavior, data dates and remaining scope. Earlier sections are historical.

# Current v0.5 addition

See [LIFE_PROGRESSION.md](LIFE_PROGRESSION.md) for implemented progression, admissions scoring, household costs, migration and source boundaries. Earlier sections below retain design history.

# Current v0.4 addition

See [education, independent living and career scope](EDUCATION_AND_INDEPENDENCE.md) for the implemented rules, source boundaries and remaining work. Older sections below retain design history.

# Development Roadmap

v0.2 status (2026-11-05): Phase 0 and an end-to-end simplified Phase 1 slice are runnable. A collapsible family panel, minimal partner/fertility/pregnancy/naming flow and v1 save migration are now implemented. The full phases below remain the target scope; see IMPLEMENTATION_STATUS.md for implemented vs deferred behavior.

## Phase 0 — foundation
Initialize monorepo, bilingual UI, seeded PRNG, save schema, test harness, data provenance format, first narrative screen and annual event flow.

## Phase 1 — playable complete life (simplified)
Birth/family generator, names, age/year loop, core attributes and fatigue, annual decisions, simplified education, work, finances, aging, death, life summary, optional successor continuation. Include tests and playable GitHub Pages build.

The first playable slice must visibly demonstrate the TRPG identity: automatic annual-focus prompt, character parameters, a real seeded D20 skill check, and at least one interactive event within a year before its summary. Include a minimal academic/specialized dual-track admission example with explicit eligibility and a specialized assessment; expanding the school catalog belongs to Phase 2. Any fictional balance values or placeholder content must be labeled. Illness, accident, family-care, newborn-care and optional language-exam events remain required scope, introduced incrementally and reported as unimplemented until tested.

Early death, including disease or accident before player agency, must be a supported terminal state in Phase 1, with deterministic fixtures and life-summary/no-descendant checks. Mortality calibration remains subject to sourced data; do not claim calibrated realism until verified.

## Phase 2 — education depth
Historical admission rules, public/private fees, family education spending, specialist music/sports tracks, clubs, university, graduate degrees, capstones.

## Phase 3 — adult life depth
NPC relationships, marriage and childcare, job applications and bonuses, scooters/accidents, property and cars, healthcare and retirement.

Add itemized annual financial closing, applicable taxes/fees, labor insurance and distinct labor retirement systems; securities accounts and up to three provisional annual allocations from age 20; and NPC-proposed beverage-franchise/cafe/laundry/factory entrepreneurship stories. Follow FINANCE_AND_BUSINESS.md. Phase 1 should establish the ledger and a simplified transparent closing report; full historical rules, investment calibration and business operations remain incremental Phase 3 scope.

## Phase 4 — rich living world
Tiered NPC simulation, historically grounded datasets, long-term butterfly effects, crime/rehabilitation storylines, full inventory and asset inheritance.

## Phase 5 — polish and beta
Dialogue backgrounds, accessibility, localization review, balance tests, historical source audit, save migration, performance optimization, GitHub Pages deployment.

## First Codex task
Build Phase 0 and a vertical slice of Phase 1. Start with a small but end-to-end playable experience. Do not attempt to implement all historical datasets and systems in one pass. Report assumptions and unimplemented features clearly.

## v0.3 status (2026-11-06)
Added persistent school/grade display, music/sports entry at multiple stages, specialty-only preparation, user-defined high-school region filtering, a small sourced school-name catalog, gender/attraction defaults and origin-family housing/debt disclosure. Complete national school/program coverage, historical official admissions/calendar data, calibrated property/household distributions and transactions remain Phase2/3 work.

## Student-life update (2026-11-08)
See [STUDENT_LIFE.md](STUDENT_LIFE.md) for the implemented school/class/seat and employment status, five-subject exam → route → department → placement sequence, acceptance notices, high-two grouping and master graduation checks. This supersedes the older automatic/general-high entry and three-year-master descriptions for subsequent gameplay. School/department fallbacks, class details and admission thresholds remain explicitly fictional.

## Social and wellbeing update
See [SOCIAL_AND_WELLBEING.md](SOCIAL_AND_WELLBEING.md) for the bundled official 115-year school dictionary, stage-specific friends, university recruitment, fictional illness scenarios, sanity/support mechanics, pre-primary preference questions and early-death audit. All psychological/progression numbers remain labeled game values.
