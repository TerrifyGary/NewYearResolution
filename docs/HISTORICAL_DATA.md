# Current v0.7 addition

See [PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md](PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md) for current playback, uniform assets, inspection, CAP presentation, question banks, identity generation and adoption scope. Earlier sections below are historical.

# Current v0.6 addition

See [CHAPTERS_AND_MEMORIES.md](CHAPTERS_AND_MEMORIES.md) for current implemented behavior, data dates and remaining scope. Earlier sections are historical.

# Current v0.5 addition

See [LIFE_PROGRESSION.md](LIFE_PROGRESSION.md) for implemented progression, admissions scoring, household costs, migration and source boundaries. Earlier sections below retain design history.

# Current v0.4 addition

See [education, independent living and career scope](EDUCATION_AND_INDEPENDENCE.md) for the implemented rules, source boundaries and remaining work. Older sections below retain design history.

# Historical Data Policy

Source priority: A = official published records and laws; B = derived from verified official records; C = transparent estimates/calibrated assumptions; D = fictional narrative. Every dataset entry should include year(s), geographic coverage, provenance, source URL or bibliographic reference, update date, and confidence grade.

Historical accuracy areas: Taiwan school admission systems and regions; real schools and programs; tuition, subsidies and student loans; wages and employment; income and wealth distribution; company and role availability; housing/rent/interest; healthcare and NHI (from 1995); marriage and family law (same-sex marriage from 2019-05-24); conscription by birth cohort; transportation and traffic; mortality; pension eligibility.

Distinguish recorded historical data from generated scenarios. For years after the latest available verified data, label projections and scenario assumptions. Do not invent exact statistics or imply gameplay probability equals observed demographic risk. Real-estate transaction coverage is uneven historically; do not present pre-coverage estimates as transactions.

User-confirmed exception for calendar projection: post-2026 exam and school-vacation schedules use a verified, versioned 2026 baseline. Store the baseline academic year, source, exam/route or institution scope, month/day, duration and cross-year offsets separately from projected occurrences. Mark projected dates as scenario values. The actual 2026 exam/vacation dataset still requires research and ingestion. Historical dates require their own year-specific evidence; lunar holiday conversions remain year-specific. Overseas-travel costs and event frequencies likewise need provenance or explicit gameplay-estimate labels.

Potential official source families to verify during research: Taiwan Ministry of Education and admissions committees, Directorate-General of Budget Accounting and Statistics, Ministry of Labor, National Health Insurance Administration, Ministry of the Interior, government open data portals, Taiwan Stock Exchange, company annual reports. Confirm URLs and applicable-year rules before ingestion.

Specific design assumptions requiring validation: 95%/5% surname split is user-specified gameplay distribution; starting birth-year range 1980–2026 is tentative; example bonus months and salary figures are fictional; detailed school fees vary by year and public/private status; not all majors have a final-year capstone; PhD duration varies.

Fertility source review (2026-11-05): WHO defines infertility with a duration/context criterion and notes female or male reproductive factors; its approximately one-in-six lifetime estimate must not be used as an annual failure probability or a Taiwan-specific parent-generation rate. Source: https://www.who.int/news-room/fact-sheets/detail/infertility . v0.2 uses explicitly fictional Grade D settings (12% reduced-fertility profile per person; 65% attempt success without a reduced profile, 15% if either partner has one). These values are not calibrated or derived from WHO. A failed attempt is not a diagnosis. Birth timing, assessment fees and family-event ages are also fictional prototype assumptions; legal registration and clinical treatment are not represented.

Calendar references checked for the interaction preview on 2026-11-05: DGPA's revised 2025 calendar (https://www.dgpa.gov.tw/information?pid=12572&uid=55) places Lunar New Year's Day on 2025-01-29, Qingming on 2025-04-04 and Mid-Autumn on 2025-10-06. These festival dates are distinct from leave entitlement. School-calendar rules (https://edu.law.moe.gov.tw/LawContent.aspx?id=FL008424) and relevant institution/year announcements must determine actual vacation boundaries. Preview illness, audition, childcare and NPC stories are fictional; their assigned dates are not official appointments or exam schedules. No production calendar dataset has been ingested yet.

## v0.3 curated school identities (reviewed 2026-11-05)
`packages/world-data/src/schools.ts` stores each real-school name, location, stage, earliest supported year, source URL and review date. The `from` year is a conservative coverage bound, not necessarily a founding year. Historical aliases are retained for 忠明國中 / 忠明高中國中部. Sources include official histories for [板橋國小](https://www.pcps.ntpc.edu.tw/p/404-1000-328.php), [忠明高中](https://cmsh.tc.edu.tw/p/412-1065-16388.php?Lang=zh-tw), [板橋高中](https://www.pcsh.ntpc.edu.tw/p/412-1000-96.php), [高師大附中](https://www.nknush.kh.edu.tw/about-us/history/) and [臺灣大學](https://ntuinfo.ntu.edu.tw/p1_1_0.html); remaining source records are stored alongside the catalog entries.

This is a small identity catalog, not a national dataset or verified admissions catalog. Simulated music/sports options do not assert that a particular school offers that class in that year. June20 admission events, D20 DC15, grade durations, geographic candidate restrictions and general-entry handling are gameplay settings. A missing historical/local school uses 校名待查. No official exam dates, capacity or cutoffs have been ingested. Four pilot birth districts have equal fictional weights. Housing values/rent, mortgage terms and binary gender/attraction defaults are uncalibrated Grade D game values, not population or real-estate statistics.

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
