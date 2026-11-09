# Social life, wellbeing and school snapshot — 2026-11-08

## Offline school dictionary

The bundled MOE academic-year **115 (2026–2027)** snapshot contains 2,609 primary records and 740 junior-high records, grouped into 367 city/district keys across 22 counties/cities. These are counts of the downloaded regular-school datasets, not a claim to include every attached division or every geographic district. The junior CSV itself contains 104–115; only its 115 rows populate this snapshot. Academic year is read from each CSV row, rather than inferred from an outdated page description.

Sources: [MOE primary directory](https://data.gov.tw/dataset/6087), [MOE junior directory](https://data.gov.tw/dataset/6088); exact download URLs and SHA256 hashes are in `schools-115.json`. Government Open Data License v1 applies (https://data.gov.tw/license). Raw CSVs remain in `packages/world-data/raw`; `python3 scripts/data-import/schools.py` regenerates the grouped JSON **without network access**. Downloads/updates are explicit maintenance, not runtime scraping or APIs.

Dictionary fields retain school code, official name, city, district, address, public/private flag and website. The application bundles this data; gameplay performs no online school lookups. The nationally queryable helper is `districtSchools(city,district,level)`. The current birth generator still has four pilot districts; their current/future school candidates now draw from the larger local official catalog, preserving old curated IDs where aliases exist. This does not implement national demographic birth weights or expand playable birth locations to all districts. Street-address catchments, fees and specialty-program availability are not established by the directory.

A 2026 record is **not** evidence that a school existed historically. Newly imported identities have coverage from 2026; older sourced records remain the historical candidates. Later-year use is a snapshot-based scenario, not a future official announcement. Old chosen school IDs are preserved. A corrected catalog entry moves 忠明高中國中部 out of the 西區 automatic local pool; historical saved assignments are not silently rewritten. 板橋國中 historical coverage is extended to 1968 using its [official history](https://www.pcjh.ntpc.edu.tw/p/405-1000-345%2Cc123.php).

## Friends and university clubs

Each year after agency begins adds two authored, dated friend interactions (February8, October6, illustrative). Different content covers preschool play, primary group work, junior exam-note sharing, senior club practice, campus projects, working-adult interests and retirement companionship. Recurring names are stable authored fictional acquaintances, not a complete independently simulated friendship graph. Free participation, chatting and declining are available. Personality can add gathering, exploration or planning choices. Skills grow through chosen participation, not simply knowing a person. Old queued coffee/music friend events remain supported.

University enrollment now schedules September20 recruitment in the admission year and later study years. Music, sports, film and volunteer clubs offer free introductory participation; up to two memberships persist. The cap, dates and skill effects are fictional pilot rules. Club membership appears on the player sheet. Full club offices, competitions, recurring named club-member NPCs and fees remain future work. A person who never actually enrolled at university does not receive university-only recruitment.

## Diverse illness events

Authored conditions include enterovirus, a cold, acute gastroenteritis and stress overload. Age and current stress select from a fictional scenario pool; hash selection is not observed disease incidence. Young-child scenarios may occur before agency and are automatically handled by caregivers, with no infant decision prompt. On reaching the event the engine applies a small health/stress effect once; care choices provide game recovery effects and the existing routine-outpatient estimate/payer. Severe disease, clinical progression, diagnosis, exact immunity, hospitalization and mortality causation are not represented by this minor-illness event.

Background references: [CDC enterovirus warning signs](https://www.cdc.gov.tw/uploads/files/86808648-aabb-4693-a612-919d39bcd339.pdf) and [CDC viral gastroenteritis](https://www.cdc.gov.tw/Disease/SubIndex/j1rqZjBCeR9vtCRUHefN3g?ccms_cs=1). These support disease context, **not** the prototype's frequencies, health-point effects or recovery guarantees. Illness itself does not add a second mortality roll on top of the all-cause draw.

## 理智 / Sanity

Sanity is a 0–100 fictional wellbeing resource, distinct from stress/fatigue and psychiatric diagnosis. Legacy saves without this field display a compatibility baseline of70; they do not acquire a fabricated health history. Paid work increases stress +3 per paid month (+1 after six employed months), fatigue +2, and reduces sanity −2 (an extra −2 when stress is at least70). These are uncalibrated gameplay effects, not claims about employment or mental health. Health focus restores sanity +5 and reduces stress −4. **Zero sanity does not directly cause death, violence, incapacity or a disease diagnosis.**

An annual November10 check-in offers:

- Free family conversation with a living relative aged at least12: 70% supportive (sanity +8/stress −8), 30% disappointing (sanity −5/stress +5). These are fictional probabilities, not judgments about real families. The branch is drawn once and saved.
- Paid counseling: illustrative NTD1,500, sanity +10/stress −8 as game feedback, not a clinical efficacy claim. The best-funded living guardian pays for under18 players; adults pay personally. The option is disabled without sufficient payer cash; no automatic debt is created.
- Free quiet time: sanity +3/stress −3, including when family support or money is unavailable.

This is a simplified appointment/event model, not clinical service matching, medical advice or a reconstruction of counseling access in historical years.

## Pre-primary personality spectrum

At age five, four short two-choice questions explore solitude/interaction, familiarity/exploration, feeling/analysis and spontaneity/planning. Scores begin neutral50 and each answered axis becomes30 or70. Answers and spectra persist and do not draw simulation RNG. It is inspired by the idea of preference questions, **not a validated MBTI instrument, diagnosis or fixed destiny**. There are no better/worse personality types and no personality gate on education, jobs or relationships.

Energy affects how invitations are narrated and can offer organizing a gathering. Openness can offer exploring a hobby, planning can offer coordinating time/tasks, and reasoning affects family-conversation narration. Older saves without childhood answers remain unassessed rather than retroactively inventing responses. New lives, or saves reaching age five under the new rules, encounter the questions. Broader gradual personality development is still planned.

## Early death audit

The mortality formula was inspected and not changed: uncalibrated annual all-cause draws are0.3% for age0,0.03% for1–14,0.1% for15–49,0.8% for50–69, then an increasing older-age curve. No fixed death at32, minimum lifespan, survival reroll or tutorial protection exists. Early death remains supported as previously requested. The ending displays recorded date/cause; this model is **not statistically calibrated**, and the single run ending at32 does not establish a population outcome. Detailed age/year mortality data remain to be imported. Old deaths/queued outcomes are not resurrected or rerolled. New narrative choices can consume RNG in future actions; old journals/ledgers stay intact.

## Persistence and validation boundaries

Optional additive schema3 fields store sanity, personality answers and clubs. Existing v1/v2 migration and prior schema3 states still load. Queued old generic illness/friend events retain their supported paths. New events and monthly effects apply to future progression. The engine remains independent of Vue. No paid API, hosting change or external messages are introduced. Tests cover the offline dictionary, source-year filtering, stage interactions, per-month effects, both family-talk outcomes, payment/no-debt, four-question persistence, personality-dependent choices, clubs and UI interactions.
