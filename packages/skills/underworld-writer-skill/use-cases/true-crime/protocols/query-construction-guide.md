# query-construction-guide.md

## The common-surname problem

When your subject has a surname like Johnson, Smith, Williams, or Lee, a direct search for "[Name] [crime type]" returns hundreds of irrelevant results. This guide gives you surgical search strategies to find the right person and court records.

---

## Strategy 1: Pair surname with identifying markers

**Never search the bare surname. Always pair it with one of:**

1. **Handle/alias** (preferred)
   - `"Brett Johnson" gollumfun`
   - `"Brett Johnson" GOllumfun`
   - `"gollumfun" shadowcrew`
   - Online handles are nearly unique; they cross-reference correctly

2. **Specific entity name** (next best)
   - `"Brett Johnson" "ShadowCrew"`
   - `"Brett Johnson" shadowcrew.com`
   - Entity names narrow results sharply

3. **Named associate** (when the subject doesn't have a unique handle)
   - `"Brett Johnson" "Seth Sanders" shadowcrew`
   - Associates are less likely to be shared across unrelated defendants

4. **Case-specific detail** (last resort)
   - `"Brett Johnson" "California Death Index" fraud`
   - Operational details are distinctive

**Example searches:**

❌ `Brett Johnson federal prison`  
→ 50,000+ results. Useless.

✅ `"Brett Johnson" gollumfun`  
→ ~200 results. Mostly on-target.

✅ `"gollumfun" shadowcrew indictment`  
→ ~50 results. Highly targeted.

---

## Strategy 2: Site-specific court-record searches

### For PACER (pacer.uscourts.gov)

PACER searches directly within court dockets. This is Tier 1 access; use it first.

**Search operators:**
```
"[subject surname]" "[handle or entity]" indictment OR docket site:pacer.uscourts.gov
```

**But PACER's own search is better:** Log into PACER, use the "Search the dockets" feature:
1. Choose federal district (if known)
2. Search `"[surname]" "[entity]"` in defendant name field
3. Set date range (if known, e.g., 1995–2010)
4. Results are docket-level, not snippet-based

**Challenge:** You often don't know the district. Use this strategy:
- **If state is known,** search only districts in that state (e.g., ShadowCrew defendants were mostly from NJ and CA)
- **If gang/marketplace known,** research which districts typically prosecute (ransomware gangs often charged in Northern District of Illinois, for example)
- **If date range known,** you can cross-reference with journalist profiles ("indicted in 2004 out of Newark grand jury" = District of New Jersey)

### For DOJ press releases

DOJ and FBI publish press releases for high-profile convictions. These are Tier 1 and searchable separately:

```
"[subject]" "[entity]" site:justice.gov
```

Or more specific:
```
"[subject]" "[entity]" sentenced site:fbi.gov
"[subject]" "[entity]" indicted site:justice.gov/usao
```

**Why this works:** DOJ pressrooms always include case details (docket number, court, sentence), making it easy to escalate to PACER with the correct district.

### For court records without PACER

Some courts have their own searchable dockets (state courts, older federal records):
- **State appellate courts:** Search state-specific appellate docket databases
- **Historical PACER:** Some older documents available through RECAP (recapthelaw.org) or Internet Archive

---

## Strategy 3: Handle-first searching (when surname is common)

If the subject is known primarily by a handle, reverse the search:

```
"[handle]" "[subject firstname]" -"[false positive you found]"
```

**Example:**
```
"gollumfun" brett -"blue gollum" -"gollum costume"
```

This is especially useful for:
- Hacker/darknet subjects (handles are often their "real name" online)
- International subjects (handle works across language barriers)
- Gang members (law enforcement often identifies them by street name first)

**Why it works:** The handle is more unique than the surname. Once you establish handle ↔ subject pairing, you can backtrack to court records using the pairing.

---

## Strategy 4: Journalist profile cross-referencing

Journalist profiles often cite court details you can use to find the actual docket:

1. Find a journalist profile (Tier 3 source)
2. Extract the detail: "sentenced May 2007, District of New Jersey"
3. Use that to search PACER: District of New Jersey, defendant "[name]", 2007

**Example workflow:**
- Wired profile states: "Johnson was sentenced in Newark, New Jersey, May 2007"
- Search PACER: District of New Jersey, May 2007, defendant "Johnson"
- Filter results by entity name (ShadowCrew) or case number if available
- Confirm via docket number and then cite the Tier 1 source

---

## Strategy 5: Associate-network searching

For conspiracies and organized groups, search via known associates:

```
"[known associate]" indictment
```

Co-defendants are listed in the same indictment, making it easy to cross-reference:
- If you find Seth Sanders (ShadowCrew co-founder), the indictment also lists Brett Johnson
- If you find Dmitry Golubov (Carder.su operator), you can find connected defendants

**Why this works:** 
- Colleague names are less likely to overlap across unrelated cases
- Court documents list all defendants in a conspiracy
- Once you have the docket number from one defendant, you have it for all

---

## Strategy 6: False-positive screening

Generic searches will return noise. Use these filters:

**Negative keywords** (exclude irrelevant results):
- `-movie -film -book` (filters entertainment references)
- `-"[city name] State Prison" -obituary` (filters unrelated people named Johnson)
- `-forum -reddit` (filters discussion-board chatter)

**Years matter:**
- If the crime happened 2000–2010, add `2000..2010` to your search
- NewsBank and Google News Archive allow year-range limiting

**True positive checklist:**
After finding a result, verify:
- [ ] Surname matches
- [ ] Handle/alias/entity matches
- [ ] Crime type matches (fraud for ShadowCrew, not an unrelated assault)
- [ ] Time period matches (2000–2010, not modern)
- [ ] If it's a court document, does it have a docket number? (Tier 1 confirmation)

---

## Search patterns by category

### Darknet/ransomware subjects

```
"[handle]" ransomware OR marketplace OR gang
"[handle]" indictment OR arrested OR seized
```

Darknet handles are nearly unique; search them first. Once you have a real name (often from an indictment), PACER becomes useful.

### State-sponsored/APT groups

```
"[group name]" "[country]" attribution OR sanctions site:fbi.gov OR site:cisa.gov
```

Government cybersecurity agencies publish attribution. Start with their searchable databases, then cross-reference with journalism.

### Crypto fraud / FTX-type cases

```
"[principal]" SEC filing OR indictment
```

SEC documents are Tier 1 and highly specific. Search SEC.gov's EDGAR database if the company was public or had public filings.

### Platform exploitation networks

```
"[platform]" "law enforcement" OR "investigation" site:justice.gov
```

Major platform-exploitation cases often have DOJ press releases. Start there for Tier 1 specifics.

---

## Common mistakes to avoid

1. **Searching bare names across multiple results without verifying district**
   - Fix: Always check the docket number and district before assuming you found the right case

2. **Stopping after one journalist profile**
   - Fix: Use the profile's details to find the Tier 1 source (court docket), then cite Tier 1

3. **Accepting "source 1 and source 2 agree" as corroboration when they cite the same origin**
   - Fix: Trace both sources to their original reporting; if they both cite one press kit, that's 1 source

4. **Mixing up similar names across unrelated cases**
   - Fix: Screenshot and date every source; note the docket number on every court document

5. **Assuming a press-release date is the same as sentencing date**
   - Fix: Press releases often come months after sentencing; verify the actual sentence date in the docket

---

## Escalation when searches fail

If a key fact doesn't surface after 2–3 reformulations:

1. **Document what you searched:** "Tried '[subject]' + [handle], site:pacer.uscourts.gov; no results"
2. **Note as `[GAP — searched, not public]`** rather than `[GAP]` alone
3. **Move on.** Not every detail is public. If the fact is essential, flag it for PACER / BOP direct access; otherwise, disclose it as a gap.

This prevents re-running the same dead end in a future pass and clarifies that you've done due diligence even when the search fails.
