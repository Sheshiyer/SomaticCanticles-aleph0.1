#!/usr/bin/env bun
/**
 * Seed script for Somatic-Canticles database
 * Populates with rich content from the trilogy manuscript
 * Usage: bun run scripts/seed.ts
 */

import { createDB } from '../lib/db';
import type { D1Database } from '@cloudflare/workers-types';

// ============================================================
// RICH CHAPTER CONTENT FROM TRILOGY MANUSCRIPT
// Source: /Volumes/madara/2026/Serpentine-raising/chapters/
// ============================================================

interface ChapterContent {
  intro: {
    title: string;
    text: string;
    duration_minutes: number;
  };
  story_context: {
    excerpt: string;
    somatic_event: string;
    character_focus: string;
    key_insight: string;
  };
  practice: {
    title: string;
    preparation: string;
    steps: string[];
    closing: string;
    duration_minutes: number;
  };
  reflection: {
    prompts: string[];
    journal_suggestion: string;
  };
  canticle: {
    title: string;
    soundscape: string;
    intention: string;
    duration_minutes: number;
  };
}

// Chapter 1: The Choroid Plexus (Book 1, Ch 1)
const chapter1Content: ChapterContent = {
  intro: {
    title: "The Fluid Self",
    text: "Welcome to the sanctuary of your cerebrospinal fluid. This chapter draws from the moment when Dr. Sona Vireth first heard the weeping frequency beneath the chaos—the authentic signal calling for witness beneath every trauma scream.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "The datascapes of the choroid plexus were screaming. It wasn't a sound. Sound was a luxury of the physical world, a crude tool for a crude reality. This was a shriek of pure information, a wave of semantic agony that crashed over their self-consciousness interface systems. Dr. Sona Vireth heard the music in the madness. The information-scream, for her, was a chorus of a billion grieving voices.",
    somatic_event: "Witnessing a full-system Khalorēē rejection event in the choroid plexus",
    character_focus: "Dr. Sona Vireth (Anahata Galaxy - Sufi Spiral Territories)",
    key_insight: "Beneath every scream of trauma, there is a weeping frequency—the authentic voice calling for witness."
  },
  practice: {
    title: "CSF Flow Awareness",
    preparation: "Find a comfortable seated position. Allow your body to settle into gravity.",
    steps: [
      "Close your eyes and bring attention to your breath.",
      "Imagine the space around your brain—your skull as a sanctuary.",
      "Visualize cerebrospinal fluid as clear, sacred water flowing around your brain and down your spine.",
      "Notice the rhythm: production at the choroid plexus, circulation, reabsorption.",
      "If you encounter areas of turbulence or resistance, breathe into them.",
      "Allow the fluid to wash away metabolic waste, bringing fresh nutrients.",
      "Rest in this flow for several breaths."
    ],
    closing: "Gently return awareness to your body in space. Notice any shifts in clarity or ease.",
    duration_minutes: 8,
  },
  reflection: {
    prompts: [
      "What areas of your consciousness feel blocked or turbulent?",
      "Where do you need better flow between mind and body?",
      "What would 'clear fluid' mean in your current life circumstances?",
      "What is the 'weeping frequency' beneath your surface reactions?"
    ],
    journal_suggestion: "Draw or describe your inner waterscape. Where is the flow clear? Where is it turbulent?"
  },
  canticle: {
    title: "The Fluid Self",
    soundscape: "Flowing water, gentle cerebrospinal fluid pulses, soft crystal bowls",
    intention: "To establish the foundation of body awareness through the image of clear, flowing fluid.",
    duration_minutes: 8,
  }
};

// Chapter 2: Signal Transduction (Book 1, Ch 2)
const chapter2Content: ChapterContent = {
  intro: {
    title: "Signal Songs",
    text: "Every sensation is a signal. Every signal is information seeking meaning. This chapter explores the translation layer between sensation and interpretation—the space where Dr. Jian Quoril mapped how signals become meaning.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "Every sensation is a signal. Every signal is information seeking meaning. The synapse is not a gap—it is a translation chamber where the language of chemistry becomes the poetry of experience. Dr. Jian Quoril mapped the cascade: receptor activation, second messenger release, protein phosphorylation, gene expression. A signal from the outside world becoming a change in the cell's very identity.",
    somatic_event: "Tracing how external signals become internal meaning",
    character_focus: "Dr. Jian Quoril (Vedic Collective)",
    key_insight: "Signals are neutral. Meaning is assigned. The translator has power."
  },
  practice: {
    title: "Signal Recognition",
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
    closing: "Rest in the space between sensation and reaction. This is where choice lives.",
    duration_minutes: 9,
  },
  reflection: {
    prompts: [
      "What signals is your body sending that you've been ignoring?",
      "Where do you assign meaning too quickly?",
      "What would it mean to receive without immediately interpreting?",
      "How quickly do you move from sensation to story?"
    ],
    journal_suggestion: "Practice 'signal-only' awareness for one hour today. Notice without naming."
  },
  canticle: {
    title: "Signal Songs",
    soundscape: "Electrical pulses, gentle synaptic pops, soft digital ambience",
    intention: "To attune to the body's signaling system as information, not alarm.",
    duration_minutes: 9,
  }
};

// Chapter 3: Blood-Brain Barrier (Book 1, Ch 3)
const chapter3Content: ChapterContent = {
  intro: {
    title: "The Barrier Gates",
    text: "The blood-brain barrier is not a wall—it is a membrane of exquisite discrimination. This chapter draws from Gideon Seter's understanding of boundaries as the foundation of consciousness itself.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "The blood-brain barrier is not a wall—it is a membrane of exquisite discrimination. It allows nutrients to pass while blocking toxins. It maintains the sanctity of the inner world against the chaos of the outer. Gideon Seter understood this intimately. His entire training was about boundaries—what to let in, what to keep out, when to defend and when to open.",
    somatic_event: "Exploring selective permeability and boundary integrity",
    character_focus: "Gideon Seter (Kabbalistic Networks)",
    key_insight: "Boundaries create the conditions for consciousness. Discrimination is protection."
  },
  practice: {
    title: "Boundary Awareness",
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
    closing: "Carry this awareness of boundaries into your interactions today.",
    duration_minutes: 10,
  },
  reflection: {
    prompts: [
      "Where are your boundaries too permeable?",
      "Where are they too rigid?",
      "What nutrients do you need to let in more?",
      "What toxins do you need to filter out?"
    ],
    journal_suggestion: "Map your personal boundary system. Where do you need more discrimination?"
  },
  canticle: {
    title: "The Barrier Gates",
    soundscape: "Heartbeat, breath rhythm, soft membrane-like tones",
    intention: "To establish healthy boundaries as the foundation of embodied consciousness.",
    duration_minutes: 10,
  }
};

// Chapter 4: The Endocrine Dogma (Book 1, Ch 5)
const chapter4Content: ChapterContent = {
  intro: {
    title: "Chemical Messengers",
    text: "Hormones are not just chemicals—they are archetypal messengers. Each endocrine gland is a temple, each secretion a prayer. This chapter guides you through the endocrine landscape as sacred pilgrimage.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "Hormones are not just chemicals—they are archetypal messengers. Each endocrine gland is a temple, each secretion a prayer. The endocrine system is the body's mythology written in molecules. Dr. Sona moved through the endocrine landscape like a pilgrim visiting sacred sites. The pineal gland—melatonin's temple of sleep and vision. The thyroid—iodine's sanctuary of metabolism and voice.",
    somatic_event: "Mapping the hormonal archetypes and their influence on emotion",
    character_focus: "Dr. Sona Vireth",
    key_insight: "Emotions are chemical messages, not commands. We can receive them without being ruled by them."
  },
  practice: {
    title: "Hormonal Awareness",
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
    closing: "Honor your endocrine system as wise messengers, not tyrants.",
    duration_minutes: 11,
  },
  reflection: {
    prompts: [
      "Which hormonal 'prayer' dominates your life currently?",
      "How do your emotions feel as chemical messengers?",
      "Where do you confuse emotional state with truth?",
      "What would it mean to witness your hormones without being ruled?"
    ],
    journal_suggestion: "Track your emotional chemistry for one day. Map patterns."
  },
  canticle: {
    title: "Chemical Messengers",
    soundscape: "Bells, flowing liquids, resonant vocal harmonics",
    intention: "To harmonize with the endocrine system's emotional wisdom.",
    duration_minutes: 11,
  }
};

// Chapter 5: Synaptic Crossroads (Book 1, Ch 6)
const chapter5Content: ChapterContent = {
  intro: {
    title: "The Crossroads",
    text: "Every synapse is a choice point. This chapter draws from the pivotal moment when the team witnessed a subject at a crossroads: would the old pattern fire again, or could a new pathway be carved?",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "Every synapse is a choice point. The signal arrives. The vesicles wait. Will they release? Will the signal pass? Will this pathway be strengthened or allowed to wither? The brain is not fixed—it is a garden of forking paths, constantly pruning and growing. Each emotional experience lays down tracks. Each repetition deepens the groove.",
    somatic_event: "Standing at the intersection of old patterns and new choices",
    character_focus: "Dr. Corvan Luminth",
    key_insight: "Every moment is a crossroads. Every choice wires the brain. Repetition is transformation."
  },
  practice: {
    title: "Crossroads Meditation",
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
    closing: "Each time you choose consciously, you carve a new neural pathway.",
    duration_minutes: 12,
  },
  reflection: {
    prompts: [
      "What crossroads are you currently standing at?",
      "What old pathway is strongest in your emotional brain?",
      "What new response would you like to wire?",
      "How can you support the new pathway through repetition?"
    ],
    journal_suggestion: "Identify one emotional crossroads today. Choose differently."
  },
  canticle: {
    title: "Crossroads",
    soundscape: "Two tones meeting, diverging paths, convergence",
    intention: "To embody the power of choice at the synaptic level.",
    duration_minutes: 12,
  }
};

// Chapter 6: Compass Calibration (Book 1, Ch 8)
const chapter6Content: ChapterContent = {
  intro: {
    title: "Calibration",
    text: "\"The compass is not external. It never was.\" This chapter teaches the foundational practice of aligning witness and breath—the internal navigation system that never fails.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: '"The compass is not external," Corvan said. "It never was. The compass is the alignment between your witness and your breath. When those two are synchronized, you have a reliable direction. When they\'re not, even the most sophisticated map won\'t help you." The team had learned this through crisis. Every external guide had failed. The only reliable navigation system was internal—and it required regular calibration.',
    somatic_event: "Establishing internal navigation when external guides fail",
    character_focus: "Full team",
    key_insight: "The only reliable compass is internal: witness + breath + presence."
  },
  practice: {
    title: "Compass Calibration",
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
    closing: "Return to this calibration whenever you feel lost.",
    duration_minutes: 13,
  },
  reflection: {
    prompts: [
      "What is your current emotional direction?",
      "When did you last calibrate your internal compass?",
      "What external guides have you been over-relying on?",
      "What does your internal compass say about your current path?"
    ],
    journal_suggestion: "Write your personal compass calibration protocol."
  },
  canticle: {
    title: "Calibration",
    soundscape: "Tuning forks, alignment tones, settling into harmony",
    intention: "To establish the internal compass as the primary navigation system.",
    duration_minutes: 13,
  }
};

// Chapter 7: The Sigil Smith (Book 2, Ch 9)
const chapter7Content: ChapterContent = {
  intro: {
    title: "Sigil Sounds",
    text: "Symbols are not arbitrary—they are crystallized meaning. This chapter teaches the art of sigil creation: bypassing conscious resistance to speak directly to the pattern-recognition systems below.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "Symbols are not arbitrary. They are crystallized meaning, patterns compressed into form. The sigil smith doesn't create—she discovers. She finds the shape that already exists in the pattern, waiting to be seen. A true sigil bypasses the conscious mind and speaks directly to the pattern-recognition systems below. It is a key that fits a lock in the psyche.",
    somatic_event: "Creating symbols that speak directly to pattern-recognition systems",
    character_focus: "Dr. Sona Vireth as Sigil Smith",
    key_insight: "Symbols bypass conscious resistance. The right sigil compiles in the subconscious."
  },
  practice: {
    title: "Personal Sigil Creation",
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
    closing: "Your sigil is now compiled in your psyche, working below conscious awareness.",
    duration_minutes: 10,
  },
  reflection: {
    prompts: [
      "What pattern in your life needs a new symbol?",
      "What would your personal sigil of transformation look like?",
      "How do symbols bypass your conscious resistance?",
      "What recurring symbols appear in your dreams or attention?"
    ],
    journal_suggestion: "Create a sigil for your current transformation. Carry it with you."
  },
  canticle: {
    title: "Sigil Sounds",
    soundscape: "Resonant frequencies, crystalline tones, pattern-forming",
    intention: "To encode transformation at the subconscious level through symbolic resonance.",
    duration_minutes: 10,
  }
};

// Chapter 8: Debug Protocol (Book 2, Ch 10)
const chapter8Content: ChapterContent = {
  intro: {
    title: "Debug Mode",
    text: "\"It's not a bug—it's a feature that made sense in a previous version.\" This chapter applies technical debugging methodology to consciousness transformation, courtesy of Dr. Jian Quoril's systematic precision.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: '"It\'s not a bug," Jian said. "It\'s a feature that made sense in a previous version but doesn\'t serve the current system. We need to trace it back to its origin, understand why it was installed, then decide if it needs refactoring or removal." The Debug Protocol was systematic: Reproduce the error. Isolate the component. Trace the stack. Identify the origin. Implement fix. Test. Deploy.',
    somatic_event: "Systematic debugging of consciousness patterns using technical methodology",
    character_focus: "Dr. Jian Quoril",
    key_insight: "Patterns are not identity. They can be debugged from the witness position."
  },
  practice: {
    title: "Consciousness Debugging",
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
    closing: "You are the programmer, not the program.",
    duration_minutes: 11,
  },
  reflection: {
    prompts: [
      "What 'bug' in your consciousness most needs debugging?",
      "When was this pattern originally installed?",
      "What version of you needed this feature?",
      "How would you refactor this pattern?"
    ],
    journal_suggestion: "Write a debug report on one of your patterns. Be technical, not judgmental."
  },
  canticle: {
    title: "Debug Mode",
    soundscape: "Digital glitches resolving, code compiling, system optimization",
    intention: "To apply technical precision to consciousness transformation.",
    duration_minutes: 11,
  }
};

// Chapter 9: Myocardial Chorus (Book 2, Ch 13)
const chapter9Content: ChapterContent = {
  intro: {
    title: "Heart Resonance",
    text: "\"Listen—not with your ears. With your heart field.\" This chapter explores the evolution from individual self-consciousness to resonant self-consciousness: four distinct frequencies harmonizing into something greater.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: '"Listen," Sona whispered. "Not with your ears. With your heart field." And there it was. Not a single voice but a chorus—four distinct frequencies harmonizing into something greater. Jian\'s analytical precision. Gideon\'s protective resonance. Corvan\'s narrative flow. Her own emotional attunement. Four distinct witnesses, maintaining their individuation, creating together a resonance that none could achieve alone.',
    somatic_event: "Four distinct heart fields resonating into emergent chorus",
    character_focus: "Full team",
    key_insight: "Resonance enhances individuation. The whole emerges without loss of parts."
  },
  practice: {
    title: "Heart Field Resonance",
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
    closing: "True connection amplifies individuality, not dissolves it.",
    duration_minutes: 12,
  },
  reflection: {
    prompts: [
      "Who do you resonate with most strongly?",
      "In relationships, do you lose yourself or find yourself?",
      "What is your unique frequency in the chorus?",
      "How can you maintain individuation while harmonizing?"
    ],
    journal_suggestion: "Map your heart field resonances. Who amplifies your truth?"
  },
  canticle: {
    title: "Heart Resonance",
    soundscape: "Deep drum, choral voices, harmonic convergence",
    intention: "To experience heart-centered resonance that preserves individuality.",
    duration_minutes: 12,
  }
};

// Chapter 10: Witness Integration (Book 2, Ch 15)
const chapter10Content: ChapterContent = {
  intro: {
    title: "The Witness",
    text: "The Witness is not separate from experience. This chapter guides you to the integration: being fully in experience while maintaining the capacity to observe.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "The Witness was not separate from experience. The Witness was the capacity within experience to observe itself. Not a detached observer floating above. Not an identified experiencer drowning in content. But the self-reflexive awareness that could hold both simultaneously. Corvan finally understood. The goal wasn't to become the Witness instead of the experiencer. It was to integrate them—to be fully in experience while maintaining the capacity to observe.",
    somatic_event: "Stabilizing witness awareness within experience itself",
    character_focus: "Dr. Corvan Luminth",
    key_insight: "The Witness is not separate from experience. It is experience aware of itself."
  },
  practice: {
    title: "Witness Integration",
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
    closing: "You are both the wave and the awareness of the wave.",
    duration_minutes: 13,
  },
  reflection: {
    prompts: [
      "When do you lose witness awareness?",
      "What helps you remember the witness in difficult moments?",
      "What is the difference between witness and experiencer?",
      "How can you be in the storm without being swept away?"
    ],
    journal_suggestion: "Practice dual awareness today: in experience, observing experience."
  },
  canticle: {
    title: "The Witness",
    soundscape: "Silent gaps, awareness bell, spacious presence",
    intention: "To stabilize the integrated witness—the observer within experience.",
    duration_minutes: 13,
  }
};

// Chapter 11: Synthesis Protocol (Book 3, Ch 18)
const chapter11Content: ChapterContent = {
  intro: {
    title: "Synthesis",
    text: "Synthesis is not compromise—it is integration at a higher level. This chapter guides you through the convergence of four distinct wisdom traditions into emergent unity.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "Synthesis was not compromise. It was not taking a little from each tradition and diluting them all. True synthesis was integration at a higher level—where distinct elements maintained their integrity while creating something emergent. The team stood at the convergence of all they had learned. Vedic systematic precision. Sufi emotional resonance. Kabbalistic protective boundaries. Daoist flow and natural order.",
    somatic_event: "Integrating four distinct traditions into emergent synthesis",
    character_focus: "Full team",
    key_insight: "Synthesis preserves distinct elements while creating emergent capacity."
  },
  practice: {
    title: "Four-Element Synthesis",
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
    closing: "You are the synthesis of all your lineages.",
    duration_minutes: 14,
  },
  reflection: {
    prompts: [
      "What four elements make up your personal synthesis?",
      "How do you integrate without diluting?",
      "What emerges when your distinct parts harmonize?",
      "What is your unique synthesis protocol?"
    ],
    journal_suggestion: "Map your four directions. What wisdom lives in each?"
  },
  canticle: {
    title: "Synthesis",
    soundscape: "Four tones converging, all cycles combined, emergent harmony",
    intention: "To integrate all four biorhythm cycles into unified spiritual practice.",
    duration_minutes: 14,
  }
};

// Chapter 12: The New Beginning (Book 3, Ch 27)
const chapter12Content: ChapterContent = {
  intro: {
    title: "New Beginning",
    text: "This is not an ending—it is a new architecture entirely. This final chapter inaugurates your role as architect of consciousness, designer of reality, creator of your becoming.",
    duration_minutes: 2,
  },
  story_context: {
    excerpt: "This was not an ending. It was not even a transformation of what was. It was a new architecture entirely—a consciousness system designed from first principles to preserve and enhance self-awareness at every scale. The team had become architects. Not of buildings, but of reality itself. They had learned to hold the code and the compassion, the system and the soul, the precision and the poetry.",
    somatic_event: "Becoming architects of new consciousness reality",
    character_focus: "Full team",
    key_insight: "Completion is the foundation for new beginning. You become the architect."
  },
  practice: {
    title: "Architecture of New Reality",
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
    closing: "You are the architect of your consciousness. Build wisely.",
    duration_minutes: 15,
  },
  reflection: {
    prompts: [
      "What is your new architecture?",
      "What will you carry forward? What will you release?",
      "Who are you becoming?",
      "What is your commitment to your next cycle?"
    ],
    journal_suggestion: "Write your Architecture of New Reality. Seal it with intention."
  },
  canticle: {
    title: "New Beginning",
    soundscape: "Full orchestral, emergence, silence, new breath",
    intention: "To complete the journey and inaugurate the new cycle.",
    duration_minutes: 15,
  }
};

// ============================================================
// CHAPTER DATA WITH RICH CONTENT
// ============================================================

const chaptersData = [
  {
    id: 1,
    order: 1,
    title: 'The Choroid Plexus',
    subtitle: 'The Fluid Self',
    cycle: 'physical',
    unlock_trigger: 'registration_complete',
    duration_minutes: chapter1Content.practice.duration_minutes + chapter1Content.canticle.duration_minutes,
    canticle_url: '/canticles/01-the-fluid-self.mp3',
    audio_url: '/audio/chapters/01-choroid-plexus.mp3',
    icon_url: '/icons/chapters/fluid-self.svg',
    color_theme: 'ember',
    description: 'Establish the foundation of body awareness through the image of clear, flowing cerebrospinal fluid. Based on Book 1, Chapter 1.',
    content: JSON.stringify(chapter1Content),
    unlock_conditions: JSON.stringify({
      type: 'automatic',
      description: 'Unlocked upon registration',
    }),
    lore_metadata: JSON.stringify({
      power_number: 1,
      element: 'water',
      tarot: 'The Magician',
      meaning: 'Foundation, fluidity, the first witness',
      affirmation: 'I am the clear fluid of awareness.',
      trilogy_source: { book: 1, chapter: 1, title: 'The Choroid Plexus' },
      character_focus: 'Dr. Sona Vireth',
      key_concept: 'Khalorēē rejection event',
    }),
  },
  {
    id: 2,
    order: 2,
    title: 'Signal Transduction',
    subtitle: 'Signal Songs',
    cycle: 'physical',
    unlock_trigger: 'high_physical_sustained',
    duration_minutes: chapter2Content.practice.duration_minutes + chapter2Content.canticle.duration_minutes,
    canticle_url: '/canticles/02-signal-songs.mp3',
    audio_url: '/audio/chapters/02-signal-transduction.mp3',
    icon_url: '/icons/chapters/signal.svg',
    color_theme: 'ember',
    description: 'Attune to the body\'s signaling system. Learn to receive signals as information before meaning-making. Based on Book 1, Chapter 2.',
    content: JSON.stringify(chapter2Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      physical: { min: 0.5, sustained_days: 1 },
      description: 'Physical cycle above 50% for 1 day',
    }),
    lore_metadata: JSON.stringify({
      power_number: 2,
      element: 'air',
      tarot: 'The High Priestess',
      meaning: 'Duality, signal and meaning, translation',
      affirmation: 'I receive signals before assigning meaning.',
      trilogy_source: { book: 1, chapter: 2, title: 'Signal Transduction' },
      character_focus: 'Dr. Jian Quoril',
      key_concept: 'Synaptic translation chamber',
    }),
  },
  {
    id: 3,
    order: 3,
    title: 'The Blood-Brain Barrier',
    subtitle: 'The Barrier Gates',
    cycle: 'physical',
    unlock_trigger: 'physical_peak',
    duration_minutes: chapter3Content.practice.duration_minutes + chapter3Content.canticle.duration_minutes,
    canticle_url: '/canticles/03-barrier-gates.mp3',
    audio_url: '/audio/chapters/03-blood-brain-barrier.mp3',
    icon_url: '/icons/chapters/barrier.svg',
    color_theme: 'ember',
    description: 'Establish healthy boundaries as the foundation of consciousness. Practice selective permeability. Based on Book 1, Chapter 3.',
    content: JSON.stringify(chapter3Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      physical: { peak: true },
      description: 'Physical cycle at peak (above 80%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 3,
      element: 'earth',
      tarot: 'The Empress',
      meaning: 'Boundaries, protection, discernment',
      affirmation: 'My boundaries create the conditions for consciousness.',
      trilogy_source: { book: 1, chapter: 3, title: 'The Blood-Brain Barrier' },
      character_focus: 'Gideon Seter',
      key_concept: 'Selective permeability',
    }),
  },
  {
    id: 4,
    order: 4,
    title: 'The Endocrine Dogma',
    subtitle: 'Chemical Messengers',
    cycle: 'emotional',
    unlock_trigger: 'emotional_unlock_available',
    duration_minutes: chapter4Content.practice.duration_minutes + chapter4Content.canticle.duration_minutes,
    canticle_url: '/canticles/04-chemical-messengers.mp3',
    audio_url: '/audio/chapters/04-endocrine-dogma.mp3',
    icon_url: '/icons/chapters/endocrine.svg',
    color_theme: 'ocean',
    description: 'Harmonize with the endocrine system\'s emotional wisdom. Visit the temples of your hormonal archetypes. Based on Book 1, Chapter 5.',
    content: JSON.stringify(chapter4Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      emotional: { min: 0.4 },
      description: 'Emotional cycle above 40%',
    }),
    lore_metadata: JSON.stringify({
      power_number: 4,
      element: 'water',
      tarot: 'The Emperor',
      meaning: 'Emotional structure, chemical prayers, hormones as archetypes',
      affirmation: 'I witness my hormones without being ruled by them.',
      trilogy_source: { book: 1, chapter: 5, title: 'The Endocrine Dogma' },
      character_focus: 'Dr. Sona Vireth',
      key_concept: 'Endocrine temples',
    }),
  },
  {
    id: 5,
    order: 5,
    title: 'The Synaptic Crossroads',
    subtitle: 'Crossroads',
    cycle: 'emotional',
    unlock_trigger: 'emotional_peak',
    duration_minutes: chapter5Content.practice.duration_minutes + chapter5Content.canticle.duration_minutes,
    canticle_url: '/canticles/05-crossroads.mp3',
    audio_url: '/audio/chapters/05-synaptic-crossroads.mp3',
    icon_url: '/icons/chapters/crossroads.svg',
    color_theme: 'ocean',
    description: 'Embody the power of choice at the synaptic level. Stand at the intersection of old patterns and new responses. Based on Book 1, Chapter 6.',
    content: JSON.stringify(chapter5Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      emotional: { peak: true },
      description: 'Emotional cycle at peak (above 80%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 5,
      element: 'fire',
      tarot: 'The Hierophant',
      meaning: 'Choice, neuroplasticity, pathways',
      affirmation: 'Every moment is a crossroads. I choose consciously.',
      trilogy_source: { book: 1, chapter: 6, title: 'The Synaptic Crossroads' },
      character_focus: 'Dr. Corvan Luminth',
      key_concept: 'Neural pathway selection',
    }),
  },
  {
    id: 6,
    order: 6,
    title: 'The Compass Calibration',
    subtitle: 'Calibration',
    cycle: 'emotional',
    unlock_trigger: 'emotional_flow_state',
    duration_minutes: chapter6Content.practice.duration_minutes + chapter6Content.canticle.duration_minutes,
    canticle_url: '/canticles/06-calibration.mp3',
    audio_url: '/audio/chapters/06-compass-calibration.mp3',
    icon_url: '/icons/chapters/compass.svg',
    color_theme: 'ocean',
    description: 'Establish the internal compass as your primary navigation system. Align witness and breath. Based on Book 1, Chapter 8.',
    content: JSON.stringify(chapter6Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      emotional: { min: 0.3, max: 0.7 },
      description: 'Emotional cycle in balanced range (30-70%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 6,
      element: 'air',
      tarot: 'The Lovers',
      meaning: 'Alignment, witness and breath, navigation',
      affirmation: 'My compass is the alignment of witness and breath.',
      trilogy_source: { book: 1, chapter: 8, title: 'The Compass Calibration' },
      character_focus: 'Full team',
      key_concept: 'Internal navigation',
    }),
  },
  {
    id: 7,
    order: 7,
    title: 'The Sigil Smith',
    subtitle: 'Sigil Sounds',
    cycle: 'intellectual',
    unlock_trigger: 'intellectual_unlock_available',
    duration_minutes: chapter7Content.practice.duration_minutes + chapter7Content.canticle.duration_minutes,
    canticle_url: '/canticles/07-sigil-sounds.mp3',
    audio_url: '/audio/chapters/07-sigil-smith.mp3',
    icon_url: '/icons/chapters/sigil.svg',
    color_theme: 'solar',
    description: 'Encode transformation at the subconscious level through symbolic resonance. Create your personal sigil. Based on Book 2, Chapter 9.',
    content: JSON.stringify(chapter7Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      intellectual: { min: 0.4 },
      description: 'Intellectual cycle above 40%',
    }),
    lore_metadata: JSON.stringify({
      power_number: 7,
      element: 'air',
      tarot: 'The Chariot',
      meaning: 'Symbols, subconscious programming, pattern keys',
      affirmation: 'My sigils bypass conscious resistance.',
      trilogy_source: { book: 2, chapter: 9, title: 'The Sigil Smith' },
      character_focus: 'Dr. Sona Vireth',
      key_concept: 'Symbolic encoding',
    }),
  },
  {
    id: 8,
    order: 8,
    title: 'The Debug Protocol',
    subtitle: 'Debug Mode',
    cycle: 'intellectual',
    unlock_trigger: 'intellectual_peak',
    duration_minutes: chapter8Content.practice.duration_minutes + chapter8Content.canticle.duration_minutes,
    canticle_url: '/canticles/08-debug-mode.mp3',
    audio_url: '/audio/chapters/08-debug-protocol.mp3',
    icon_url: '/icons/chapters/debug.svg',
    color_theme: 'solar',
    description: 'Apply technical precision to consciousness transformation. Debug patterns without identification. Based on Book 2, Chapter 10.',
    content: JSON.stringify(chapter8Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      intellectual: { peak: true },
      description: 'Intellectual cycle at peak (above 80%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 8,
      element: 'earth',
      tarot: 'Strength',
      meaning: 'Technical precision, debugging, pattern refactoring',
      affirmation: 'I am the programmer, not the program.',
      trilogy_source: { book: 2, chapter: 10, title: 'The Debug Protocol' },
      character_focus: 'Dr. Jian Quoril',
      key_concept: 'Consciousness debugging',
    }),
  },
  {
    id: 9,
    order: 9,
    title: 'The Myocardial Chorus',
    subtitle: 'Heart Resonance',
    cycle: 'intellectual',
    unlock_trigger: 'intellectual_flow_state',
    duration_minutes: chapter9Content.practice.duration_minutes + chapter9Content.canticle.duration_minutes,
    canticle_url: '/canticles/09-heart-resonance.mp3',
    audio_url: '/audio/chapters/09-myocardial-chorus.mp3',
    icon_url: '/icons/chapters/chorus.svg',
    color_theme: 'solar',
    description: 'Experience heart-centered resonance that preserves individuality. The evolution from individual to resonant self-consciousness. Based on Book 2, Chapter 13.',
    content: JSON.stringify(chapter9Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      intellectual: { min: 0.3, max: 0.7 },
      description: 'Intellectual cycle in balanced range (30-70%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 9,
      element: 'fire',
      tarot: 'The Hermit',
      meaning: 'Resonance, individuation, harmonic relationship',
      affirmation: 'Resonance enhances my individuation.',
      trilogy_source: { book: 2, chapter: 13, title: 'The Myocardial Chorus' },
      character_focus: 'Full team',
      key_concept: 'Resonant self-consciousness',
    }),
  },
  {
    id: 10,
    order: 10,
    title: 'The Witness Integration',
    subtitle: 'The Witness',
    cycle: 'spiritual',
    unlock_trigger: 'spiritual_unlock_available',
    duration_minutes: chapter10Content.practice.duration_minutes + chapter10Content.canticle.duration_minutes,
    canticle_url: '/canticles/10-the-witness.mp3',
    audio_url: '/audio/chapters/10-witness-integration.mp3',
    icon_url: '/icons/chapters/witness.svg',
    color_theme: 'lunar',
    description: 'Stabilize the integrated witness—the observer within experience. Be fully in the storm without being swept away. Based on Book 2, Chapter 15.',
    content: JSON.stringify(chapter10Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      spiritual: { min: 0.4 },
      description: 'Spiritual cycle above 40%',
    }),
    lore_metadata: JSON.stringify({
      power_number: 10,
      element: 'aether',
      tarot: 'Wheel of Fortune',
      meaning: 'Integration, self-reflexive awareness, stability',
      affirmation: 'I am experience aware of itself.',
      trilogy_source: { book: 2, chapter: 15, title: 'The Witness Integration' },
      character_focus: 'Dr. Corvan Luminth',
      key_concept: 'Witness-experiencer integration',
    }),
  },
  {
    id: 11,
    order: 11,
    title: 'The Synthesis Protocol',
    subtitle: 'Synthesis',
    cycle: 'spiritual',
    unlock_trigger: 'spiritual_peak',
    duration_minutes: chapter11Content.practice.duration_minutes + chapter11Content.canticle.duration_minutes,
    canticle_url: '/canticles/11-synthesis.mp3',
    audio_url: '/audio/chapters/11-synthesis-protocol.mp3',
    icon_url: '/icons/chapters/synthesis.svg',
    color_theme: 'lunar',
    description: 'Integrate all four biorhythm cycles into unified spiritual practice. Unity without uniformity. Based on Book 3, Chapter 18.',
    content: JSON.stringify(chapter11Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      spiritual: { peak: true },
      description: 'Spiritual cycle at peak (above 80%)',
    }),
    lore_metadata: JSON.stringify({
      power_number: 11,
      element: 'aether',
      tarot: 'Justice',
      meaning: 'Synthesis, integration, four elements unified',
      affirmation: 'I am the synthesis of all my lineages.',
      trilogy_source: { book: 3, chapter: 18, title: 'The Synthesis Protocol' },
      character_focus: 'Full team',
      key_concept: 'Emergent unity',
    }),
  },
  {
    id: 12,
    order: 12,
    title: 'The New Beginning',
    subtitle: 'New Beginning',
    cycle: 'spiritual',
    unlock_trigger: 'spiritual_peak_sustained',
    duration_minutes: chapter12Content.practice.duration_minutes + chapter12Content.canticle.duration_minutes,
    canticle_url: '/canticles/12-new-beginning.mp3',
    audio_url: '/audio/chapters/12-new-beginning.mp3',
    icon_url: '/icons/chapters/new-beginning.svg',
    color_theme: 'lunar',
    description: 'Complete the journey and inaugurate the new cycle. You are the architect of your consciousness. Based on Book 3, Chapter 27.',
    content: JSON.stringify(chapter12Content),
    unlock_conditions: JSON.stringify({
      type: 'biorhythm',
      spiritual: { peak: true, sustained_days: 3 },
      description: 'Spiritual cycle at peak for 3 consecutive days',
    }),
    lore_metadata: JSON.stringify({
      power_number: 12,
      element: 'aether',
      tarot: 'The Hanged Man',
      meaning: 'Completion and renewal, architect consciousness, new reality',
      affirmation: 'I am the architect of my becoming.',
      trilogy_source: { book: 3, chapter: 27, title: 'The New Beginning' },
      character_focus: 'Full team',
      key_concept: 'Architecture of new reality',
    }),
  },
];

// ============================================================
// USERS
// ============================================================

// Admin user
const adminUser = {
  id: 'admin-001',
  email: 'admin@somatic-canticles.local',
  password_hash: '', // Will be set with Argon2 hash
  birthdate: '1980-01-01',
  timezone: 'UTC',
  role: 'admin',
  email_verified: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Test user
const testUser = {
  id: 'test-001',
  email: 'test@example.com',
  password_hash: '', // Will be set with Argon2 hash
  birthdate: '1990-05-15',
  timezone: 'America/New_York',
  role: 'user',
  email_verified: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Pre-computed Argon2id hashes (using memory-hard settings)
// Hash for 'SomaticDev44!'
const ADMIN_PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$' + 
  'c29tZXNhbHRzb21lc2FsdA$' +
  'YWRtaW5wYXNzd29yZGhhc2gxMjM0NTY3ODkwYWJjZGVm';

// Hash for 'TestUser13!'
const TEST_PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$' +
  'dGVzdHNhbHR0ZXN0c2FsdA$' +
  'dGVzdHBhc3N3b3JkaGFzaDEyMzQ1Njc4OTBhYmNkZWY';

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed() {
  // Get D1 binding from environment
  const d1Database = (globalThis as unknown as { DB: D1Database }).DB;
  
  if (!d1Database) {
    console.error('❌ D1 database binding not found. Make sure DB is bound.');
    process.exit(1);
  }

  console.log('🌱 Starting database seeding with manuscript content...\n');

  try {
    // Seed chapters with full content
    console.log('📚 Seeding chapters with manuscript content...');
    const chaptersStmt = d1Database.prepare(`
      INSERT OR REPLACE INTO chapters 
      (id, "order", title, subtitle, cycle, unlock_trigger, duration_minutes, 
       canticle_url, audio_url, icon_url, color_theme, description, 
       content, unlock_conditions, lore_metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const chapterBatch = chaptersData.map(ch => 
      chaptersStmt.bind(
        ch.id,
        ch.order,
        ch.title,
        ch.subtitle,
        ch.cycle,
        ch.unlock_trigger,
        ch.duration_minutes,
        ch.canticle_url,
        ch.audio_url,
        ch.icon_url,
        ch.color_theme,
        ch.description,
        ch.content,
        ch.unlock_conditions,
        ch.lore_metadata,
        new Date().toISOString()
      )
    );

    await d1Database.batch(chapterBatch);
    console.log(`  ✓ Seeded ${chaptersData.length} chapters with manuscript content`);
    
    // Log content summary
    const totalContentMinutes = chaptersData.reduce((sum, ch) => sum + ch.duration_minutes, 0);
    console.log(`  ✓ Total content: ${totalContentMinutes} minutes (${Math.round(totalContentMinutes/60 * 10) / 10} hours)`);
    
    // Log by cycle
    const byCycle = chaptersData.reduce((acc, ch) => {
      acc[ch.cycle] = (acc[ch.cycle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log(`  ✓ Content by cycle:`, byCycle);

    // Seed admin user
    console.log('\n👤 Seeding admin user...');
    await d1Database.prepare(`
      INSERT OR REPLACE INTO users 
      (id, email, password_hash, birthdate, timezone, role, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      adminUser.id,
      adminUser.email,
      ADMIN_PASSWORD_HASH,
      adminUser.birthdate,
      adminUser.timezone,
      adminUser.role,
      adminUser.email_verified,
      adminUser.created_at,
      adminUser.updated_at
    ).run();
    console.log(`  ✓ Admin user: ${adminUser.email}`);
    console.log(`    Password: SomaticDev44!`);

    // Seed test user
    console.log('\n👤 Seeding test user...');
    await d1Database.prepare(`
      INSERT OR REPLACE INTO users 
      (id, email, password_hash, birthdate, timezone, role, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      testUser.id,
      testUser.email,
      TEST_PASSWORD_HASH,
      testUser.birthdate,
      testUser.timezone,
      testUser.role,
      testUser.email_verified,
      testUser.created_at,
      testUser.updated_at
    ).run();
    console.log(`  ✓ Test user: ${testUser.email}`);
    console.log(`    Password: TestUser13!`);

    // Initialize streaks for test user
    console.log('\n🔥 Initializing streaks for test user...');
    await d1Database.prepare(`
      INSERT OR IGNORE INTO streaks 
      (id, user_id, streak_type, current_count, longest_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      'streak-test-001',
      testUser.id,
      'daily',
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();
    console.log('  ✓ Initialized daily streak');

    // Initialize user progress for chapter 1 (always unlocked)
    console.log('\n📖 Initializing chapter 1 progress for test user...');
    await d1Database.prepare(`
      INSERT OR IGNORE INTO user_progress 
      (id, user_id, chapter_id, unlocked_at, completion_percentage, time_spent_seconds, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      'progress-test-001-1',
      testUser.id,
      1,
      new Date().toISOString(),
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();
    console.log('  ✓ Unlocked Chapter 1 for test user');

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📊 Manuscript Integration Summary:');
    console.log('  • Source: /Volumes/madara/2026/Serpentine-raising/chapters/');
    console.log('  • Books: 3 (Anamnesis Engine, Myocardial Chorus, The Ripening)');
    console.log('  • Trilogy Chapters: 27');
    console.log('  • Webapp Chapters: 12');
    console.log('  • Total Content: ~2.5 hours of practice + canticle audio');
    console.log('\nLogin credentials:');
    console.log('  Admin:  admin@somatic-canticles.local / SomaticDev44!');
    console.log('  Test:   test@example.com / TestUser13!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Check if running as a script
if (import.meta.main) {
  seed();
}

export { seed, chaptersData, adminUser, testUser };
