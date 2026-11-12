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

# Game Systems and Engineering Requirements

## Suggested stack
Vue 3 + TypeScript + Vite, responsive plain CSS, IndexedDB local saves, versioned data packages. Node.js is used for development/build/testing, not a hosted runtime. The engine has no Vue/browser dependencies. Flutter remains a future platform; native-vs-embedded integration is undecided. GitHub Pages first; future backend can be added without rewriting the engine. Monorepo directories: apps/web, packages/engine, packages/world-data, packages/shared, scripts/data-import.

## Key modules
- identity-and-family: names, biological/legal relationships, household composition, guardians, parent careers and mortality.
- annual-simulation: one major player resolution/year, side events, deterministic scheduling and NPC progression.
- attributes-and-skills: core stats, skills, proficiency growth, fatigue, stress, health, rest, injury.
- education: school enrollment, historically valid exams, program eligibility, tuition/fees, grants, admissions, clubs, projects.
- talent: specialist programs, instruments, coaches, auditions, sports results, artistic portfolios.
- relationships: consent-aware dating, marriage law, family, childcare.
- economy-and-career: wages, taxes, employer compensation, job changes, recruitment, graduate study.
- inventory-and-assets: personal possessions, scooters, cars, homes, mortgages, inheritance.
- healthcare-and-risk: NHI effective from 1995, self-pay options based on evidence, accidents and rare-event risk.
- legacy: death summary, successor selection, transfer control without world reset.
- localization: Traditional Chinese and English.

## Engine invariants
v0.2 adds reciprocal partner IDs, generated household names, persistent fertility state, pending pregnancy and a naming phase. Name suggestions and profile initialization use a separate deterministic hash namespace; viewing them never advances world randomness. Naming validates a given name, not a surname, and cannot advance past the pending birth or charge newborn care twice. Version-1 saves explicitly migrate to schema 2 / slice-2 without rewriting past or queued events. Legacy single-parent children remain intact; a spouse is not retroactively invented.

1. No impossible chronology: schools, laws, exams, firms and programs must exist in simulated year.
2. No double counting: tuition net of subsidy and financial contributions; shared household vs personal accounts.
3. Do not use raw D20 to model probabilities below 5%; never make natural 1 equal automatic death.
4. Character identity and relationships persist across generations; death does not erase world history.
5. One annual primary decision does not block automatic side events, leisure or family events.
6. Specialized students retain access to regular admissions where legally eligible; general students can pursue specialist admissions.
7. No universal assumption that foreign firms pay 13 months or that wealthy families always succeed.
8. NPC choices and outcomes are not frozen when not controlled by the player.

## Tests
Financial domain, ledger, insurance/pension, entrepreneurship, investment and closing-report requirements are specified in [FINANCE_AND_BUSINESS.md](FINANCE_AND_BUSINESS.md). Narrative fortune ratings must remain independent from financial computations. The v0.1 engine implements only the simplified subset listed in IMPLEMENTATION_STATUS.md.

Seed reproducibility; legal chronology; school and admissions eligibility; parent-death guardianship; budget conservation; no duplicate tuition charges; scholarship and student-loan calculations; accident rarity calibration; career progression; death/successor continuity; migration of saved-game schema.

Additional planned acceptance checks: historical calendar fixtures use their own source year; post-2026 schedules retain their 2026 baseline provenance and correct target-year weekdays, event ordering and academic-year offsets; lunar holidays are not copied as fixed Gregorian dates. Family travel must meet full-party budget and availability checks, charge the correct payer exactly once across save/load, and neither collide with required exams nor skip unresolved decisions. Before the player forms their own family, family-of-origin trips show only dated narration/journal text with no player-choice prompt, even for adult players. Adult players who have formed their own family may receive planning choices, subject to shared family decisions; exact family-formation eligibility remains to be specified. These checks are not implemented yet.

## Annual event and TRPG implementation contract
- Domain records must represent annual focus, academic and specialized proficiency, exam/application registration, credentials, dated pending events, interactive choices and resolved checks. Persist stable event IDs, event ordering, pending choice, PRNG state and resolution receipts in versioned saves.
- The engine must distinguish awaiting annual focus, advancing within the year, awaiting event choice, year summary and death/legacy states. The UI requests choices; the engine validates eligibility, schedules events and applies consequences independently of the UI framework.
- Advance to the next relevant event and stop when player input is required. Do not simulate beyond an unresolved choice. Historical exam calendars may cross calendar years; preparation, application cycle and academic year must not be conflated.
- Resolve each event once. Saving/loading, viewing a dice animation or switching language must not reroll checks, duplicate costs or skip pending events. Rendering must not consume simulation randomness.
- Resolve meaningful skill checks through D20 plus documented attribute, proficiency and circumstance modifiers against a gameplay difficulty. Keep statistical rare-event draws separate and explicitly identified.
- Reevaluate the remaining schedule and resources after interruptions, job changes, recovery or childcare choices. NPCs and the world advance only through the resolved simulation time.

Required future acceptance tests: the annual-focus prompt appears once per playable year; a scheduled event interrupts year advancement; an unregistered/ineligible exam does not execute; both eligible academic and specialized routes remain available; specialist class type alone does not alter academic results; specialized failure does not erase unrelated applications; historical exams never occur outside their valid rules; optional TOEIC registration produces a persistent result; event choices alter remaining time and budgets; pending events and D20 results survive save/load without rerolls or duplicate charges. These are implementation requirements, not currently passing tests.

## Early-life agency implementation requirements
Infant-care scheduling, parent health/habit profiles, exposure records and care-response transitions must follow [EARLY_LIFE_HEALTH.md](EARLY_LIFE_HEALTH.md). Preserve finer-than-annual care dates, source definitions and persistent condition histories. No numeric risk coefficients are finalized by that specification.

Represent pre-agency automatic narration as an explicit engine state. Persist the character-specific onset and rule version, and reject annual-focus, event-response and sandbox commands before that onset even if submitted without the UI. Guardian/NPC decisions and ordinary world consequences continue. Enable age-appropriate choices only after the onset; exact transition scheduling remains a design decision.

Future acceptance tests must cover differing onset times for documented initial-parameter fixtures, reproducibility, save/load stability, rejection of every in-world choice before onset, continued guardian/world progression, and age-appropriate decisions after onset. These tests are required for implementation and have not yet been implemented.

## v0.3 enrollment, housing and migration
Schema 3 / slice-3 / pilot-2 adds persistent Enrollment records (school ID, stage, track, September start year), music/sports choice, gender/attraction defaults, origin household ID and household Housing records. Education and housing calculations live in framework-independent engine modules. School selection uses a separate stable hash; identity and housing generation do not consume the world RNG. Meaningful specialty checks still consume the seeded simulation stream. Grades derive from date and enrollment rather than age alone. Close NPCs receive lightweight automatic general-school history for succession.

Explicit v1→v2→v3 migration preserves existing identities, RNG and event/ledger history. Only compulsory-school history is reconstructed; higher education is not inferred from age alone. Legacy housing is unknown, not assigned retrospective assets/debt. New rental charges and simplified mortgage interest/principal produce ledger entries. Mortgage terms (2% illustrative annual interest, NTD10,000 scheduled monthly principal) are fictional, not bank products. Origin totals cover living co-residents, not legal ownership or inheritance entitlement. Tests cover region restrictions, grades, specialty/general entry, deterministic migration, housing accounting and UI disclosures.

## Routine minor-illness fee correction (2026-11-08)
Home rest has no consultation charge. Routine outpatient care uses a fictional total out-of-pocket estimate of NTD200 from 1995-03-01 and an uncalibrated NTD600 estimate before NHI; neither is an official historical fee schedule. This event does not model hospitalization, serious injury or elective self-pay services. Under-18 players use their best-funded living listed guardian; otherwise the player account is an explicit fallback. Insufficient funds still use the existing clearly labeled shortfall-debt model. Options and outcomes show the payer and estimate in both languages. Past ledger entries are retained; the correction applies to future resolutions, including pending saved illness choices, with no RNG draw or schema change.

Reference: [NHIA outpatient copayments](https://www.nhi.gov.tw/ch/cp-5163-9803c-2737-1.html), reviewed 2026-11-08, lists the clinic basic copayment as NTD50. Registration and other applicable charges are separate; this does not establish a universal NTD200 total or a historical fee series. Routine care is not inherently cheaper solely because the patient is below high-school age.

## Music major and resources update — 2026-11-08
Music/sports admission checks remain present at primary, junior and senior entry (also higher education). Each specialty admission resolves a D20 check; no automatic promotion into the next specialist stage. Programs/dates/DC remain labeled simulations, not verified school admissions.

Music offers violin, viola, cello, double bass; flute, clarinet, oboe, bassoon, saxophone, trumpet, French horn, euphonium, trombone, tuba; and percussion. Purchased percussion centers on a marimba. A persistent optional `musicTraining` record stores major, ownership of the current major instrument, arrangement and last paid year. Existing schema3 saves without this additive field retain an unselected major and no invented purchases; earlier migrations still work. Changing major resets current-major ownership, without sale proceeds; instrument resale/multiple instrument portfolios are not modeled. Past ledgers and RNG are not rewritten.

From age5, music focus/specialist history can schedule a February15 resources event; a newly accepted music enrollee receives June21 setup if not already scheduled that year. These dates are illustrative. The player selects a major, then: (1) own instrument and private teacher, (2) own instrument and school music-class practice, (3) rent a school instrument with home practice. New purchase estimates vary NTD18,000–120,000 by instrument; annual resources are NTD36,000/6,000/2,400 respectively. Ownership prevents repeat purchase of the same major. All prices, access and learning bonuses are fictional GradeD game values, not quotes, official fees or assertions of real school lending permission. Paid options require the selected payer's available cash, with no automatic loan. Under18 guardians pay; adults pay personally. Deferral is free, retains skills and admissions access. Resources improve practice, not guarantee admission.

Family bands display 低收 / 中低收 / 普通 / 小康 / 富有 as fictional resource tiers, never certified welfare status. Current origin-household living members' (cash minus other debt) per resident determines bands: below NTD20,000 / 80,000 / 250,000 / 1,000,000 / above respectively. Home value and mortgage are separately disclosed, not spendable cash; this simple band is not calibrated income/wealth classification. School aid, full instrument access policies, historical pricing, specific teacher stories and separate proficiency per instrument remain future scope.

### Clarification: one concrete major
Strings/winds/percussion are display groups only. Music students explicitly select a single instrument (e.g. violin or oboe); sports students explicitly select one sport (athletics, swimming, basketball, volleyball, baseball, football, badminton, table tennis, tennis, gymnastics, taekwondo or judo). The current major is shown on the player sheet and persists in saves. Specialty admission options are disabled until that route has a concrete major selected; the admission choice shows its instrument/sport. The annual-focus and admission screens allow selection; no instrument or sport is retroactively assigned to old saves. The optional `sport` field is additive, like musicTraining. General admissions remain available. Shared music/sports proficiency is still used by the pilot D20 model; separate proficiency, event stories and assessment rubrics for each instrument/sport remain future work. Real school availability of each specialty is unverified and labeled simulated.

## Student-life update (2026-11-08)
See [STUDENT_LIFE.md](STUDENT_LIFE.md) for the implemented school/class/seat and employment status, five-subject exam → route → department → placement sequence, acceptance notices, high-two grouping and master graduation checks. This supersedes the older automatic/general-high entry and three-year-master descriptions for subsequent gameplay. School/department fallbacks, class details and admission thresholds remain explicitly fictional.

## Social and wellbeing update
See [SOCIAL_AND_WELLBEING.md](SOCIAL_AND_WELLBEING.md) for the bundled official 115-year school dictionary, stage-specific friends, university recruitment, fictional illness scenarios, sanity/support mechanics, pre-primary preference questions and early-death audit. All psychological/progression numbers remain labeled game values.
