# cross-source-reconciliation.md

## The convergence rule

When multiple independent sources give different numbers or accounts for the same fact, **do not average, guess, or pick the one that sounds most authoritative.** Instead, count independent sourcing lines.

### The 5+ convergence threshold

**If 5+ independently-produced sources converge on one figure:**
- Use that figure in your manuscript
- Cite it as "per convergent reporting in [outlet 1], [outlet 2], [outlet 3], etc."
- You now have Tier 3 corroboration even if no single source is Tier 1

**If sources split evenly (2–2, 3–3, etc.):**
- Keep both figures with per-outlet attribution
- Example: "X per Wired (2020), Y per NBC (2023)"
- Present the reader with both versions; let them see the disagreement

**If only 1–2 sources exist:**
- Mark the claim as `[SINGLE-SOURCE]`
- Note which tier(s) and which outlets
- Either seek Tier 1 backup or disclose the single sourcing in your manuscript

---

## Real-world example: Brett Johnson's sentence length

This is exactly how the convergence rule resolved a factual dispute in the ShadowCrew case.

### The problem

Original manuscript stated: "seven and a half years… total time served across incidents"  
But no single source specified whether this was:
- The original sentence (90 months / 7.5 years)?
- The total time served (including escape-related extensions)?
- A rounded figure?

### The search

**Tier 3 sources found:**
1. Wired profile (2019): "7.5 years"
2. Vice feature (2021): "roughly 7.5 years total"
3. Forbes profile (2022): "seven and a half years in federal prison"
4. Darknet Diaries show notes (2022): "served 7.5 years"
5. Business Insider (2020): "sentenced to roughly 90 months, released after 7.5 years total"

All five converge on **"7.5 years total."**

**Tier 2 source found:**
- Darknet Diaries transcript, Episode 128 (Jack Rhysider with Brett Johnson): Johnson states "roughly seven years, with time added for the escape"

**Tier 1 search:**
- DOJ press release or PACER docket (searched but not directly verified for this example)

### The resolution

**5+ independent Tier 3 sources converge on "7.5 years total."**

✅ **Recommendation:** Use "roughly seven and a half years total" with convergent Tier 3 attribution.

**But there's a secondary detail:** The Business Insider source mentions "sentenced to 90 months" separately from "released after 7.5 years total," suggesting:
- Original sentence: 90 months (7.5 years)
- Total time served: 7.5 years (post-escape extensions may have been concurrent, not additive)

✅ **Better recommendation:** "sentenced to 90 months (7.5 years) in the original 2007 ShadowCrew case, with total time served approximately 7.5 years after escape-related charges."

---

## The "5+ rule" rationale

Why five sources?

- **1 source** = can be error, misquote, or outlier
- **2–3 sources** = could be copying one another or one press kit
- **4 sources** = probably independent, but still small sample
- **5+ sources** = statistical convergence; unlikely to be coincidental copying

**But it depends on independence.** Five articles from five different outlets from different years by different writers, each citing their own reporting = 5 independent lines. Five sites all copying the same press kit = 1 line repeated 5 times.

**Apply the independence test:**
- Different outlets? ✓
- Different years of publication? ✓
- Different reporters/outlets' own interviews or reporting? ✓
- Or are they all paraphrasing the same original source?

If all five are paraphrasing one 2004 DOJ press release, they're not independent; use the DOJ source (Tier 1) directly instead.

---

## Handling conflicting accounts (50/50 splits)

Sometimes sources genuinely disagree and no convergence emerges.

### Example: "Which ransomware group was responsible?"

**Scenario:**
- Ransomware note claims Group A
- Bleeping Computer attributes it to Group B
- Malwarebytes attributes it to Group A
- FBI hasn't published official attribution
- Group C makes a public claim

**Result:** 50/50 split between A and B, with a third party (C) making a claim.

**Resolution:**
Don't pick one. Present the ambiguity:
"Ransomware notes identified the attack as [Group A], though [Bleeping Computer] attributed it to [Group B] based on technical signatures. Neither attribution was independently confirmed by law enforcement at the time of publication."

If one attribution later receives FBI confirmation, update your manuscript and cite the FBI (Tier 1) source.

---

## When sources conflict with Tier 1

**If Tier 1 (court record) contradicts Tier 2/3 (journalism/interviews):**

Tier 1 wins. But disclose both.

### Example

**Court record (Tier 1):** Sentencing transcript states defendant received 60 months.

**News article (Tier 3):** "He was sentenced to seven years in prison."

**Resolution:**
- Cite the court record: "The defendant received a 60-month sentence [docket #], though press reports initially stated seven years."
- If the discrepancy matters to your story (e.g., it shows media inaccuracy), note it
- Use the Tier 1 figure (60 months) as your primary fact

**Why:** The court docket is the official, unchangeable record. News reports can contain errors. Always prefer Tier 1.

---

## Documenting conflicts in your manuscript

Use footnotes or endnotes to explain why a fact has multiple versions:

### Option 1: Footnote in narrative

"Brett Johnson served approximately seven and a half years in federal prison.[1]"

[1] Multiple independent news sources converge on 7.5 years total time served. The original sentence was reported as 90 months (7.5 years) by the Business Insider, though the precise split between the original sentence and escape-related extensions remains unresolved in public records.

### Option 2: Author's note disclosure

In your book's author's note or research note, flag conflicts openly:

"On sentence length: Five independent news sources (Wired, Vice, Forbes, Business Insider, Darknet Diaries) converge on 7.5 years total time served, though one source mentions a 90-month original sentence later extended for escape. The exact breakdown between the two custody periods could not be verified in publicly available records."

### Option 3: Transparent attribution in text

"Johnson spent roughly seven and a half years in federal prison, per multiple accounts, though the precise split between his original sentence and time added for his escape remains unclear in public records."

This is the most honest approach for genuine ambiguities.

---

## Practical workflow for conflict resolution

When you find conflicting claims:

1. **List all sources with their figures:**
   ```
   Claim: Sentence length
   
   Source A (Wired, Tier 3): 7.5 years
   Source B (Business Insider, Tier 3): 90 months original, 7.5 years total
   Source C (Darknet Diaries, Tier 2): "roughly 7 years + escape extensions"
   Source D (Vice, Tier 3): 7.5 years
   Source E (Forbes, Tier 3): 7.5 years
   
   CONVERGENCE: 5 sources agree on 7.5 years total.
   SECONDARY DETAIL: One source mentions 90-month original sentence.
   ```

2. **Count independent sourcing lines:**
   - Are A, B, D, E all paraphrasing one press kit? No; they're different outlets, years, writers.
   - Is Source C (Tier 2) adding new information? Yes; it's a direct interview.
   - **Result:** 5 independent Tier 3 lines + 1 Tier 2 line = 6 independent sourcing lines.

3. **Make the call:**
   - Use the convergent figure (7.5 years) as your primary fact
   - Note the secondary detail (90-month sentence) if it adds meaningful specificity
   - Cite convergence or the strongest single source

4. **Disclose if needed:**
   - If the conflict is central to your narrative, use a footnote or author's note
   - If it's peripheral, use convergent attribution and move on

---

## Red flags for false convergence

**Watch for these:**

1. **All sources cite the same origin** (e.g., all copy the defendant's press bio)
   - Fix: These are 1 source, not 5. Find independent Tier 1/2 verification.

2. **Sources agree on a figure but contradict on details** (e.g., all say "7.5 years" but differ on original vs. total)
   - Fix: Convergence is on the main claim (7.5 years), but disclose the secondary disagreement.

3. **Tier 3 sources agree, but Tier 1 contradicts**
   - Fix: Tier 1 wins. Disclose both.

4. **One source is much more recent than others** (e.g., 4 old sources, 1 new source with different figure)
   - Fix: Check if the subject corrected the record or if new information emerged. Don't assume newer = more accurate.

---

## For persistent disagreements

If sources split even after exhaustive research and convergence never happens:

1. **Can you find Tier 1 (court record)?** If yes, use it and disclose the journalist disagreement.
2. **Can you find an interview with the subject clarifying?** If yes, use that as Tier 2.
3. **If neither resolves it,** present both versions to the reader and explain why they disagree.

Ambiguity acknowledged is better than confident wrongness.
