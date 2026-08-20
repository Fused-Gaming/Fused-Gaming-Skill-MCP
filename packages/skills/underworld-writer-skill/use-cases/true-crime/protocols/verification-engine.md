# verification-engine.md

## Step 1: Source-tier triage

Rank every claim by tier before deciding whether it's usable in your manuscript. The tier determines how much corroboration it needs and how it should be cited.

### Tier 1 — Primary legal record

**Definition:** Court dockets (PACER), DOJ/FBI press releases, sentencing transcripts, Bureau of Prisons records, indictments, grand jury findings, FTC complaints, SEC filings, official government investigative reports.

**CRITICAL DISTINCTION:** Tier 1 documents range from *allegations* (indictments, complaints) to *adjudicated facts* (conviction records, sentencing orders).
- **Indictments & complaints** = allegations of crime; use with claim-type notation ("charged with", "accused of")
- **Sentencing orders & conviction records** = adjudicated facts; use as direct statements of fact
- **FBI/DOJ attribution statements** = official determinations; treat as factual unless subsequently disputed

**Characteristics:**
- Created by law enforcement, prosecutors, or the judiciary
- Public record (or obtainable through FOIA)
- Has an official docket number and date
- Carries legal weight (admissible in subsequent proceedings)

**Examples:**
- "Brett Johnson was charged with credit-card fraud conspiracy" per the federal indictment filed May 2004 (Tier 1 allegation)
- "Brett Johnson was sentenced to 90 months" per U.S. District Court (D. New Jersey) sentencing order, May 2007 (Tier 1 adjudicated fact)
- "The ShadowCrew conspiracy involved credit-card fraud" per court-approved plea agreement (Tier 1 adjudicated fact)
- "Lazarus Group attributed to North Korea" per FBI/CISA official attribution statement, 2018 (Tier 1 official determination)

**Sourcing use:**
- Tier 1 alone is sufficient for adjudicated facts (sentencing, conviction)
- Tier 1 allegations (indictments) should be attributed as charges/accusations, not facts
- If multiple Tier 1 sources **conflict**, disclose both with document references and note which represent allegations vs. adjudicated facts
- Cite by docket number, case name, court, and date

**What's NOT Tier 1:**
- A journalist's *paraphrase* of a court filing (that's Tier 3)
- A quote from a defendant in a police interview report, even if quoted verbatim (that's Tier 2 — it's the defendant's direct statement, but the report is law-enforcement-created)
- A press release that cites a court filing but doesn't include the actual docket reference (that's Tier 3)

---

### Tier 2 — Direct subject statement with independent corroboration

**Definition:** Long-form interview transcript or recorded statement where the subject speaks in their own words **and** the interviewer has independently corroborated surrounding claims (stated explicitly in the interview, article, or transcript notes).

**Characteristics:**
- Subject is quoted directly or the transcript is available verbatim
- The interviewer/outlet states on-record that they verified surrounding facts ("I read the police reports and it checks out")
- The surrounding corroboration is specific enough to be plausible (not just "we fact-checked it")
- The statement is not subsequently contradicted by Tier 1 sources

**Examples:**
- Darknet Diaries Podcast Episode 128, Part 1 transcript: Jack Rhysider states on-record that he "cross-checked [Johnson's] account against police reports before airing it." Johnson's narrative about his childhood, ShadowCrew founding, and tax-fraud operations is thus Tier 2.
- A 2024 NBC interview with a ransomware gang member where the outlet verifies specific attack dates against public breach notifications

**Sourcing use:**
- Tier 2 is strong but not final; if Tier 1 contradicts it, Tier 1 wins
- Cite with episode/interview title, date, and the specific corroboration statement ("per Jack Rhysider's on-record corroboration in Darknet Diaries Ep. 128")
- If the interviewer's corroboration is vague ("we checked it"), treat the claim as Tier 3 instead

**What's NOT Tier 2:**
- A podcast where the host says "our guest claims X" without verifying X — that's Tier 3 (repeated statement, not corroborated)
- A documentary where B-roll or music suggests corroboration but the interviewer never states it explicitly — that's Tier 3
- A quote from a subject in a journalist's article where the journalist doesn't state they verified the surrounding facts — that's Tier 3, even if it's a long quote

**The Tier 2 / Tier 3 boundary (critical):**

If you're unsure whether an interview is Tier 2 or 3, ask:
1. Does the interviewer/outlet explicitly state they verified surrounding claims?
2. Is the verification specific (e.g., "I checked the court docket" vs. "we fact-checked it")?
3. Does the subject's account align with what the outlet verified, or is there wiggle room?

If you answer "no" to #1 or #2, it's Tier 3.

---

### Tier 3 — Journalistic paraphrase

**Definition:** A news outlet (NYT, Wired, Vice, NBC, etc.) summarizes or paraphrases the subject's claims in the outlet's own words, without the outlet explicitly corroborating surrounding facts.

**Characteristics:**
- The subject's account is relayed through the journalist's voice or summary
- The journalist may have done some fact-checking, but doesn't state it on-record
- The outlet has editorial standards (not a personal blog or corporate press kit)
- Multiple Tier 3 sources from different outlets count as corroboration

**Examples:**
- "Brett Johnson, who founded the underground marketplace ShadowCrew, spent seven and a half years in federal prison" per a Wired profile (journalist's paraphrase, not Johnson's direct quote with on-record corroboration)
- "Ransomware gang LockBit claimed responsibility for the attack" per a Reuters report (journalist's paraphrase of a claim, not the gang's own posted statement)

**Sourcing use:**
- Tier 3 alone is weak; use when you have 3+ independent Tier 3 sources or as backup to Tier 1/2
- If 5+ independent Tier 3 sources (different outlets, different years, different writers) converge on one figure, cite as "per convergent reporting in [outlet 1], [outlet 2], [outlet 3]"
- Cite the outlet, article title, and date

**What's NOT Tier 3:**
- A press release that quotes a company without independent checking (that's Tier 4)
- A blog post or Medium article that cites other blogs (that's Tier 4, even if well-written)
- A documentary voice-over that doesn't name a source (that's Tier 4)

---

### Tier 4 — Marketing, bio copy, and uncorroborated repetition

**Definition:** Press kits, speaker-bureau pages, podcast show-notes, company bios, consulting-firm profiles, and any content that recycles the subject's self-description without independent checking.

**Characteristics:**
- Appears on the subject's own website, speaker bureau, or in promotional material
- Repeats the same phrasing across multiple websites (sign of a copied press kit)
- No outlet byline or independent attribution
- Often a single sourcing origin repeated verbatim many times

**Examples:**
- "Brett Johnson served 7.5 years and is now a cybersecurity consultant" per BrettJohnson.com or a speaker-bureau bio (all repeat the same phrasing; this is one source, not multiple)
- "Sam Bankman-Fried founded FTX to democratize finance" per Sam's own blog (subject's self-description, not independent verification)
- "Lazarus Group is suspected of the Sony hack" repeated across 20 security-blog posts that all cite the same original source (20 sites, one origin)

**Sourcing use:**
- Tier 4 **does not count as corroboration**, even if it appears in 100 places
- Only use Tier 4 to understand how the subject or organization may be described in marketing contexts (useful for character voice, not for fact verification)
- If a fact appears **only** at Tier 4 after thorough Tier 1–3 searching, mark it `[SINGLE-SOURCE]` in your manuscript and either:
  - Attribute it to the marketing source specifically: "According to Johnson's speaker-bureau bio..." (not "according to Johnson's own account" unless Johnson authored it)
  - Demote it to an author's-note disclosure as unverified marketing copy
  - Do not attribute Tier 4 marketing text to the subject unless independent evidence shows the subject wrote or endorsed it

---

## The repetition problem

**This is the most common mistake:** A single press kit, speaker-bureau bio, or subject interview gets copied across 50 websites. A researcher finds the same claim in 50 "sources" and treats it as corroborated. It's not.

**Count independent sourcing lines, not repetition instances:**
- 1 speaker-bureau bio copied to 50 conference sites = 1 source (Tier 4)
- Same claim in Tier 3 outlets from Wired, Vice, and NYT = 3 independent sources (still weak alone, but counts as corroboration when combined)
- A fact stated by the subject in a 2020 interview, a 2024 interview, and a court filing = 3 independent sourcing lines (Tier 2 + Tier 2 + Tier 1)

**Operationally:**
- Track the **origin** of each claim, not the number of sites where you found it
- One person's blog post cited by three other blogs = 1 origin, 4 repetitions
- A 2020 press release + a 2022 profile that quotes the release = 1 origin, 2 repetitions (not 2 origins)
- A 2020 press release + a 2022 profile that independently reports the same fact = 2 origins
- A 2020 press release + a 2022 profile quoting it + a 2024 independent interview = 2 origins (press + interview)

---

## Red flags for tier misclassification

**Watch for these in your research:**

1. **"Multiple sources say"** when all multiple sources cite the same origin (press kit copying)
   - Fix: Trace each source to its original publication, count unique outlets/years/authors

2. **A fact is in court documents, but you're citing a news article's paraphrase**
   - Fix: Go back to Tier 1; cite the actual court document with docket number

3. **An interview transcript exists, but the interviewer never states they verified surrounding claims**
   - Fix: Treat as Tier 3 (journalist's reported statement), not Tier 2

4. **A subject says something different in two different interviews**
   - Fix: This is not a reason to average or guess; cite both with dates ("Johnson stated X in 2020, Y in 2026")

5. **You're using a fact because "it's so widely reported"**
   - Fix: Stop and count independent sourcing lines, not website mentions

---

## Tier classification worksheet

For each claim in your manuscript, fill this in:

```
CLAIM: [the statement you're verifying]

TIER 1 SOURCES:
- [court docket / DOJ release / official document]
- [if multiple Tier 1, list each; if conflicting, note both]

TIER 2 SOURCES:
- [interview transcript, outlet, interviewer's corroboration statement]
- [does the corroboration claim stand up to scrutiny?]

TIER 3 SOURCES:
- [outlet 1, article title, date]
- [outlet 2, article title, date]
- [outlet 3, article title, date]
- [do these independently converge, or are they repeating one press release?]

TIER 4 SOURCES:
- [marketing copy, speaker bio, etc. — track, don't cite for verification]

VERDICT:
- [ ] Tier 1 only (use as-is)
- [ ] Tier 1 + conflicting Tier 2/3 (disclose both)
- [ ] Tier 2 with corroboration (use, cite corroboration)
- [ ] Tier 3 x 5+ converging (use with convergence note)
- [ ] Tier 3 x 3–4 (use cautiously, mark for corroboration search)
- [ ] Tier 3 x 1–2 (mark [SINGLE-SOURCE], seek Tier 1/2 backup)
- [ ] Tier 4 only (mark [SINGLE-SOURCE], don't use for verification)

NEXT STEP:
- If [SINGLE-SOURCE], escalate via query-construction-guide.md
- If conflicts exist, use cross-source-reconciliation.md
- If unresolved after escalation, mark [GAP] per escalation-protocols.md
```

Use this for every significant claim before the manuscript goes to editorial review.
