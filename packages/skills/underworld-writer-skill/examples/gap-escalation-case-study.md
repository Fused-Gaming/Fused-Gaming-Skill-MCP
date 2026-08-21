# Gap Escalation Case Study: From [GAP] to Publishable

## The Scenario

**Manuscript claim:** "Johnson's first data breach was in 1998, targeting a regional bank in Pennsylvania."

**Initial problem:** The claim appears in your draft, but you have no source for it. You marked it `[GAP]`. Now you need to find the source or decide how to handle the gap in publication.

---

## Phase 1: Recognize the Gap

### Your manuscript reads:

```
In 1998, Johnson executed his first significant data breach. [GAP] His target 
was a regional bank in Pennsylvania, and he succeeded in extracting customer 
records. The breach went undetected for months until routine audits flagged 
the anomaly. [GAP — searched but not found]
```

### Questions to ask:

1. Where did you hear about this 1998 breach?
2. Is it mentioned in Darknet Diaries? Court documents? Journalism?
3. Or did you infer it from timeline gaps?

---

## Phase 2: Search Systematically

### Search Path 1: Interview Sources (Tier 2)

**Action:** Re-listen to Darknet Diaries Ep. 128 "Gollumfun Part 1."

**What to look for:**
- Does Johnson mention his first hack or data breach?
- Does he give a year? Does he name the target?
- Does he say, "I don't remember exactly," or "I'm not sure"?

**Sample result:**

```
Darknet Diaries transcript (Ep. 128, timestamp 14:30):
"My first real breach... I was maybe 23, 24. It wasn't a bank. It was a 
retailer, I think. Pennsylvania, yeah. But that was like... 20-plus years ago 
now. I can't remember the specific store."
```

**Interpretation:**
- Johnson confirms ~1998 timeframe (if he's 22 in 1997, he's 23–24 in 1998).
- ✗ NOT a bank—a retailer.
- ✓ Pennsylvania location confirmed.
- ✗ Specific company name: "I can't remember."

**Classification:** Tier 2 (subject's account) but INCOMPLETE (gaps in his own memory).

---

### Search Path 2: FBI Records (Tier 1)

**Action:** Search PACER for case 03-CR-0322.

**What to look for:**
- FBI Affidavit in Support of Arrest or Prosecution.
- Charge description (does it mention early breaches?).
- Witness statements or victim impact.

**[HYPOTHETICAL EXAMPLE — Not actual source material]**

If such an affidavit existed, it might read:
```
FBI Affidavit (case 03-CR-0322, ¶ 24):
"Johnson's criminal conduct spans approximately 1996 through 2003. While the 
ShadowCrew conspiracy is the primary focus of this investigation, Johnson 
has admitted to engaging in unauthorized computer access and data theft as 
early as 1995. [Specific 1998 incidents are not enumerated in public records; 
victim identities are protected per court order.]"
```

**Interpretation (for this hypothetical):**
- ✓ Confirms early hacking activity (starting ~1995).
- ✓ Suggests 1998 is within his known activity window.
- ✗ No specifics on individual 1998 breaches (likely sealed to protect victims).

**Classification:** Tier 1 (court document) but VAGUE (no specific incidents named).

**⚠️ IMPORTANT:** When using this workflow in your own manuscript, replace these synthetic examples with verified excerpts from actual PACER dockets, interviews, or published reporting. Do not attribute hypothetical scenarios to real people or real federal records.

---

### Search Path 3: Journalistic Coverage (Tier 3)

**Action:** NewsBank, Google News Archive, targeted journalist profiles.

**Journalists who covered ShadowCrew:**
- Joseph Menn
- Brian Krebs
- Elinor Mills

**Sample search query:**
```
"Brett Johnson" "1998" breach OR hack OR "data theft"
```

**[HYPOTHETICAL EXAMPLE — Not actual source material]**

If such a book excerpt existed, it might read:
```
Joseph Menn, "The Darkest Internet" (book, 2011), Chapter 5:
"Before ShadowCrew, Johnson had cut his teeth on smaller operations. In 
1998, he targeted retail and financial-services companies in the Northeast, 
though the full scope of these early breaches remains unclear due to the 
complexity of victim identification."
```

**Interpretation (for this hypothetical):**
- ✓ Menn confirms ~1998 timeframe.
- ✓ Mentions both "retail and financial-services" (resolves the bank vs. retailer question?).
- ✗ "Remains unclear" = author acknowledges a knowledge gap.

**Classification:** Tier 3 (journalism) but CAUTIOUS (author admits uncertainty).

**⚠️ IMPORTANT:** When using this workflow in your own manuscript, replace these synthetic examples with verified excerpts from actual published reporting. Do not attribute hypothetical scenarios to real authors or publications.

---

## Phase 3: Recognize the Fundamental Gap

At this point, you've searched:
- ✓ Tier 2 (Johnson's own account) — Vague but confirming
- ✓ Tier 1 (Federal court records) — Confirming but not specific
- ✓ Tier 3 (Journalism) — Confirming but cautious

**What you learned:**
- 1998 breaches are probable (all sources agree).
- The specific target is unclear (bank? retailer? both?).
- Johnson doesn't remember the exact details.
- Victim records may be sealed or protected.

**The reality:** This is a legitimate gap. Not because you haven't searched, but because:
1. Johnson's own memory is fuzzy (20+ years later).
2. Specific victim identity may be sealed in court.
3. Early hacking isn't fully prosecuted/documented (it's ShadowCrew that drew FBI attention).

---

## Phase 4: Decide How to Handle in Publication

### Option A: Remove the Claim Entirely

**Reasoning:** If you can't source it specifically, don't include it.

**Revised manuscript:**
```
Before ShadowCrew, Johnson had engaged in smaller-scale hacking and data theft 
operations in Pennsylvania. (FBI Affidavit, case 03-CR-0322; Darknet Diaries, 
Ep. 128) The specifics of these early breaches remain unclear.
```

**Pros:** Conservative, safe, factually accurate.  
**Cons:** Less detailed narrative; removes specificity.

---

### Option B: Attribution + Hedging

**Reasoning:** Include what sources confirm, but hedge about what they don't.

**Revised manuscript:**
```
Johnson had executed several data breaches before ShadowCrew. According to 
his account, his first significant breach occurred around 1998, targeting a 
retail or financial-services company in Pennsylvania, though he acknowledges 
his memory of the specifics has faded over the decades. (Darknet Diaries, 
Ep. 128)

The FBI's investigation noted that Johnson had engaged in unauthorized 
computer access as early as 1995, with the full scope of early criminal 
activity remaining unclear due to victim protection orders. (FBI Affidavit, 
case 03-CR-0322)
```

**Pros:** Includes detail; transparent about uncertainty; attributes hedging to subject.  
**Cons:** Slightly verbose; requires careful wording.

---

### Option C: Narrative Reconstruction + Gap Marking

**Reasoning:** Describe what is known, mark what isn't.

**Revised manuscript:**
```
In the late 1990s, Johnson cut his teeth on smaller operations across 
Pennsylvania. According to FBI records, his unauthorized computer access and 
data theft span back to 1995, well before ShadowCrew. (FBI Affidavit, case 
03-CR-0322) Johnson recalled these early breaches vaguely: "It wasn't a bank, 
I think. Pennsylvania, yeah. But I can't remember the specific store." 
(Darknet Diaries, Ep. 128) [GAP — specific 1998 breach details not available 
in public records; victim identity may be sealed.]
```

**Pros:** Honest about the gap; includes Johnson's own uncertainty; still tells a compelling story.  
**Cons:** Requires the gap-notation convention (readers need author's note explaining it).

---

## Phase 5: Author's Note Disclosure

Whichever option you choose, your author's note should address this gap category:

```
## Early Criminal Activity

Johnson's first data breaches occurred in the mid-to-late 1990s, before 
ShadowCrew. Federal court documents confirm this timeframe and his admission 
of unauthorized computer access dating to 1995. However, specific details of 
individual breaches from this period—including exact victims, dates, and 
amounts—are either not recalled by Johnson (due to the passage of time) or 
are sealed in court records to protect victim privacy. Where possible, I have 
used Johnson's own account and FBI documentation; where gaps remain, they are 
marked with [GAP].
```

---

## Phase 6: Final Checklist

Before publication:

- [ ] Have I searched all three tiers (Tier 1/2/3)?
- [ ] Have I used source attribution for what IS available?
- [ ] Have I marked the gap clearly?
- [ ] Have I acknowledged in the author's note why the gap exists?
- [ ] Have I resisted inventing details to fill the gap?
- [ ] Would a reader understand why this claim is incomplete?

---

## Key Lessons from This Case Study

### 1. **Gaps are not failures.** 
You conducted a thorough search and found legitimate reasons (sealed records, time-faded memory, early crime not prosecuted) for the gap. That's honest reporting.

### 2. **Attribution matters more than certainty.** 
By saying "According to Johnson…" and "FBI records confirm," you're giving the reader the tools to evaluate the claim independently.

### 3. **Hedging is acceptable.** 
Using phrases like "he believes," "records suggest," or "unclear" doesn't weaken your narrative—it strengthens credibility.

### 4. **The author's note is your safety valve.** 
You don't need to explain every gap in the manuscript itself; a well-written author's note covers sourcing methodology and known limitations.

### 5. **Specific + sourced beats vague + invented.** 
A story told with gaps marked and sources cited is more believable than a story that fills every gap with plausible-sounding but unsourced detail.

---

## Comparison: Before vs. After

### Before (Original Draft)
```
"In 1998, Johnson executed his first significant data breach. His target 
was a regional bank in Pennsylvania, and he succeeded in extracting customer 
records. The breach went undetected for months until routine audits flagged 
the anomaly."
```
**Problems:** No sources. Specific details (bank, customer records, detection timeline) all unsourced.  
**Risk:** Reads like invention.

### After (Revised for Publication)
```
"In the late 1990s, Johnson engaged in his first significant data breaches. 
According to FBI records, his unauthorized computer access spans back to 1995, 
though details of individual incidents from this early period remain unclear 
due to victim protection orders and the passage of time. (FBI Affidavit, case 
03-CR-0322) Johnson recalled these years vaguely: 'It wasn't a bank, I think. 
Pennsylvania, yeah. But I can't remember the specific store.' (Darknet Diaries, 
Ep. 128) [GAP — specific breach details not available in public records.]"
```
**Improvements:** Cited. Transparent about limitations. Includes subject's own uncertainty. Marks the gap.  
**Credibility:** Higher. Reader trusts you because you're honest.

---

## Bottom Line

A published true-crime narrative with transparent gaps and clear sourcing is far more credible—and legally safer—than a narrative that reads smoothly but hides unsourced details. Use this case study as a template the next time you encounter a compelling claim you cannot fully source.

