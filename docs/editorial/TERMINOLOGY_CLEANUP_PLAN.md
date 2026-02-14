# TERMINOLOGY CLEANUP PLAN: SOMATIC CANTICLES

**Created:** 2026-02-03
**Status:** ACTIVE
**Scope:** All 27 chapters in `/CLEAN/`, all World Bible files, all Editorial files

---

## 1. PROBLEM SUMMARY

Three categories of terminology require cleanup:

| Category | Term | Occurrences | Severity |
|----------|------|-------------|----------|
| Placeholder | `Crystallization Interface protocols` | ~136 across 24 chapters | **CRITICAL** |
| Overlong compound | `Khalorēē Field Architecture` | ~231 across chapters | **WARNING** |
| Style violation | `Quantum Systems` | ~3 occurrences | **NOTE** |
| Name conflict | `Chetana Yantra` vs `Manas Interface` | Chapter 1 vs Definitions | **WARNING** |
| Name conflict | Singh/Rey/Li/Vance vs Luminth/Vireth/Quoril/Seter | Series Bible vs manuscripts | **CRITICAL** |

---

## 2. CANONICAL CHARACTER NAMES

**The following are the canonical names. All other variants must be replaced.**

| Full Name | Nickname | House | Culture | Vessel |
|-----------|----------|-------|---------|--------|
| Dr. Corvan Luminth | Corv | Luminth | Daoist / Dao Harmony Sectors | Yìshí Qìxiè |
| Dr. Sona Vireth | Sona | Vireth | Sufi / Sufi Spiral Territories | Adawat al-Wa'i |
| Dr. Jian Quoril | Jian | Quoril | Vedic / Vedic Khalorēē Collective | Manas Interface |
| Gideon Seter | Gideon | Seter | Kabbalistic / Kabbalistic Tree Networks | Klei Toda'ah |

### Name Replacements

| Find | Replace |
|------|---------|
| Dr. Corvan Singh | Dr. Corvan Luminth |
| Dr. Sona Rey | Dr. Sona Vireth |
| Dr. Jian Li | Dr. Jian Quoril |
| Gideon Vance | Gideon Seter |
| Chetana Yantra | Manas Interface |

**Files requiring name updates:**
- `00_SERIES_BIBLE.md` (if still using old names)
- `03_STYLE_GUIDE/MASTER_STYLE_SHEET.md`
- `03_EDITORIAL/01_DEVELOPMENTAL/ARC_ANALYSIS.md`
- All skill reference files

---

## 3. "CRYSTALLIZATION INTERFACE PROTOCOLS" REPLACEMENT

This placeholder appears in **5 distinct semantic contexts**. Each context requires a different replacement. **This cannot be done as a bulk find-and-replace.**

### Context 1: Personal Field / Aura (~60% of occurrences)

**Pattern:** "the subject's Crystallization Interface protocols field", "their own Crystallization Interface protocols", "deeper levels of Crystallization Interface protocols"

**Replace with:**
- **`Khalorēē field`** — when referring to the deep structural reserve of awareness
- **`awareness field`** — when referring to the general field of consciousness

**Examples:**
- "the subject's Crystallization Interface protocols field" → "the subject's Khalorēē field"
- "deeper levels of their own Crystallization Interface protocols" → "deeper levels of their own awareness field"
- "turning this subject's Crystallization Interface protocols into an extension of the Vine" → "turning this subject's Khalorēē into an extension of the Vine"

**Decision rule:** If the sentence is about deep structure, reserves, or inherited patterns → `Khalorēē field`. If the sentence is about moment-to-moment awareness → `awareness field`.

---

### Context 2: Discipline / Practice (~15%)

**Pattern:** "Crystallization Interface protocols healing traditions", "Crystallization Interface protocols practitioner", "the fundamental nature of Crystallization Interface protocols itself"

**Replace with:**
- **`Somanautics`** — the formal discipline (capitalized, proper noun)
- **`somatics`** — the general practice (lowercase)
- **`somatic`** — as adjective

**Examples:**
- "Crystallization Interface protocols healing traditions" → "somatic healing traditions"
- "Crystallization Interface protocols practitioner" → "Somanautics practitioner" or "somatic practitioner"
- "the fundamental nature of Crystallization Interface protocols itself" → "the fundamental nature of Somanautics itself"

---

### Context 3: Vessel / Tool (~10%)

**Pattern:** "peripheral Crystallization Interface protocols", "Crystallization Interface protocols Vessel"

**Replace with:**
- **The character's specific vessel name** (Manas Interface, Adawat al-Wa'i, Klei Toda'ah, Yìshí Qìxiè)
- **`witness vessel`** — generic term for the class of instruments

**Examples:**
- "her peripheral Crystallization Interface protocols" → "her Adawat's peripheral field" or "her vessel's peripheral awareness"
- "Crystallization Interface protocols Vessel" → "witness vessel"

---

### Context 4: Cultural Context Marker (~10%)

**Pattern:** "Sufi Maqam Station - Salik (Seeker) level Crystallization Interface protocols practitioner"

**Replace with culture-specific terms:**
- Vedic: `sadhana` (spiritual practice) or `somatic sadhana`
- Sufi: `muraqaba` (contemplative awareness) or `somatic muraqaba`
- Daoist: `neigong` (internal cultivation) or `somatic neigong`
- Kabbalistic: `kavanah` (directed awareness) or `somatic kavanah`

**Examples:**
- "Salik (Seeker) level Crystallization Interface protocols practitioner" → "Salik-level somatic muraqaba practitioner"

---

### Context 5: Miscellaneous / Filler (~5%)

**Pattern:** "Crystallization Interface protocols mercenary", "as an Crystallization Interface protocols"

**Replace with:**
- "Crystallization Interface protocols mercenary" → "somatic mercenary" or "freelance Somanaut"
- Remove entirely if redundant or grammatically broken (e.g., "as an Crystallization Interface protocols")

---

## 4. "KHALORĒĒ FIELD ARCHITECTURE" SHORTENING

231 occurrences. The compound is legitimate but cumbersome. Shorten contextually:

| Find | Replace |
|------|---------|
| `Vessel of Khalorēē Field Architecture` | The specific vessel name (Manas Interface, etc.) |
| `Khalorēē Field Architecture Collective` | `Khalorēē Collective` |
| `Khalorēē Field Architecture Apparatus` | The specific vessel name |
| `The Great Khalorēē Field Architecture Schism` | `The Great Khalorēē Schism` |
| `Khalorēē Field Architecture` (standalone descriptor) | `Khalorēē architecture` (lowercase 'a') or just `Khalorēē` |

**Rule:** Keep "Khalorēē Field Architecture" only when the full compound is needed for first-introduction clarity. After first use in a chapter, shorten to `Khalorēē` or `Khalorēē architecture`.

---

## 5. "QUANTUM SYSTEMS" REPLACEMENT

3 occurrences. Replace per the Master Style Sheet red-flag rule:

| Find | Replace |
|------|---------|
| `Quantum Systems fallout` | `Field Resonance fallout` |
| `Quantum Systems trauma` | `somatic field trauma` |
| `Quantum Systems void` | `the somatic void` or `the resonance void` |

---

## 6. VESSEL NAME CONVENTIONS

### Canonical Vessel Names (from 02_DEFINITIONS.md)

| Character | Vessel Name | Culture | Short Form (for repeat use) |
|-----------|------------|---------|----------------------------|
| Jian Quoril | **Manas Interface** | Vedic | "the Manas" |
| Sona Vireth | **Adawat al-Wa'i** | Sufi | "the Adawat" |
| Gideon Seter | **Klei Toda'ah** | Kabbalistic | "the Klei" |
| Corvan Luminth | **Yìshí Qìxiè** | Daoist | "the Qìxiè" |

### Introduction Pattern
Each vessel should be introduced ONCE per book with the full form:

> His **Manas Interface**—the Vedic witness vessel—manifested as [description].

Subsequent references in the same chapter use the short form:

> The Manas sharpened, its lattice expanding.

### Romanization
- `Yìshí Qìxiè` retains diacritical marks in the full form
- Short form `the Qìxiè` is acceptable
- In dialogue, characters may say "Qìxiè" without the article

---

## 7. ADDITIONAL STYLE RULES

### Consciousness vs Self-Consciousness
The distinction is well-maintained (Grade A audit). Minor tightening:
- "consciousness vessel" → "witness vessel" (the vessel enables self-consciousness, not mere consciousness)
- When a sentence uses "consciousness" but means "self-consciousness" (the observer function), correct it

### Red Flag Words
Per audit, monitor and replace:
- "energy" → specify: Prana? Field Resonance? Thermal?
- "vibration" → "resonance" or "frequency"
- "quantum" → "field" or "Field Resonance"
- "universe" → "The System" or "The Vine"

---

## 8. EXECUTION ORDER

### Phase 1: Reference Files
1. Update `MASTER_STYLE_SHEET.md` with canonical names + new terminology rules
2. Update `02_DEFINITIONS.md` if needed (resolve Chetana Yantra → Manas Interface)
3. Update `ARC_ANALYSIS.md` character names
4. Update skill reference files (`moral-premise-framework.md`, `chapter-registry.md`, `style-voice-guide.md`)

### Phase 2: Manuscripts (Chapter by Chapter)
For each chapter:
1. Read the chapter
2. Classify each instance of "Crystallization Interface protocols" by context (1-5)
3. Apply the appropriate replacement
4. Shorten "Khalorēē Field Architecture" compounds
5. Replace "Quantum Systems" if present
6. Replace "Chetana Yantra" → "Manas Interface" if present
7. Verify consciousness/self-consciousness precision
8. Scan for red flag word overuse

### Phase 3: Validation
Run VALIDATE mode across the full trilogy to confirm consistency.

---

*"To name a thing is to begin to observe it. To observe it correctly is to begin to author it."*
