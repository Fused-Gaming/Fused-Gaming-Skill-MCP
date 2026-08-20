# true-crime/SKILL.md

**Factual verification workflow** for true-crime narratives grounded in court records, public documents, and journalistic investigation. This mode prioritizes source-tier classification, primary-record cross-checking, and systematic escalation strategies for unresolved claims.

## Core workflow

Use these four steps in order for every claim in your manuscript:

### [1. Source-tier triage](./verification-engine.md)
Classify the claim's evidence quality:
- **Tier 1** — Primary legal record (court dockets, DOJ press releases, sentencing transcripts, BOP records, indictments, FTC filings)
- **Tier 2** — Direct subject statement (long-form interview transcript where subject speaks in their own words, with interviewer independently corroborating surrounding claims)
- **Tier 3** — Journalistic paraphrase (NYT, Wired, Vice, NBC summarizing the subject's claims in the outlet's own words)
- **Tier 4** — Marketing/bio copy (speaker bureau pages, podcast show-notes, consulting-firm bios — recycled self-description, usually not independently checked)

A claim appearing only at Tier 4, however many times it's repeated, stays `[SINGLE-SOURCE]`. Repetition across marketing copy is not corroboration.

### [2. Query construction](./query-construction-guide.md)
For subject-heavy cases, use specialized search patterns:
- Always pair surname with **handle/alias** (e.g., "gollumfun"), **specific entity** (e.g., "ShadowCrew.com"), or **named associate**
- Search court records specifically: `"[name]" "[case-specific term]" indictment OR docket site:justice.gov`
- Discard false positives aggressively; don't pattern-match on partial fits
- Log dead ends as `[GAP — searched, not public]` rather than `[GAP]` alone

### [3. Cross-source reconciliation](./cross-source-reconciliation.md)
When multiple sources give different numbers or accounts:
- **Convergence rule:** If 5+ independently-produced sources converge on one figure, replace the original with convergent figure and cite the convergence
- **Split evidence:** If sources split evenly, keep both with per-outlet attribution ("X per [outlet], Y per [outlet]")
- **Never average or guess** — count independent sourcing lines instead

### [4. Escalation for persistent gaps](./escalation-protocols.md)
For facts that stay unverified after steps 1–3:
1. **PACER direct docket search** — by defendant name + district guess (if the district is known)
2. **BOP inmate locator** — historical only; live locator won't return released inmates
3. **Local news archives** — NewsBank, Google News Archive, specific time windows
4. **Genuine gap disclosure** — if none resolve it, the fact stays `[GAP]` with author's-note-level disclosure

---

## Example workflow

**Claim:** "Brett Johnson served seven and a half years in federal prison."

**Step 1 — Tier triage:**
- Multiple journalist profiles (Tier 3) cite "seven and a half years"
- Johnson's own Darknet Diaries interview (Tier 2) mentions total time served
- DOJ press release (Tier 1) likely contains the sentencing order

**Step 2 — Query construction:**
- Search: `"Brett Johnson" "gollumfun" ShadowCrew sentence site:justice.gov`
- Search: `"Brett Johnson" "gollumfun" indictment Newark PACER`
- Search: "Darknet Diaries" "Gollumfun" transcript

**Step 3 — Cross-source reconciliation:**
- Journalist profiles: "seven and a half years total"
- Darknet Diaries Part 1: "roughly seven years, with escape adding time"
- One profile: "90 months for the original case, extended after escape"
- Result: Use "roughly seven and a half years total, following a sentence reported as 90 months for the core ShadowCrew case"

**Step 4 — Escalation:**
- If the exact sentencing court/date is still missing after these searches, mark as `[GAP — PACER district narrowing needed]`
- Next step: PACER search with "ShadowCrew defendants" + "Newark" to find the correct federal district

---

## What each submodule covers

### [verification-engine.md](./verification-engine.md)
- Detailed tier definitions with examples
- How to distinguish Tier 2 from Tier 3 (the critical boundary)
- Why repetition is not corroboration
- Red flags for overcounting sources

### [query-construction-guide.md](./query-construction-guide.md)
- Common-surname poisoning and how to filter it
- Site-specific search operators for court records, journalism, academic databases
- Handle/alias/entity pairing strategies
- False-positive screening protocols

### [cross-source-reconciliation.md](./cross-source-reconciliation.md)
- The 5+ convergence rule and its rationale
- How to handle 50/50 splits in evidence
- When to use footnotes vs. integrated attribution
- Precedent examples from journalism and academic history

### [escalation-protocols.md](./escalation-protocols.md)
- PACER search strategies and district inference
- BOP inmate locator workflow (and why it fails for released inmates)
- Local news archive search patterns by region and decade
- How to format `[GAP]` vs. `[GAP — searched, not public]` in your manuscript
- Author's-note disclosure templates for remaining gaps

---

## Integration with narrative

This workflow produces **sourcing annotations** that feed directly into:
- Scene-by-scene outlines (which facts are Tier 1, which need reconstruction flags)
- Character portrayals (what dialogue can be quoted vs. summarized)
- Editorial checklists (where `[SINGLE-SOURCE]` items need corroboration)

See [`../../../shared/narrative-architecture.md`](../../../shared/narrative-architecture.md) and [`../../../shared/editorial-checklist.md`](../../../shared/editorial-checklist.md) for how to translate verification results into narrative structure.

---

## When to stop searching

- **Tier 1 fact with 3+ independent Tier 1 sources**: Use it, cite converging Tier 1s
- **Tier 2 fact with 2+ independent Tier 2 sources**: Use it, note as Tier 2
- **Tier 3 fact with 5+ independent Tier 3 sources**: Use it, note convergence
- **Fact appearing only at Tier 4**: Mark as `[SINGLE-SOURCE]`; don't use without Tier 1–3 backup
- **Fact unreachable after PACER, BOP, archive searches**: Mark as `[GAP]` and disclose in author's note

Genuine gaps are not failures. They're opportunities for transparent writing.

---

## Common pitfalls to avoid

1. **Assuming interview transcripts are Tier 2 without corroboration** — The transcript must show the interviewer independently verifying surrounding claims (e.g., "I read the police reports and it checks out")
2. **Treating speaker-bureau bios as Tier 3** — They're Tier 4; they recycle the subject's self-description without independent checking
3. **Counting repetition as corroboration** — Five articles copying the same press kit is one source, not five
4. **Skipping PACER when you have a quote** — If the court record says something different, Tier 1 trumps Tier 2 or 3
5. **Inventing specificity to fill gaps** — If you don't know the prison name, don't guess; mark `[GAP]` and move on
6. **Assuming "not found" means "doesn't exist"** — Document your search attempts; "not found after 3 reformulations" is different from "never searched"

---

## Resources

- **PACER** (Public Access to Court Electronic Records): pacer.uscourts.gov
- **BOP Inmate Locator**: bop.gov/inmateloc (historical archives available through Ancestry, some state corrections)
- **NewsBank**: newsbankarchives.com (local newspaper archives, typically institutional access)
- **Google News Archive**: news.google.com/newspapers (historical newspaper search, free)
- **RECAP** (Free PACER archive): recapthelaw.org

---

**This module is part of `skill-truecrimewriter`.** See the root `SKILL.md` for the full skill overview and integration guide.
