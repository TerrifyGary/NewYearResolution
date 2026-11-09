# Current v0.7 addition

See [PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md](PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md) for current playback, uniform assets, inspection, CAP presentation, question banks, identity generation and adoption scope. Earlier sections below are historical.

# Current v0.6 addition

See [CHAPTERS_AND_MEMORIES.md](CHAPTERS_AND_MEMORIES.md) for current implemented behavior, data dates and remaining scope. Earlier sections are historical.

# Current v0.5 addition

See [LIFE_PROGRESSION.md](LIFE_PROGRESSION.md) for implemented progression, admissions scoring, household costs, migration and source boundaries. Earlier sections below retain design history.

# Current v0.4 addition

See [education, independent living and career scope](EDUCATION_AND_INDEPENDENCE.md) for the implemented rules, source boundaries and remaining work. Older sections below retain design history.

# 新年新希望 / New Year Resolution — Game Design

## Vision
A bilingual (Traditional Chinese and English) Taiwan-based, historically grounded life simulation RPG, playable from birth to death. The player makes one major annual resolution while NPCs and the world continue independently. The player can end at death or choose an eligible living descendant to continue, retaining the world state.

## Presentation
Dialogue-first narrative with contextual backgrounds, character sheet, inventory, D20 animation for appropriate checks, event history, annual choices, and responsive/mobile UI. Include rule-based free-text actions alongside predefined choices; no AI API required for MVP.

Traditional Chinese character-sheet labels: 力量 (STR), 敏捷 (DEX), 體質 (CON), 智力 (INT), 感知 (WIS), 魅力 (CHA). English abbreviations need not be shown in the default Chinese UI; retain stable internal stat identifiers.

Provide a keyboard-accessible, manually scrollable 本年記事 / Year journal containing dated, one-sentence summaries of resolved player events and minor stories about nearby NPCs. Show only events reached in simulation time. Add a single-sentence recap and a fortune-slip-style title selected from 小吉、中吉、大吉、小凶、中凶、大凶. During the year label it as provisional; finalize the annual recap at year end. Fortune labels describe outcomes already experienced, do not change probabilities, and do not judge family structure or the player's moral worth. Exact grading criteria remain to be defined.

Non-resolution events display their calendar date. Schedule student vacation stories against the applicable school calendar; family holiday opportunities such as Lunar New Year, Qingming and Mid-Autumn can occur at all ages. Lunar holidays require year-specific Gregorian conversion. A festival date does not imply every worker has leave, and school holidays do not apply to every institution or historical year identically. Participation depends on household practices, wishes and availability. Verify real exam dates before use; clearly label illustrative dates in previews.

Confirmed calendar policy: historical exam and vacation dates use researched, applicable-year records. For simulated years after 2026, use verified 2026 schedules as the fixed scenario baseline for 學測、統測、會考、分科 and winter/summer vacations, including the relevant institution/route distinctions. Carry baseline month/day and event duration into the target year, recompute displayed weekdays, preserve application/exam ordering and cross-year academic cycles, and label the result as a 2026-based simulated schedule rather than a future official announcement. Missing historical records must be labeled estimates, not silently replaced by 2026 dates. Lunar festivals still use each target year's lunar-calendar conversion, not copied 2026 Gregorian dates.

## Character creation
Choose birth year (tentative MVP range 1980–2026); randomize district/township birthplace and correlated family circumstances. Generate culturally and historically appropriate Taiwanese names. Default surname selection is 95% paternal / 5% maternal as a **game setting, not a verified demographic statistic**, with exceptions for legal parentage, adoption, and applicable historical rules. Biological parents may be separated, divorced, unmarried, or deceased before birth; generate appropriate guardians and household arrangements. Distinguish biological parents, legal parents, guardians, and household members.

## Core simulation
Six D&D-inspired attributes (STR, DEX, CON, INT, WIS, CHA; 1–20), plus separate proficiency skills, health, stress, tiredness (0–100, higher means more fatigue), financial resources, relationships, social support, credentials, and inventory. D20 rolls for meaningful checks with modifiers; rare events (death, serious accidents, medical events) use calibrated finer-resolution probabilities. Seeded PRNG and event log ensure reproducibility. No arbitrary plot armor.

## Early-life agency — confirmed clarification
Before the character reaches their individual player-agency onset, the player cannot select any in-world event response, annual focus or sandbox action. Present dated life narration and journal entries while guardians and other NPCs make context-appropriate decisions; the engine still applies development, costs, illness, risk and family consequences. Out-of-world controls such as reading, continuing, pausing and saving remain available.

The onset varies with the character's initial parameters and a documented deterministic gameplay rule; it is not fixed at age three. This is a gameplay abstraction for beginning player-directed decisions, not a medical claim about when consciousness exists. Relevant inputs, age bounds, coefficients and within-year transition behavior remain unspecified; do not invent a finalized formula or equate the onset with INT alone. Persist the generated onset and the governing rule version so save/load cannot reroll it. Once agency begins, offer age-appropriate choices rather than adult decisions.

## TRPG annual goals and interactive events — confirmed clarification
The game is a single-player TRPG-style life simulation, with a visible character sheet and meaningful D20 checks, not just an annual summary generator. Once the character has reached their individual player-agency onset, at the beginning of every playable year automatically ask: 「今年你想把重心放在哪裡？」 / “What would you like to focus on this year?” Offer age- and circumstance-appropriate goals, including academic study, specialized practice, relationships, career, family care, health, and balanced development where applicable.

After choosing a focus, advance through dated events within the year. Pause for player choices at relevant events rather than immediately skipping to the next year. Distinguish scheduled events (registration, examinations, auditions, appointments), optional opportunities (such as a TOEIC sitting), and contingent events (illness, accidents, family emergencies). These do not all occur every year or for every character. Choices consume time, money and other resources; the annual goal influences preparation but does not predetermine each response.

Examples include becoming ill and choosing care/rest; an accident and its aftermath; a sick parent and whether/how to visit or help; and a newborn prompting choices about employment, childcare, a nanny, or grandparents' assistance. Availability depends on finances, applicable policies, distance, health, consent and willingness of the people involved. A choice can revise the remaining year's plan; quitting work must affect subsequent income rather than only adding narrative text.

Show attributes, separate academic/specialized/language proficiency, health, stress, fatigue, finances, relationships, credentials and inventory. For meaningful D20 checks, show the die result, relevant modifiers, difficulty and outcome. Numerical modifiers and thresholds are gameplay values, not official exam scoring or demographic statistics. Qualifications and prior preparation cannot be bypassed by rolling 20. Finer-resolution medical and mortality draws must not be misrepresented as raw D20 outcomes.

## Dual-track admissions and examination events — confirmed clarification
Specialized admissions (特殊升學) are a required playable pathway. Academic and specialized proficiency develop in parallel from childhood: formal music/art/dance/sports programs and ordinary clubs provide distinct preparation opportunities. There is no automatic academic penalty or guaranteed success based on class type.

Eligible specialist students can prepare for general admissions, and eligible general/vocational students can pursue specialized routes. Parallel preparation is subject to actual eligibility, deadlines, registration restrictions and workload. Failure in a specialized assessment does not automatically invalidate other eligible applications.

The event calendar must support historically applicable 會考, 學測, 分科測驗, 指考, 聯招, 統測 and relevant specialized assessments: 術科考試, auditions, portfolios, interviews and sports selections. These are a catalog of supported event types, not a universal checklist for every student. Generate only events appropriate to the simulated year, education stage, route and registration state. TOEIC and other credentials are optional, historically available opportunities with registration, preparation, fees, results and credential records; they are not universal graduation requirements. Real dates and detailed scoring require verified source records before use.

## Childhood
Infant care before agency onset is automatic and includes age-appropriate feeding, vaccinations, illness recognition and guardian responses. Parent chronic conditions, smoking and drinking are generated from documented demographic distributions and persist over time. See [EARLY_LIFE_HEALTH.md](EARLY_LIFE_HEALTH.md) for the model boundaries, initial statistical sources and unimplemented requirements.

Elementary leisure events 1–2 times yearly; junior/senior high one yearly. Hobbies depend on family money, time, transport, access, and school support. School instruments may be rented/borrowed, purchased used, or purchased new; equipment condition and practice access affect learning, but poverty must not mean an absolute talent lockout. Parents have independent jobs, income, savings, debts, health, work hours, relationships, and mortality. School-related expenses reduce household funds even where public tuition is exempt.

Family travel is arranged by the family's adult decision-makers. Before the player has formed their own family, travel with their family of origin is an automatic, non-choice life event, including when the player is an adult with personal agency. Present it briefly in the narration/ticker and dated journal, not as a destination-selection card. Example (fictional): 「跟家人去澳洲旅遊，看到袋鼠很開心，也去了雪梨歌劇院。」

After the player is an adult and has formed their own family, offer family-trip planning choices in coordination with other adult family decision-makers. Eligibility to arrange a family trip is distinct from player-agency onset and from merely reaching adulthood. The precise family-formation eligibility rule (including partner/household arrangements) remains to be defined; do not assume having children is required. This rule concerns family trips, not a prohibition on future solo/friend travel systems.

For either mode, evaluate whether the household can afford the full traveling party after necessary expenses, debt payments and committed costs; include transport, accommodation, food and other applicable-year costs or labeled estimates. Check family members' willingness, leave, school vacations where applicable, health, travel availability and scheduling conflicts. Affordability does not guarantee an annual trip. Charge the correct payer exactly once and advance time consistently; do not erase exam registrations, skip unresolved decisions or assume unaffordable debt. No player choice or D20 prompt is required for an automatic family-of-origin trip.

## Education
Historically accurate real schools, admission areas, school programs, academic years, and fees. Public/private school differences. Specialized music, orchestra, wind ensemble, arts, and sports programs, distinguished from ordinary school clubs. Dual-track academics and specialized proficiency: students in specialist programs can attempt general exams and regular majors, and general students can attempt specialized admissions where eligible. Exams depend on admission year (historical 聯招/指考/學測/分科測驗 and relevant pathways). Overseas schools and universities are possible with qualifying credentials, funds, aid, and admissions. Re-taking exams is possible.

## Clubs and creative careers
High-school clubs can unlock band, filmmaking, arts, dance, sports, and other storylines. University allows multiple clubs, leadership, and networks, with time/grade tradeoffs. Clubs and formal specialist programs provide different preparation routes; no automatic school-type success modifier. Capstone projects, theses, exhibitions, and competitions only where appropriate to major, with individual/team options, grades, portfolio outcomes, and career effects.

## Adult life
The player sheet has a native collapsible family disclosure above it. Before household formation it lists parents, survival, co-residence and caregiving situation. After formation it prioritizes partner/wife name, the generated family name and children, retaining origin-family records in a secondary disclosure. Newborn naming offers three stable suggestions and custom given-name entry; confirmed names must persist across journals, family links, saves and succession.

v0.2 implements a minimal optional shared-household event from age 28, family-planning events at 30–45 and a maximum of three children as temporary gameplay boundaries. These are not demographic or legal rules. Shared living is distinct from legal marriage registration. Both partners have deterministic persistent fertility profiles, initially unassessed. Assessment can reveal a fertility-difficulty game state; failure to conceive in one attempt is not a clinical diagnosis or a permanent inability to have children. Pregnancy succeeds probabilistically and schedules a birth approximately nine months later, rather than instantly creating a newborn. Clinical care, adoption, fully age-dependent fertility and detailed pregnancy risks remain planned.

Dating and relationships can start in adolescence, with age-appropriate content; orientation is not caused by community participation. LGBTQ social events are optional ways to meet people, not prerequisites. Same-sex marriage is legally available in Taiwan beginning May 24, 2019, subject to applicable rules. Marriage, children, childcare, cohabitation, separation, divorce, guardianship, and NPC family histories. Childcare can affect fatigue, finances, work, and recovery; no automatic permanent health penalty.

## Career and finance
Employment includes a nonzero, conditional risk of involuntary job loss where supported by the role and year: industry cycles, employer health, contract status, tenure and individual circumstances influence layoffs, closures and nonrenewal. Distinguish these from voluntary resignation, unemployment after separation and reemployment. Industry unemployment rates are not directly annual dismissal probabilities; estimates require labels and calibration. Job loss changes remaining-year pay, coverage, benefits, job-search opportunities, stress and household budgets.

Friendship and specialized-skill development continue after university graduation. Adults can meet people with different interests through work, community groups, courses, hobby gatherings and introductions. Participation and practice can develop persistent domain proficiency; merely meeting or befriending someone does not automatically transfer their expertise. Costs, time, access, teaching and fatigue matter. Adult hobbies can support creative work or later entrepreneurship.

Salaries are displayed gross. Before each annual narrative review, present a financial reconciliation covering income, applicable taxes/fees, NHI and labor insurance, retirement records, investment results and asset/debt changes. Labor insurance old-age benefits and labor retirement pensions are separate systems. Include friend-proposed entrepreneurship paths (franchised beverage store, cafe, laundry, small factory), and a user-set age-20 investment unlock with a provisional maximum of three allocations per year across game-defined R1–R4 risk bands. See [FINANCE_AND_BUSINESS.md](FINANCE_AND_BUSINESS.md) for accounting rules, scope, sources and unresolved product/risk details.

Work or graduate school after bachelor's; master's, PhD, academic and professional careers, with historically accurate requirements and variable durations. Real employers and roles, recruitment stages, qualifications, interviews, and D20 checks. Prestige may influence opportunities but not guarantee employment. Annual job changes, promotions, layoffs, salary, bonuses, profit sharing, stock, taxes. Compensation models are employer-specific; foreign firms are NOT universally fixed at 13 months. Scooters from college age with purchase, licensing, operating costs, realistic accidents and injuries; cars and housing with loans, taxes, insurance, upkeep. Parent and child finances, student aid and loans, inheritances.

## Aging and death
Disease and accidental death are valid endings from live birth, including before player agency begins. There is no guaranteed-survival tutorial period or hidden survival reroll. Stop at death, preserve the life/family record, and show a day/month-appropriate summary; without an eligible descendant, end the run. See EARLY_LIFE_HEALTH.md for mortality calibration and terminal-state requirements.

Retirement planning begins around 55, but statutory pension eligibility varies. Full-time, part-time (including service jobs), self-employment, or retirement based on financial sustainability. Aging, healthcare, family care, and mortality. On death: life summary, family timeline, inheritance under applicable law, and option to continue as a living eligible descendant at their actual age with pre-simulated history; if no eligible descendant, end the run.

## NPCs and consequences
Tiered NPC simulation: detailed close relationships, lighter acquaintances, aggregate population. NPCs age, move, work, study, marry, and die independently. Persist causal effects, possessions, relationships, and long-term butterfly effects. School conflicts and possible crime involvement are context-dependent; do not stereotype regions, temples, or academic tracks as inherently criminal. Allow realistic rehabilitation.

## v0.3 confirmed education and household rules
Player school labels use September advancement and lengths 6/3/3/4/3 years (primary through master). Primary assignment is stable within birth district and catalog coverage. Music and sports entry includes specialty checks at primary, junior and senior stages; specialty-only preparation can take only the specialty check. General entry has no fixed CAP threshold. Taipei/New Taipei high-school access is reciprocal; elsewhere candidates stay within the birth city/county. This geographic restriction is a user-defined gameplay rule, not an official legal admission boundary. University candidates use the available nationwide catalog.

School identity sources do not verify simulated specialty classes, eligibility, quotas or examination dates. Unknown historical school records remain explicitly unknown. Character gender and attraction defaults are generated deterministically. Origin-family finance disclosure separates resident cash, housing tenure/value, outstanding mortgage, other debt and net assets; generated financial values remain fictional.

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
