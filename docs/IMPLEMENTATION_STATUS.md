# v0.7 playback and keepsake refinements — 2026-11-09

Current contract: [PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md](PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md). Domain state, deterministic engine, explicit schema7 migration, UI, static asset gallery and documentation are updated.

Validation: `npm test` passed **237 tests in13 suites** with exit code0, including eight complete-life checks and deterministic replay. New coverage verifies independent attraction across10,000 seeds, seven distinct question banks, named keepsake inspection without RNG mutation, retained letter authorship, fallback uniform mapping, adoption options/arrival/legal-parent naming, schema6 identity preservation, play/pause timer cancellation and the old CAP result screen. Following provenance/asset configuration and minor display updates, the targeted209 tests were rerun. TypeScript/Vue checking and production build passed; both SVG uniform assets were verified under dist/illustrations/uniforms. The existing approximately269kB gzip bundle advisory remains.

No manual browser playthrough for this update; UI behavior is verified with Vue interactions and fake-timer playback tests. No user save was opened or replaced. Real school uniform patterns are still unverified; the user-approved white-shirt/black-trousers or pleated-skirt fallback is used. Adoption is a simplified game process, not a legal qualification/approval simulation. Existing recorded identities and completed birth histories are not rerolled.

Earlier status sections below describe previous releases.

# v0.6 chapters, geography and memories — 2026-11-09

See [CHAPTERS_AND_MEMORIES.md](CHAPTERS_AND_MEMORIES.md) for the current contract and source boundaries. Implemented deterministic domain logic, schema6 migration, UI controls, data imports and tests for nationwide origins/schools, childhood focus, stage profiles, clubs, revised scores/ranks, memories, housing, relationships, summary-only finances, automation and theme.

Validation: targeted 198 tests pass in 11 suites. A complete 226-test run, including eight complete lives and replay, passed; final release rerun also passed **226 tests in12 suites**, exit code0 (156 seconds). Subsequent provenance wording and display-only changes were production-built. TypeScript/Vue and production build passed, with an existing large-bundle advisory (approximately264kB gzip). Two additional Vue cases verify theme/control availability and history placement/illustrated belongings; 11 chapter cases cover source counts, stage questions, 16-type conflicts, weights, discard persistence, grades/ranks, CAP labels, amortization and mandatory family companionship. The full-life fixture now explicitly supplies an existing-partner event instead of assuming single players can form a household at28.

No manual browser QA was performed for v0.6, and no existing player save was opened/replaced. UI changes are covered by Vue interactions. Known limits: actual school uniform patterns remain unverified; 2026 population was not retrieved and weights use a clearly dated2025 source; cohort rank is a model; all CAP cutoffs and home prices are gameplay values. See the scope document for legal/financial limitations.

Earlier sections below describe previous releases.

# v0.5 progression and family update — 2026-11-09

Current rules: [LIFE_PROGRESSION.md](LIFE_PROGRESSION.md). Implemented domain types, deterministic engine behavior, tests, UI and source documentation for the requested progression update. Format5 / slice-5 / pilot-4 explicitly migrate versions1–4 without rewriting identities, accounts or resolved dice.

Validation: `npm test` passed all **213 tests in 11 suites** with exit code0, including deterministic replay, eight complete lives, v1–v4 migration, no duplicate instrument/vehicle charges, scaled scores, graduate prerequisites, promotions, business cash flows, child costs, parent mortality and 29 Vue interaction/component cases. After the final history lookup optimization and minor display changes, the targeted suites were rerun. TypeScript/Vue checking and production build passed. Whole-life cases have a 40-second allowance because the expanded household ledger/event history exceeds the previous 20-second allowance on some 100-year runs; assertions were retained. Separate targeted cases cover no repeat charges, prerequisite gating, cash conservation and persistence. Build retains the advisory for the large bundled school dictionary (approximately236kB gzip).

Manual UI QA: inspected new-life setup on isolated 127.0.0.1:5174, observed the advanced seed disclosure collapsed by default, expanded it to inspect the generated UUID, reopened setup and confirmed default collapse. Screenshot showed no dialog overflow at the narrow preview viewport. Deeper histories, naming and family controls are covered by Vue interaction tests. Automatic browser approval rejected observing the user's 5173 origin to avoid touching their game; the independent preview was used. No user save was replaced. Manual playthrough of every new adult/family branch was not performed.

Earlier status sections below are historical.

# v0.4 education, independent living and careers — 2026-11-09

See [EDUCATION_AND_INDEPENDENCE.md](EDUCATION_AND_INDEPENDENCE.md) for current behavior, source boundaries and pending work. Domain types, deterministic engine, save migration, UI and automated scenarios are implemented. Schema 4 / slice-4 / pilot-3 migrate formats 1–3.

Production TypeScript/Vue check and build passed. Build emits a bundle-size advisory (approximately 219 kB gzip). Manual browser layout QA was not performed; Vue interaction tests exercise the added controls. Original local preview at 127.0.0.1:5173 returned HTTP 200; no player save was replaced. Final validation: `npm test` passed all 179 tests across nine suites with exit code 0, including eight complete-life invariants, deterministic replay, schema migration, ledger persistence and 24 Vue interactions. Initial runs passed assertions but encountered worker RPC reporting timeouts; yielding the worker event loop between CPU-bound whole-life cases resolved that reporting error without changing assertions or simulation results.

# Social, wellbeing and local school dictionary update

See [SOCIAL_AND_WELLBEING.md](SOCIAL_AND_WELLBEING.md) for the latest implemented behavior and limitations. Earlier status sections below describe prior releases.

Validation: all 149 tests passed across eight suites, including complete-life replay, schema/ledger round trips, source-year filtering, national dictionary counts, personality answers, university recruitment, family-talk outcomes, counseling/no-debt and Vue controls. Production build passed. Long whole-life tests now have a 20-second per-case allowance for the additional event volume; ordinary unit tests retain the normal limit. Manual browser layout QA was not performed for this update.

# Student-life update — 2026-11-08

Implemented the staged flow and identity changes documented in [STUDENT_LIFE.md](STUDENT_LIFE.md). Real vocational/college catalogs and detailed official admission eligibility are still pending; current fallbacks are explicitly simulated. Older status sections below are historical.

Validation: all 129 automated tests passed (including the dated exam → route → department → nursing-college placement, five-dice sum persistence, gender filtering, no rerolls, class/seat status, master reviews and Vue interactions). TypeScript/Vue checking and production build passed. This update has not had manual browser layout QA.

# v0.3 education and household update

Implemented 2026-11-06. School/grade labels now derive from persistent enrollment and September school-year changes. Local compulsory-school assignment, city-filtered high-school options, nationwide catalog university choices and general versus music/sports admission events are playable. Specialty-only focus omits the separate academic assessment. General entry has no fixed CAP cutoff. Specialty tests use fictional D20 rules; failed primary/junior specialty checks retain general compulsory enrollment.

A small sourced real-school identity catalog replaces generic labels where year/location coverage exists. All unverified specialty programs and dates remain marked simulated; no complete official admissions dataset is claimed. Origin-family disclosure adds cash, rent/ownership, estimated home value, mortgage status, other debt and total/net assets. Monthly rent/mortgage ledger logic is simplified and fictional. Gender and attraction defaults appear on the character sheet.

Schema3 explicitly migrates v1/v2 without rerolling historical events or replacing old unknown housing with invented property. Full property transactions, historical price calibration, complete school/program datasets and official calendars remain deferred.

Validation: `npm test` passed all 86 cases (28 engine, 29 education/housing/migration, 18 family, 11 Vue UI). `npm run build` passed TypeScript/Vue checking and production bundling. This update was not manually exercised in a browser; earlier browser QA below applies to v0.2 only.

---

# v0.2 family and child naming update

Implemented 2026-11-05. Parent names and household circumstances now appear in a native collapsible panel above the player. After an optional shared-household event, the panel prioritizes the partner/wife, generated family name and children; original parent records remain accessible. Co-residence and deceased-parent/partner information are preserved. This is not full legal marriage registration.

The former instant-child branch is replaced with persistent fertility profiles, optional assessment of both partners, probabilistic attempts, a next-year due date, birth and a mandatory name-confirmation phase. Three given-name suggestions are stable and consume no world randomness; players can instead supply a valid custom name. Birth links both parents, charges care once, and blocks further progress until the name is confirmed. Existing v1 single-parent children are retained without inventing spouses or changing names.

All fertility frequencies, attempt probabilities, assessment/care fees and gestation dates are fictional uncalibrated Grade D values. Reduced fertility is not equivalent to permanent sterility; failure in one attempt is not a medical diagnosis. Clinical treatment, age-calibrated fertility, adoption, pregnancy loss risks and detailed partner relationships remain future scope.

Save schema 2 / rules slice-2 migrate schema-1 saves explicitly. RNG, identities, historical records, queued events and resolved checks remain unchanged. Fertility fields use a separate deterministic namespace; births/family choices follow new rules on future actions. Suggested or custom names, family links and pregnancies persist in saves.

Validation: 55 tests passed (28 baseline engine, 18 family/migration and 9 Vue interface cases); production build passed. Browser QA resumed an actual old save, expanded the parents panel, and in a separate localhost test origin imported a pending birth, selected a suggestion, entered a custom name, confirmed it and observed the child name in the family panel and journal. The user's 127.0.0.1 game was not replaced by that fixture. No browser console errors appeared in final QA.

---

## Prior v0.1 implementation status (historical)

Built 2026-11-05. Phase 0 and a simplified Phase 1 vertical slice; not completion of the full roadmap.

## Playable contract
Vue/TypeScript UI and a framework-independent seeded engine. Commands return a new serializable state. Phases: story, focus, event, resolved, review and dead. A dated queue schedules monthly bookkeeping and narrative/decision events. The UI never draws simulation randomness. Skill dice are drawn once per valid command and saved results survive reload.

Infant narration cannot accept decisions. Agency age 2–4 is a temporary fictional rule, computed from initial attributes and seeded variation, not a medical claim. A single age-dependent all-cause mortality draw chooses a date/cause if triggered; no overlapping cause rolls or minimum lifespan. Risks are uncalibrated Grade D values. Birthdays are simplified to January 1; infant dates display days/months.

Academic/music assessments at 15/18 are fictional examples. Proficiency gates and D20 difficulty are gameplay values. Music failure/decline preserves general admission. There are no real school catalogs, official exam dates or verified 2026 schedules in this release. Passing records an opportunity, not admission to a real institution. Simplified university costs apply only with a recorded opportunity, from September of the admission year.

Adult service/technology/creative roles, layoff risks and wages are fictional. Friends offer paid practice; music/coffee skills grow only on participation. Household/NPC records have stable IDs, aging, lightweight autonomous income, skill/history progression and simplified older-age mortality. Parent/family generation is uncalibrated. Family-of-origin travel is narration with an affordability check; own-family planning remains pending.

A simplified opt-in child event at 30 supplies the minimum legacy demonstration. Partner, fertility and childcare systems are not complete. Descendant transfer preserves world date, identity, existing finances/skills/history and continues only future events, not a regenerated birth. The deceased's assets remain held pending future legal settlement. No eligible descendant means the run ends.

## Financial approximations
Gross monthly wages are inflows; living/education/care and illustrative employee premiums are outflows. Shortfalls become explicitly logged debt, not a real eligibility-approved loan. Interest and insolvency are not implemented. Childhood expenses reduce guardian funds; household shortages/aid are not deeply simulated. NPC bookkeeping is lighter than player bookkeeping.

Insurance entries use simplified coverage. The pension account illustrates separate employer contributions after 2005, not historical statutory brackets/eligibility or the July 2005 transition. There are no pension payouts yet. Closing accrues a fictional tax estimate for next May and separates it from paid tax; monthly expenses are not charged again. Property, vehicles, investments, businesses and official tax rules remain absent and are listed in the UI.

## Persistence
IndexedDB autosave and JSON import/export; browser/origin local, one slot. Version-1 saves require `slice-1` rules and `pilot-1` data. Validation rejects incompatible formats, impossible dates, missing family references, pre-agency decisions, duplicate postings and inconsistent dice. No prior runnable schema exists to migrate. Future rule changes must implement migrations rather than silently reinterpreting state.

## Validation
`npm test`: engine/Vue suites cover replay, no pre-agency choices, differing agency starts, decision pauses, dual admissions, qualification gates, persistent dice, cash/debt conservation, layoff wage cutoff, hobby learning, journal chronology, infant illness/accident endings, natural early-death generation, descendant continuity, complete lives, schema rejection, language switching, import failure and storage failure.

`npm run build`: TypeScript/Vue checking and Vite static build. Verified: 33 tests passed (28 engine and 5 Vue interaction cases); production build passed. Browser QA exercised birth through age 18, automatic infancy, agency transition, narration before choices, IndexedDB reload/resume, a real seeded specialized D20 check, language switching, and 320/390px layouts. A 320px English attribute overflow was found and fixed; story and ledger then fit without horizontal overflow. Browser console showed no errors during final checks. Historical calibration, statistical goodness-of-fit, full legal chronology and Flutter remain unvalidated.

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

Validation for music/resources and single-major clarification: all 108 automated tests passed (including instrument/sport selection, primary/junior/senior specialty checks, affordability, payment ownership, persistence and Vue interactions). TypeScript/Vue checks and production build passed. No manual browser QA was performed for this update.
