# Escalation Protocols: When Searches Fail

## The `[GAP — searched, not public]` marker

When a specific, factually important claim cannot be verified despite systematic searching, mark it:

```
[GAP — searched: PACER + NewsBank + Darknet Diaries archives; not publicly available]
```

This tells readers:
1. You ran a defined search protocol
2. You found nothing
3. The absence is documented, not accidental

Do NOT write `[GAP]` alone—that suggests you haven't searched yet.

### Search Protocols by Crime Category

#### Cybercrime & Darknet Markets
**Primary escalation path:**
1. PACER (docket number or defendant name)
2. DOJ press releases (Justice.gov, by year and agency)
3. FBI press releases (fbi.gov/news, by field office)
4. Google News Archive (1990–2020 cutoff)
5. Darknet Diaries archive (darknetdiaries.com/episodes), full transcript search
6. Associated journalistic profiles (TechCrunch, Brian Krebs, Wired)

**Example:** Brett Johnson ShadowCrew
- ✓ PACER: case number 03-CR-0322 (Middle Dist. FL)
- ✓ DOJ press release: "ShadowCrew takedown" 2004
- ✓ FBI press release: October 2004
- ✓ Darknet Diaries Ep. 128–129: Gollumfun Part 1 & 2
- ✗ Searched: NewsBank, Google News Archive (1995–2005), journalist profiles
  - **Gap:** His employment history before ShadowCrew exists in police interviews (PACER) but not public employment records
  - **Record:** `[GAP — searched: public employment records 1995–2002; not available]`

#### Fraud & Financial Crime
**Primary escalation:**
1. SEC enforcement actions (sec.gov/litigation)
2. PACER + SDNY if securities fraud
3. FinCEN / Treasury if money laundering
4. State attorney general filings
5. NewsBank / newspaper archives (business sections)

#### Ransomware & State-Sponsored Hacking
**Primary escalation:**
1. NSA/CISA advisories (cisa.gov/news)
2. DOJ/FBI joint statements
3. PACER (if indictments exist)
4. Microsoft Security blog / antivirus firm reports
5. Recorded Future, CrowdStrike intelligence reports

---

## Direct PACER Search Methodology

1. Go to **pacer.uscourts.gov**
2. Query by:
   - Defendant name (last, first)
   - Case number (if known)
   - Judge name (for specific districts)
3. Retrieve the docket sheet
4. Download:
   - Indictment/complaint
   - Sentencing memo
   - Plea agreement (if guilty plea)
5. Cross-reference prison sentence dates with:
   - BOP inmate locator (bop.gov) — **NOTE:** Historical records only; does not list released prisoners
   - Sentencing order date vs. reported release date

---

## BOP (Bureau of Prisons) Inmate Locator Limitations

The inmate locator shows **currently incarcerated** prisoners only.

**What it can confirm:**
- Current incarceration status (if still in system)
- Facility assignment
- Release date (if scheduled)

**What it cannot do:**
- Show released prisoners (use sentencing order + news reports)
- Verify historical incarceration periods
- Show transfers post-release

**Workaround for historical verification:**
- Use sentencing order + release news + Federal Prison Bureau news releases
- Example: Brett Johnson released Oct. 8, 2007 → verify via:
  - Sentencing order dated 2005 (PACER)
  - News reports from late 2007 announcing his release
  - FCI Loretto facility records if disclosed in interviews

---

## NewsBank & Google News Archive Patterns

### Google News Archive (1800–2020 cutoff)
- **URL:** news.google.com/newspapers
- Search by: keyword + date range + publication
- **Limitation:** Only searchable through Feb 2020; no newer results
- **Use for:** Contemporary news coverage of crimes (indictments, arrests, trials)

### NewsBank (Institutional Access)
- Full-text newspaper search 1980–present
- **Available through:** university libraries, public library systems
- **Search tips:**
  - Start narrow: `"Brett Johnson" ShadowCrew` (phrase search)
  - Expand if few results: `Brett Johnson` (single term)
  - Filter by publication type: newspapers vs. wires
  - Date range: 2004–2005 for ShadowCrew case

---

## Journalist Profile Cross-Referencing

**When a journalist covered the crime, use their profile to find the Tier 1 docket:**

Example: Brian Krebs (KrebsOnSecurity)
1. Find Krebs article on the crime
2. Look for citations to court records, FBI statements, or interviews
3. Follow the chain backward to PACER / DOJ / FBI
4. Use Krebs article as Tier 3 corroboration only

**High-value journalist outlets for cybercrime:**
- KrebsOnSecurity (Brian Krebs)
- Wired (Andy Greenberg, Joseph Menn)
- TechCrunch (security reporters)
- Dark Reading (Daniel Berman)
- Ars Technica (security correspondents)

---

## Associate-Network Searching (Conspiracy Cases)

For crimes with multiple co-conspirators:

1. Identify the primary defendant from Tier 1 (PACER)
2. Find the co-conspirators named in the indictment
3. Search PACER for each co-conspirator
4. Cross-reference roles in the conspiracy
5. Build a network chart: who reported to whom, what each person did

**Example:** ShadowCrew
- Primary: Brett Johnson (indicted 2003)
- Co-conspirators: Albert Gonzalez, Cumberbatch, Mantovani, etc.
- Each has their own PACER docket
- Roles overlap (Albert was also founder of CarderPlanet)
- This network *corroborates* specific roles when Tier 1 docs agree

---

## Red Flags for Dead Searches

**When a search truly is exhausted, look for:**

1. **Name confusion** — Is the alias known by multiple surnames? Try all variants.
   - Example: "Albert Gonzalez" vs. "Alberto Gonzalez" (different people in news)
   
2. **Timeline mismatch** — Is the crime pre-1994 (before PACER's electronic filing system)?
   - Pre-1994 federal cases may require manual archive requests through NARA or district court record rooms
   
3. **Jurisdiction surprise** — Did the case move to a different district?
   - Florida case transferred to NY? Check both districts.
   
4. **Sealed records** — Did the court seal the docket? (Rare but happens.)
   - Look for public docket summary or press release instead
   
5. **State vs. federal** — Is this a state crime? Check state court records.
   - PACER is federal only; state cases use separate systems

---

## Documentation Template for Escalation Attempts

In your author's note or appendix, use this format:

```
### [Claim Name]

**Claim:** [State the specific factual claim]

**Search protocol:** PACER (docket XYZ), DOJ press release, NewsBank 
(2004–2005, term: "ShadowCrew"), Darknet Diaries archive (transcripts)

**Result:** [What was found]

**Classification:** Tier 1 ✓ / Tier 2 ✓ / Tier 3 ✓ / [GAP — searched, not public]

**Reasoning:** [Why you classified it this way; if Tier 2, note corroboration; if gap, note search exhaustion]
```

Example:

```
### Brett Johnson's Prison Sentence

**Claim:** Sentenced to 90 months in federal prison

**Search protocol:** PACER (case 03-CR-0322), DOJ press release (October 2004), 
sentencing order (United States v. Johnson, Middle Dist. FL), 
Darknet Diaries Ep. 128 transcript

**Result:** 
- ✓ PACER sentencing order: 90 months
- ✓ DOJ press release: "90-month sentence"
- ✓ Darknet Diaries (Brett interview): confirms sentence length

**Classification:** Tier 1 ✓

**Reasoning:** Primary legal record (PACER + sentencing order) is Tier 1. 
DOJ press and Darknet interview corroborate.
```

This becomes your proof trail for readers and reviewers.
