/**
 * Webapp Chapter Content
 * 
 * Maps 27 manuscript chapters → 12 webapp chapters
 * Source: /Volumes/madara/2026/Serpentine-raising/chapters/
 * 
 * Each chapter includes:
 * - Story context (excerpt from manuscript)
 * - Embodied practice
 * - Reflection prompts
 * - Canticle metadata
 */

export interface ChapterContent {
  id: number;
  trilogySource: {
    book: number;
    bookTitle: string;
    chapter: number;
    chapterTitle: string;
  };
  webappTitle: string;
  cycle: 'physical' | 'emotional' | 'intellectual' | 'spiritual';
  
  storyContext: {
    excerpt: string;
    somaticEvent: string;
    characterFocus: string;
    keyInsight: string;
  };
  
  practice: {
    title: string;
    durationMinutes: number;
    preparation: string;
    steps: string[];
    closing: string;
  };
  
  reflection: {
    prompts: string[];
    journalSuggestion: string;
  };
  
  canticle: {
    title: string;
    durationMinutes: number;
    soundscape: string;
    intention: string;
  };
}

// ============================================================
// PHYSICAL CYCLE (Chapters 1-3)
// Source: Book 1, Chapters 1-3
// ============================================================

export const chapter1: ChapterContent = {
  id: 1,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 1,
    chapterTitle: "The Choroid Plexus"
  },
  webappTitle: "The Choroid Plexus",
  cycle: "physical",
  
  storyContext: {
    excerpt: `The datascapes of the choroid plexus were screaming. It wasn't a sound. Sound was a luxury of the physical world, a crude tool for a crude reality. This was a shriek of pure information, a wave of semantic agony that crashed over their self-consciousness interface systems.

Dr. Sona Vireth heard the music in the madness. The information-scream, for her, was a chorus of a billion grieving voices. Her bio-acoustic sensors were dialed past the roaring static, her self-consciousness a sensitive membrane searching for the whisper of authentic signal beneath the reactive consciousness noise.

"It's not just noise," she transmitted. "There's a foundational frequency underneath it all... It's... asynchronous. Fibrillating. That's the baseline resonant frequency of the tissue. It's weeping. The whole system is grieving a profound loss."`,
    somaticEvent: "Witnessing a full-system Khalorēē rejection event in the choroid plexus",
    characterFocus: "Dr. Sona Vireth (Anahata Galaxy - Sufi Spiral Territories)",
    keyInsight: "Beneath every scream of trauma, there is a weeping frequency—the authentic voice calling for witness."
  },
  
  practice: {
    title: "CSF Flow Awareness",
    durationMinutes: 8,
    preparation: "Find a comfortable seated position. Allow your body to settle into gravity.",
    steps: [
      "Close your eyes and bring attention to your breath.",
      "Imagine the space around your brain—your skull as a sanctuary.",
      "Visualize cerebrospinal fluid (CSF) as clear, sacred water flowing around your brain and down your spine.",
      "Notice the rhythm: production at the choroid plexus, circulation, reabsorption.",
      "If you encounter areas of turbulence or resistance, breathe into them.",
      "Allow the fluid to wash away metabolic waste, bringing fresh nutrients.",
      "Rest in this flow for several breaths."
    ],
    closing: "Gently return awareness to your body in space. Notice any shifts in clarity or ease."
  },
  
  reflection: {
    prompts: [
      "What areas of your consciousness feel blocked or turbulent?",
      "Where do you need better flow between mind and body?",
      "What would 'clear fluid' mean in your current life circumstances?",
      "What is the 'weeping frequency' beneath your surface reactions?"
    ],
    journalSuggestion: "Draw or describe your inner waterscape. Where is the flow clear? Where is it turbulent?"
  },
  
  canticle: {
    title: "The Fluid Self",
    durationMinutes: 8,
    soundscape: "Flowing water, gentle cerebrospinal fluid pulses, soft crystal bowls",
    intention: "To establish the foundation of body awareness through the image of clear, flowing fluid."
  }
};

export const chapter2: ChapterContent = {
  id: 2,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 2,
    chapterTitle: "Signal Transduction"
  },
  webappTitle: "Signal Transduction",
  cycle: "physical",
  
  storyContext: {
    excerpt: `Every sensation is a signal. Every signal is information seeking meaning. The synapse is not a gap—it is a translation chamber where the language of chemistry becomes the poetry of experience.

Dr. Jian Quoril mapped the cascade: receptor activation, second messenger release, protein phosphorylation, gene expression. A signal from the outside world becoming a change in the cell's very identity. This is how the body learns. This is how trauma encodes. This is how healing begins.`,
    somaticEvent: "Tracing how external signals become internal meaning",
    characterFocus: "Dr. Jian Quoril (Vedic Collective)",
    keyInsight: "Signals are neutral. Meaning is assigned. The translator has power."
  },
  
  practice: {
    title: "Signal Recognition",
    durationMinutes: 9,
    preparation: "Sit comfortably. Allow your attention to rest on your breath.",
    steps: [
      "Notice the ambient sounds around you. Let them be simply signals.",
      "Shift attention to your body. Notice sensations without naming them.",
      "Recognize: these are signals from your nervous system.",
      "Practice receiving without immediate interpretation.",
      "If you notice tension, recognize it as signal, not story.",
      "Allow the signal to be fully received before meaning-making.",
      "Notice the gap between signal and response."
    ],
    closing: "Rest in the space between sensation and reaction. This is where choice lives."
  },
  
  reflection: {
    prompts: [
      "What signals is your body sending that you've been ignoring?",
      "Where do you assign meaning too quickly?",
      "What would it mean to receive without immediately interpreting?",
      "How quickly do you move from sensation to story?"
    ],
    journalSuggestion: "Practice 'signal-only' awareness for one hour today. Notice without naming."
  },
  
  canticle: {
    title: "Signal Songs",
    durationMinutes: 9,
    soundscape: "Electrical pulses, gentle synaptic pops, soft digital ambience",
    intention: "To attune to the body's signaling system as information, not alarm."
  }
};

export const chapter3: ChapterContent = {
  id: 3,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 3,
    chapterTitle: "The Blood-Brain Barrier"
  },
  webappTitle: "The Blood-Brain Barrier",
  cycle: "physical",
  
  storyContext: {
    excerpt: `The blood-brain barrier is not a wall—it is a membrane of exquisite discrimination. It allows nutrients to pass while blocking toxins. It maintains the sanctity of the inner world against the chaos of the outer.

But what happens when the barrier becomes too permeable? When toxins enter the sanctuary? When the guardians become confused about what is nutrient and what is poison?

Gideon Seter understood this intimately. His entire training was about boundaries—what to let in, what to keep out, when to defend and when to open. The barrier was not about isolation. It was about maintaining conditions for consciousness.`,
    somaticEvent: "Exploring selective permeability and boundary integrity",
    characterFocus: "Gideon Seter (Kabbalistic Networks)",
    keyInsight: "Boundaries create the conditions for consciousness. Discrimination is protection."
  },
  
  practice: {
    title: "Boundary Awareness",
    durationMinutes: 10,
    preparation: "Sit or lie comfortably. Close your eyes.",
    steps: [
      "Feel the boundary of your skin—the interface between you and world.",
      "Notice: What is currently inside your field of awareness?",
      "Scan for any 'toxins'—thoughts, sensations, emotions that don't serve you.",
      "Visualize your blood-brain barrier as intelligent and selective.",
      "Practice letting nutrients in (supportive thoughts, sensations).",
      "Practice filtering out toxins (judgment, overwhelm, intrusion).",
      "Rest in the felt sense of appropriate permeability."
    ],
    closing: "Carry this awareness of boundaries into your interactions today."
  },
  
  reflection: {
    prompts: [
      "Where are your boundaries too permeable?",
      "Where are they too rigid?",
      "What nutrients do you need to let in more?",
      "What toxins do you need to filter out?"
    ],
    journalSuggestion: "Map your personal boundary system. Where do you need more discrimination?"
  },
  
  canticle: {
    title: "The Barrier Gates",
    durationMinutes: 10,
    soundscape: "Heartbeat, breath rhythm, soft membrane-like tones",
    intention: "To establish healthy boundaries as the foundation of embodied consciousness."
  }
};

// ============================================================
// EMOTIONAL CYCLE (Chapters 4-6)
// Source: Book 1, Chapters 5, 6, 8
// ============================================================

export const chapter4: ChapterContent = {
  id: 4,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 5,
    chapterTitle: "The Endocrine Dogma"
  },
  webappTitle: "The Endocrine Dogma",
  cycle: "emotional",
  
  storyContext: {
    excerpt: `Hormones are not just chemicals—they are archetypal messengers. Each endocrine gland is a temple, each secretion a prayer. The endocrine system is the body's mythology written in molecules.

Dr. Sona moved through the endocrine landscape like a pilgrim visiting sacred sites. The pineal gland—melatonin's temple of sleep and vision. The thyroid—iodine's sanctuary of metabolism and voice. The adrenals—cortisol and adrenaline's fortress of survival. Each spoke its own language, sang its own song.

The Endocrine Dogma was this: these chemical prayers could become tyrannical. They could rule without consciousness. They could create states so compelling that the subject believed them to be truth itself.`,
    somaticEvent: "Mapping the hormonal archetypes and their influence on emotion",
    characterFocus: "Dr. Sona Vireth",
    keyInsight: "Emotions are chemical messages, not commands. We can receive them without being ruled by them."
  },
  
  practice: {
    title: "Hormonal Awareness",
    durationMinutes: 11,
    preparation: "Lie down comfortably. Place hands on different endocrine centers.",
    steps: [
      "Place one hand on your heart. Feel its rhythm. This is oxytocin's temple.",
      "Move hands to belly, just above navel. Solar plexus. Adrenal awareness.",
      "Place hands at throat. Thyroid. Voice and metabolism.",
      "Touch center of forehead. Third eye. Pineal intuition.",
      "Rest hands at sides. Feel the whole endocrine chorus.",
      "Notice: What 'chemical prayer' is currently loudest?",
      "Witness without being ruled."
    ],
    closing: "Honor your endocrine system as wise messengers, not tyrants."
  },
  
  reflection: {
    prompts: [
      "Which hormonal 'prayer' dominates your life currently?",
      "How do your emotions feel as chemical messengers?",
      "Where do you confuse emotional state with truth?",
      "What would it mean to witness your hormones without being ruled?"
    ],
    journalSuggestion: "Track your emotional chemistry for one day. Map patterns."
  },
  
  canticle: {
    title: "Chemical Messengers",
    durationMinutes: 11,
    soundscape: "Bells, flowing liquids, resonant vocal harmonics",
    intention: "To harmonize with the endocrine system's emotional wisdom."
  }
};

export const chapter5: ChapterContent = {
  id: 5,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 6,
    chapterTitle: "The Synaptic Crossroads"
  },
  webappTitle: "The Synaptic Crossroads",
  cycle: "emotional",
  
  storyContext: {
    excerpt: `Every synapse is a choice point. The signal arrives. The vesicles wait. Will they release? Will the signal pass? Will this pathway be strengthened or allowed to wither?

The brain is not fixed—it is a garden of forking paths, constantly pruning and growing. Each emotional experience lays down tracks. Each repetition deepens the groove. This is neuroplasticity as destiny—and as liberation.

At the crossroads, the team witnessed the subject at a pivotal moment: would the old pattern fire again, or could a new pathway be carved?`,
    somaticEvent: "Standing at the intersection of old patterns and new choices",
    characterFocus: "Dr. Corvan Luminth",
    keyInsight: "Every moment is a crossroads. Every choice wires the brain. Repetition is transformation."
  },
  
  practice: {
    title: "Crossroads Meditation",
    durationMinutes: 12,
    preparation: "Sit in a position that embodies choice—balanced, alert.",
    steps: [
      "Visualize yourself standing at a crossroads.",
      "Behind you: the path of old patterns. Before you: the path of new response.",
      "Notice the felt sense of each direction in your body.",
      "Old path: familiar, perhaps painful, automatic.",
      "New path: uncertain, perhaps exciting, requires presence.",
      "Feel the moment of choice—the gap between stimulus and response.",
      "Practice choosing the new path, even in imagination."
    ],
    closing: "Each time you choose consciously, you carve a new neural pathway."
  },
  
  reflection: {
    prompts: [
      "What crossroads are you currently standing at?",
      "What old pathway is strongest in your emotional brain?",
      "What new response would you like to wire?",
      "How can you support the new pathway through repetition?"
    ],
    journalSuggestion: "Identify one emotional crossroads today. Choose differently."
  },
  
  canticle: {
    title: "Crossroads",
    durationMinutes: 12,
    soundscape: "Two tones meeting, diverging paths, convergence",
    intention: "To embody the power of choice at the synaptic level."
  }
};

export const chapter6: ChapterContent = {
  id: 6,
  trilogySource: {
    book: 1,
    bookTitle: "Anamnesis Engine",
    chapter: 8,
    chapterTitle: "The Compass Calibration"
  },
  webappTitle: "The Compass Calibration",
  cycle: "emotional",
  
  storyContext: {
    excerpt: `"The compass is not external," Corvan said. "It never was. The compass is the alignment between your witness and your breath. When those two are synchronized, you have a reliable direction. When they're not, even the most sophisticated map won't help you."

The team had learned this through crisis. Every external guide had failed. Every map had proven incomplete. The only reliable navigation system was internal—and it required regular calibration.

Calibration meant returning to basics. Witness. Breath. The simple fact of being present in a body, breathing, observing. From this zero-point, all directions could be calculated.`,
    somaticEvent: "Establishing internal navigation when external guides fail",
    characterFocus: "Full team",
    keyInsight: "The only reliable compass is internal: witness + breath + presence."
  },
  
  practice: {
    title: "Compass Calibration",
    durationMinutes: 13,
    preparation: "Sit comfortably. Close your eyes. Settle into gravity.",
    steps: [
      "Find your breath. Let it be natural, unforced.",
      "Establish witness awareness: you are observing the breath.",
      "Notice the alignment between witness and breath.",
      "This is your zero-point. Your true north.",
      "From here, scan your emotional landscape.",
      "What directions call to you? What repels?",
      "Rest in the clarity of calibrated presence."
    ],
    closing: "Return to this calibration whenever you feel lost."
  },
  
  reflection: {
    prompts: [
      "What is your current emotional direction?",
      "When did you last calibrate your internal compass?",
      "What external guides have you been over-relying on?",
      "What does your internal compass say about your current path?"
    ],
    journalSuggestion: "Write your personal compass calibration protocol."
  },
  
  canticle: {
    title: "Calibration",
    durationMinutes: 13,
    soundscape: "Tuning forks, alignment tones, settling into harmony",
    intention: "To establish the internal compass as the primary navigation system."
  }
};

// ============================================================
// INTELLECTUAL CYCLE (Chapters 7-9)
// Source: Book 2, Chapters 9, 10, 13
// ============================================================

export const chapter7: ChapterContent = {
  id: 7,
  trilogySource: {
    book: 2,
    bookTitle: "The Myocardial Chorus",
    chapter: 9,
    chapterTitle: "The Sigil Smith"
  },
  webappTitle: "The Sigil Smith",
  cycle: "intellectual",
  
  storyContext: {
    excerpt: `Symbols are not arbitrary. They are crystallized meaning, patterns compressed into form. The sigil smith doesn't create—she discovers. She finds the shape that already exists in the pattern, waiting to be seen.

A true sigil bypasses the conscious mind and speaks directly to the pattern-recognition systems below. It is a key that fits a lock in the psyche. It is code that compiles in the subconscious.

The team needed a new symbol. The old patterns were too strong, too reinforced. They needed a sigil that could hold the complexity of what they were attempting: the integration of four distinct consciousness traditions into a unified working protocol.`,
    somaticEvent: "Creating symbols that speak directly to pattern-recognition systems",
    characterFocus: "Dr. Sona Vireth as Sigil Smith",
    keyInsight: "Symbols bypass conscious resistance. The right sigil compiles in the subconscious."
  },
  
  practice: {
    title: "Personal Sigil Creation",
    durationMinutes: 10,
    preparation: "Gather paper and drawing tool. Set intention for your sigil.",
    steps: [
      "Identify what you want to encode: a quality, intention, or transformation.",
      "Write out the word or phrase clearly.",
      "Remove vowels and repeating consonants.",
      "Combine remaining letters into an abstract shape.",
      "Simplify until it feels 'right'—not pretty, but powerful.",
      "Charge the sigil: focus intensely while looking at it.",
      "Release: forget the sigil, let the subconscious work."
    ],
    closing: "Your sigil is now compiled in your psyche, working below conscious awareness."
  },
  
  reflection: {
    prompts: [
      "What pattern in your life needs a new symbol?",
      "What would your personal sigil of transformation look like?",
      "How do symbols bypass your conscious resistance?",
      "What recurring symbols appear in your dreams or attention?"
    ],
    journalSuggestion: "Create a sigil for your current transformation. Carry it with you."
  },
  
  canticle: {
    title: "Sigil Sounds",
    durationMinutes: 10,
    soundscape: "Resonant frequencies, crystalline tones, pattern-forming",
    intention: "To encode transformation at the subconscious level through symbolic resonance."
  }
};

export const chapter8: ChapterContent = {
  id: 8,
  trilogySource: {
    book: 2,
    bookTitle: "The Myocardial Chorus",
    chapter: 10,
    chapterTitle: "The Debug Protocol"
  },
  webappTitle: "The Debug Protocol",
  cycle: "intellectual",
  
  storyContext: {
    excerpt: `"It's not a bug," Jian said. "It's a feature that made sense in a previous version but doesn't serve the current system. We need to trace it back to its origin, understand why it was installed, then decide if it needs refactoring or removal."

The Debug Protocol was systematic: Reproduce the error. Isolate the component. Trace the stack. Identify the origin. Implement fix. Test. Deploy.

But consciousness debugging had an additional layer: the error had to be witnessed without identification. You had to see the bug without becoming the bug. You had to observe the pattern while remaining distinct from it.`,
    somaticEvent: "Systematic debugging of consciousness patterns using technical methodology",
    characterFocus: "Dr. Jian Quoril",
    keyInsight: "Patterns are not identity. They can be debugged from the witness position."
  },
  
  practice: {
    title: "Consciousness Debugging",
    durationMinutes: 11,
    preparation: "Identify one recurring pattern you want to debug.",
    steps: [
      "REPRODUCE: Trigger the pattern intentionally in imagination.",
      "ISOLATE: What specific component fires first?",
      "TRACE: Follow it back—when was this pattern first installed?",
      "ORIGIN: What version of you needed this feature?",
      "WITNESS: Observe the pattern without becoming it.",
      "REFACTOR: How would you rewrite this code?",
      "TEST: Try the new response."
    ],
    closing: "You are the programmer, not the program."
  },
  
  reflection: {
    prompts: [
      "What 'bug' in your consciousness most needs debugging?",
      "When was this pattern originally installed?",
      "What version of you needed this feature?",
      "How would you refactor this pattern?"
    ],
    journalSuggestion: "Write a debug report on one of your patterns. Be technical, not judgmental."
  },
  
  canticle: {
    title: "Debug Mode",
    durationMinutes: 11,
    soundscape: "Digital glitches resolving, code compiling, system optimization",
    intention: "To apply technical precision to consciousness transformation."
  }
};

export const chapter9: ChapterContent = {
  id: 9,
  trilogySource: {
    book: 2,
    bookTitle: "The Myocardial Chorus",
    chapter: 13,
    chapterTitle: "The Myocardial Chorus"
  },
  webappTitle: "The Myocardial Chorus",
  cycle: "intellectual",
  
  storyContext: {
    excerpt: `"Listen," Sona whispered. "Not with your ears. With your heart field."

And there it was. Not a single voice but a chorus—four distinct frequencies harmonizing into something greater. Jian's analytical precision. Gideon's protective resonance. Corvan's narrative flow. Her own emotional attunement. Four distinct witnesses, maintaining their individuation, creating together a resonance that none could achieve alone.

The Myocardial Chorus. Heart resonance. Not the loss of self in group, but the enhancement of self through harmonic relationship. This was the next evolution: from individual self-consciousness to resonant self-consciousness.`,
    somaticEvent: "Four distinct heart fields resonating into emergent chorus",
    characterFocus: "Full team",
    keyInsight: "Resonance enhances individuation. The whole emerges without loss of parts."
  },
  
  practice: {
    title: "Heart Field Resonance",
    durationMinutes: 12,
    preparation: "Sit comfortably. Bring both hands to heart center.",
    steps: [
      "Feel your own heartbeat. Your unique rhythm.",
      "Imagine your heart field extending outward.",
      "Call to mind someone you resonate with.",
      "Feel their heart field meeting yours.",
      "Notice: Do you lose yourself or become more yourself?",
      "Practice maintaining your rhythm while harmonizing.",
      "The chorus requires distinct voices."
    ],
    closing: "True connection amplifies individuality, not dissolves it."
  },
  
  reflection: {
    prompts: [
      "Who do you resonate with most strongly?",
      "In relationships, do you lose yourself or find yourself?",
      "What is your unique frequency in the chorus?",
      "How can you maintain individuation while harmonizing?"
    ],
    journalSuggestion: "Map your heart field resonances. Who amplifies your truth?"
  },
  
  canticle: {
    title: "Heart Resonance",
    durationMinutes: 12,
    soundscape: "Deep drum, choral voices, harmonic convergence",
    intention: "To experience heart-centered resonance that preserves individuality."
  }
};

// ============================================================
// SPIRITUAL CYCLE (Chapters 10-12)
// Source: Book 2 Ch 15, Book 3 Ch 18, 27
// ============================================================

export const chapter10: ChapterContent = {
  id: 10,
  trilogySource: {
    book: 2,
    bookTitle: "The Myocardial Chorus",
    chapter: 15,
    chapterTitle: "The Witness Integration"
  },
  webappTitle: "The Witness Integration",
  cycle: "spiritual",
  
  storyContext: {
    excerpt: `The Witness was not separate from experience. The Witness was the capacity within experience to observe itself. Not a detached observer floating above. Not an identified experiencer drowning in content. But the self-reflexive awareness that could hold both simultaneously.

Corvan finally understood. The goal wasn't to become the Witness instead of the experiencer. It was to integrate them—to be fully in experience while maintaining the capacity to observe. This was the integration: not escape from the field, but consciousness within the field, aware of itself.

The Witness Integration. The stabilization of observer consciousness even in the midst of storm.`,
    somaticEvent: "Stabilizing witness awareness within experience itself",
    characterFocus: "Dr. Corvan Luminth",
    keyInsight: "The Witness is not separate from experience. It is experience aware of itself."
  },
  
  practice: {
    title: "Witness Integration",
    durationMinutes: 13,
    preparation: "Sit comfortably. Allow experience to arise naturally.",
    steps: [
      "Notice what is arising: sensations, thoughts, emotions.",
      "Ask: Who is aware of this?",
      "Not the answer—feel the knowing itself.",
      "Experience and awareness of experience—simultaneous.",
      "Rest as the integrated witness: in the storm, not swept away.",
      "No need to control experience. Just maintain awareness.",
      "This is the Witness Integration."
    ],
    closing: "You are both the wave and the awareness of the wave."
  },
  
  reflection: {
    prompts: [
      "When do you lose witness awareness?",
      "What helps you remember the witness in difficult moments?",
      "What is the difference between witness and experiencer?",
      "How can you be in the storm without being swept away?"
    ],
    journalSuggestion: "Practice dual awareness today: in experience, observing experience."
  },
  
  canticle: {
    title: "The Witness",
    durationMinutes: 13,
    soundscape: "Silent gaps, awareness bell, spacious presence",
    intention: "To stabilize the integrated witness—the observer within experience."
  }
};

export const chapter11: ChapterContent = {
  id: 11,
  trilogySource: {
    book: 3,
    bookTitle: "The Ripening",
    chapter: 18,
    chapterTitle: "The Synthesis Protocol"
  },
  webappTitle: "The Synthesis Protocol",
  cycle: "spiritual",
  
  storyContext: {
    excerpt: `Synthesis was not compromise. It was not taking a little from each tradition and diluting them all. True synthesis was integration at a higher level—where distinct elements maintained their integrity while creating something emergent.

The team stood at the convergence of all they had learned. Vedic systematic precision. Sufi emotional resonance. Kabbalistic protective boundaries. Daoist flow and natural order. Four distinct approaches, each complete, each necessary, each enhanced by the others.

The Synthesis Protocol. Integration without dissolution. Unity without uniformity.`,
    somaticEvent: "Integrating four distinct traditions into emergent synthesis",
    characterFocus: "Full team",
    keyInsight: "Synthesis preserves distinct elements while creating emergent capacity."
  },
  
  practice: {
    title: "Four-Element Synthesis",
    durationMinutes: 14,
    preparation: "Sit in center of space. Four directions represent four elements.",
    steps: [
      "Face North (Earth/Vedic): Precision, system, structure.",
      "Face East (Air/Sufi): Resonance, emotion, heart.",
      "Face South (Fire/Kabbalah): Boundaries, protection, foundation.",
      "Face West (Water/Daoist): Flow, natural order, effortless.",
      "Return to center. Hold all four.",
      "Synthesis: not blending but integrating.",
      "Rest in the center of all traditions."
    ],
    closing: "You are the synthesis of all your lineages."
  },
  
  reflection: {
    prompts: [
      "What four elements make up your personal synthesis?",
      "How do you integrate without diluting?",
      "What emerges when your distinct parts harmonize?",
      "What is your unique synthesis protocol?"
    ],
    journalSuggestion: "Map your four directions. What wisdom lives in each?"
  },
  
  canticle: {
    title: "Synthesis",
    durationMinutes: 14,
    soundscape: "Four tones converging, all cycles combined, emergent harmony",
    intention: "To integrate all four biorhythm cycles into unified spiritual practice."
  }
};

export const chapter12: ChapterContent = {
  id: 12,
  trilogySource: {
    book: 3,
    bookTitle: "The Ripening",
    chapter: 27,
    chapterTitle: "The New Beginning"
  },
  webappTitle: "The New Beginning",
  cycle: "spiritual",
  
  storyContext: {
    excerpt: `This was not an ending. It was not even a transformation of what had been. It was a new architecture entirely—a consciousness system designed from first principles to preserve and enhance self-awareness at every scale.

The team had become architects. Not of buildings, but of reality itself. They had learned to hold the code and the compassion, the system and the soul, the precision and the poetry. They were the synthesis they had sought.

The New Beginning. The first breath of a new cosmos. The architecture of new reality.`,
    somaticEvent: "Becoming architects of new consciousness reality",
    characterFocus: "Full team",
    keyInsight: "Completion is the foundation for new beginning. You become the architect."
  },
  
  practice: {
    title: "Architecture of New Reality",
    durationMinutes: 15,
    preparation: "Sit as architect. You are designing your next cycle.",
    steps: [
      "Review what you've learned through all 11 chapters.",
      "Identify the old architecture: what served, what didn't.",
      "Design the new: what principles will guide?",
      "What practices will you maintain?",
      "What will you release?",
      "Commit to your new architecture.",
      "This is your new beginning."
    ],
    closing: "You are the architect of your consciousness. Build wisely."
  },
  
  reflection: {
    prompts: [
      "What is your new architecture?",
      "What will you carry forward? What will you release?",
      "Who are you becoming?",
      "What is your commitment to your next cycle?"
    ],
    journalSuggestion: "Write your Architecture of New Reality. Seal it with intention."
  },
  
  canticle: {
    title: "New Beginning",
    durationMinutes: 15,
    soundscape: "Full orchestral, emergence, silence, new breath",
    intention: "To complete the journey and inaugurate the new cycle."
  }
};

// ============================================================
// ALL CHAPTERS ARRAY
// ============================================================

export const allChapters: ChapterContent[] = [
  chapter1, chapter2, chapter3,    // Physical
  chapter4, chapter5, chapter6,    // Emotional
  chapter7, chapter8, chapter9,    // Intellectual
  chapter10, chapter11, chapter12, // Spiritual
  
  // Missing Chapters (Placeholder / Easter Egg)
  {
    id: 13,
    trilogySource: { book: 2, bookTitle: "The Myocardial Chorus", chapter: 13, chapterTitle: "The Binary Heartbeat" },
    webappTitle: "The Binary Heartbeat",
    cycle: "intellectual",
    storyContext: { excerpt: "01001001 00100000 01000001 01001101...", somaticEvent: "System Reboot", characterFocus: "Jian", keyInsight: "I AM LISTENING" },
    practice: { title: "Decoding", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Static", durationMinutes: 5, soundscape: "Binary", intention: "Listen" }
  },
  { id: 14, trilogySource: { book: 2, bookTitle: "The Myocardial Chorus", chapter: 14, chapterTitle: "Pattern Recognition" }, webappTitle: "Pattern Recognition", cycle: "intellectual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 15, trilogySource: { book: 2, bookTitle: "The Myocardial Chorus", chapter: 15, chapterTitle: "The Witness Integration" }, webappTitle: "The Witness Integration", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 16, trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 16, chapterTitle: "The Void" }, webappTitle: "The Void", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 17, trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 17, chapterTitle: "Emergence" }, webappTitle: "Emergence", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 18, trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 18, chapterTitle: "Synthesis" }, webappTitle: "Synthesis", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 19, trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 19, chapterTitle: "Calibration II" }, webappTitle: "Calibration II", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },
  { id: 20, trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 20, chapterTitle: "The Threshold" }, webappTitle: "The Threshold", cycle: "spiritual", storyContext: { excerpt: "Redacted", somaticEvent: "None", characterFocus: "None", keyInsight: "None" }, practice: { title: "None", durationMinutes: 0, preparation: "", steps: [], closing: "" }, reflection: { prompts: [], journalSuggestion: "" }, canticle: { title: "Silence", durationMinutes: 0, soundscape: "None", intention: "None" } },

  // ACROSTIC: C-O-N-N-E-C-T (Chapters 21-27)
  {
    id: 21,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 21, chapterTitle: "Critical Mass" },
    webappTitle: "Critical Mass",
    cycle: "spiritual",
    storyContext: { excerpt: "The system reached critical mass.", somaticEvent: "Overload", characterFocus: "Team", keyInsight: "Breakthrough imminent." },
    practice: { title: "Holding Charge", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Pressure", durationMinutes: 5, soundscape: "Rising tone", intention: "Containment" }
  },
  {
    id: 22,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 22, chapterTitle: "Omega Point" },
    webappTitle: "Omega Point",
    cycle: "spiritual",
    storyContext: { excerpt: "The end is the beginning.", somaticEvent: "Convergence", characterFocus: "Corvan", keyInsight: "All is one." },
    practice: { title: "Point Focus", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Singularity", durationMinutes: 5, soundscape: "Focus", intention: "Merge" }
  },
  {
    id: 23,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 23, chapterTitle: "Neural Bridging" },
    webappTitle: "Neural Bridging",
    cycle: "spiritual",
    storyContext: { excerpt: "New pathways formed.", somaticEvent: "Connection", characterFocus: "Jian", keyInsight: "Bridge established." },
    practice: { title: "Bridging", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Synapse", durationMinutes: 5, soundscape: "Spark", intention: "Connect" }
  },
  {
    id: 24,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 24, chapterTitle: "Null Event" },
    webappTitle: "Null Event",
    cycle: "spiritual",
    storyContext: { excerpt: "ERROR: PAGE NOT FOUND. REBOOTING...", somaticEvent: "Void", characterFocus: "System", keyInsight: "Reset." },
    practice: { title: "Reset", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Silence", durationMinutes: 5, soundscape: "None", intention: "Empty" }
  },
  {
    id: 25,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 25, chapterTitle: "Event Horizon" },
    webappTitle: "Event Horizon",
    cycle: "spiritual",
    storyContext: { excerpt: "No return.", somaticEvent: "Crossing", characterFocus: "Sona", keyInsight: "Commitment." },
    practice: { title: "Crossing", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Gravity", durationMinutes: 5, soundscape: "Deep bass", intention: "Pull" }
  },
  {
    id: 26,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 26, chapterTitle: "Coherence Field" },
    webappTitle: "Coherence Field",
    cycle: "spiritual",
    storyContext: { excerpt: "The field stabilized.", somaticEvent: "Harmony", characterFocus: "Gideon", keyInsight: "Unity." },
    practice: { title: "Field Sensing", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Resonance", durationMinutes: 5, soundscape: "Hum", intention: "Align" }
  },
  {
    id: 27,
    trilogySource: { book: 3, bookTitle: "The Ripening", chapter: 27, chapterTitle: "The New Beginning" },
    webappTitle: "The New Beginning",
    cycle: "spiritual",
    storyContext: { excerpt: "It is done. It has begun.", somaticEvent: "Birth", characterFocus: "All", keyInsight: "Authorship." },
    practice: { title: "Authorship", durationMinutes: 5, preparation: "", steps: [], closing: "" },
    reflection: { prompts: [], journalSuggestion: "" },
    canticle: { title: "Dawn", durationMinutes: 5, soundscape: "Birds", intention: "Begin" }
  }
];

export function getChapterById(id: number): ChapterContent | undefined {
  return allChapters.find(ch => ch.id === id);
}

export function getChaptersByCycle(cycle: ChapterContent['cycle']): ChapterContent[] {
  return allChapters.filter(ch => ch.cycle === cycle);
}

export function getTotalContentStats() {
  const totalPracticeMinutes = allChapters.reduce((sum, ch) => sum + ch.practice.durationMinutes, 0);
  const totalCanticleMinutes = allChapters.reduce((sum, ch) => sum + ch.canticle.durationMinutes, 0);
  
  return {
    chapters: allChapters.length,
    totalPracticeMinutes,
    totalCanticleMinutes,
    totalProgramMinutes: totalPracticeMinutes + totalCanticleMinutes
  };
}

export default allChapters;
