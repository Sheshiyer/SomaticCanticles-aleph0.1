# SOMATIC INTERACTIVE EXPERIENCE DESIGN: THE LIVING BOOK

**Core Concept:** A "Bandersnatch" for the nervous system. The narrative doesn't branch based on conscious choice (A/B), but on unconscious state (Biorhythm/Context). The book "reads" the reader.

## 1. THE BIOMETRIC INTERFACE (The Reader as Input)
The web app uses standard browser APIs to infer somatic state without needing invasive sensors.

### A. The Circadian Engine (Time-of-Day)
*   **Input:** System clock.
*   **Narrative Effect:**
    *   **Day Mode (Sympathetic):** Prose is sharper, more analytical (Jian's voice dominates). The "Gardener" feels more like a scientist.
    *   **Night Mode (Parasympathetic):** Prose is fluid, dreamlike (Sona's voice dominates). The "Gardener" feels more like a ghost.
    *   **The Witching Hour (3 AM - 4 AM):** A hidden "Void Mode" activates. Text fades. The "Severance" chapters glitch.

### B. The Pulse Proxy (Reading Speed)
*   **Input:** Scroll velocity / WPM calculation.
*   **Narrative Effect:**
    *   **High Velocity (Anxiety/Rush):** The narrative responds with "The Wilt." Sentences fragment. The "Chorus" becomes chaotic. The UI starts to tremble.
    *   **Low Velocity (Deep State):** The narrative stabilizes. "Noesis" protocols activate. Hidden paragraphs (deep lore) unfold that fast readers miss.

### C. The Breathfield (Microphone/Motion)
*   **Input:** Microphone (permission required) or Device Gyroscope (breathing creates subtle hand movement).
*   **Narrative Effect:**
    *   **Held Breath:** If the device is perfectly still for >5s, the "Witness" text appears (overlay).
    *   **Exhale:** A "fog" effect on the screen clears with audio input (blowing on the mic).

## 2. NARRATIVE MUTABILITY (The Story that Breathes)
We don't write *different* endings; we write *different textures* of the same truth.

### Variable 1: The "Gardener's" Visage
*   **State:** High Anxiety (Fast Scroll + Day).
*   **Text:** "The Gardener loomed, a jagged shadow against the light." (Threat)
*   **State:** High Resonance (Slow Scroll + Night).
*   **Text:** "The Gardener waited, a silhouette of sorrowful necessity." (Tragedy)

### Variable 2: The "Chorus" Volume
*   **State:** Chaos (Erratic Scroll).
*   **Text:** *[The voices screamed, a thousand jagged shards of noise.]*
*   **State:** Coherence (Smooth Scroll).
*   **Text:** *[The voices harmonized, a single chord of infinite depth.]*

### Variable 3: The "Hidden" Truths (Deep Dive)
*   **Trigger:** Staying on a specific "Mandala" image for >10 seconds.
*   **Effect:** The text rearranges. A "surface" conversation between Jian and Sona reveals a "subtext" layer of their telepathic bond.

## 3. PHYSICAL-DIGITAL BRIDGE (The Totem)
How the physical book anchors the digital hallucination.

### A. The Heat-Sensitive Spine
*   **Concept:** The book's spine uses thermochromic ink.
*   **Action:** When held (warmed), a hidden URL or QR code appears.
*   **Digital Result:** Unlocks "Somatic Mode" in the web app (syncs the book's physical state to the app).

### B. The "Pulse" Page (Chapter 13)
*   **Concept:** A page printed with a specific capacitive ink pattern (or just a unique visual marker).
*   **Action:** Placing the phone *on* this page triggers an AR overlay. The static binary code on the page starts *flowing* on the screen.

### C. The "Breath" Bookmark
*   **Concept:** A transparent bookmark with a moiré pattern.
*   **Action:** Sliding it over specific "scrambled" text in the book decodes it.
*   **Digital Equivalent:** The web app has a "digital bookmark" tool that does the same for on-screen text.

## 4. DATA ARCHITECTURE UPDATES
To support this, `somatic_canticles_trilogy_data.json` needs a new layer.

### Proposed Schema Addition: `somatic_triggers`
```json
{
  "chapter_id": "ch_13",
  "segments": [
    {
      "text_id": "seg_045",
      "base_text": "The Gardener watched them.",
      "variants": {
        "sympathetic": "The Gardener scrutinized them, dissecting their fear.",
        "parasympathetic": "The Gardener witnessed them, holding space for their end."
      },
      "trigger": "circadian_rhythm"
    }
  ]
}
```

## 5. THE "WILD" IDEA: THE GLOBAL CHORUS
*   **Concept:** All readers currently on the web app contribute to a global "coherence" score.
*   **Effect:** If >100 readers are in a "coherent" state (slow scroll) simultaneously, the **GLOBAL TEXT** changes for everyone. The "Chorus" begins to sing in unison. A notification appears: *"The Network is Online."*

## 6. NEXT STEPS
1.  **Update JSON Schema:** Add `somatic_variants` to the data structure.
2.  **Prototype "The Pulse":** Create a simple JS module that tracks scroll speed and swaps a single sentence.
3.  **Design the "Breath" Overlay:** CSS filter that responds to "stillness."

*Let the story read the reader.*
