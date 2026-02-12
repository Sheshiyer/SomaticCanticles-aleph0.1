export interface LoreDefinition {
    term: string;
    definition: string;
    category: "technology" | "spiritual" | "biological" | "protocol" | "consciousness" | "technical" | "cosmic";
    icon?: string;
}

export const LORE_DEFINITIONS: Record<string, LoreDefinition> = {
    vysium: {
        term: "Vysium",
        definition: "A rare metamorphic crystal used in neural processing to expand perception of temporal sequences. It allows for the sensation of 'expanded time' during high-stress neural operations.",
        category: "technology",
    },
    eclipture: {
        term: "Eclipture",
        definition: "The state of total internal alignment where physical, emotional, and intellectual cycles synchronize into a single luminous field.",
        category: "spiritual",
    },
    anamnesis: {
        term: "Anamnesis",
        definition: "The process of 'remembering' forgotten knowledge from previous iterations of consciousness. The core protocol of the engine.",
        category: "protocol",
    },
    "consciousness": {
        term: "Consciousness",
        category: "consciousness",
        definition: "Basic awareness, automatic responses, and reactive processing. Subject to inherited patterns (Khalorēē) and the Vine of Determinism.",
        icon: "brain"
    },
    "self-consciousness": {
        term: "Self-Consciousness",
        category: "consciousness",
        definition: "Awareness of awareness; the witness state. The capacity to observe conditioning without being controlled by it. The debugger of consciousness.",
        icon: "sparkles"
    },
    "anamnesis engine": {
        term: "Anamnesis Engine",
        category: "technical",
        definition: "A quantum-somatic processing unit designed to retrieve and debug deep consciousness legacies. Requires self-consciousness to navigate.",
        icon: "cpu"
    },
    "myocardial chorus": {
        term: "Myocardial Chorus",
        category: "consciousness",
        definition: "Resonant self-consciousness where distinct witnesses maintain individuation while their fields resonate together, creating emergent observation capacity.",
        icon: "heart"
    },
    "vine of determinism": {
        term: "Vine of Determinism",
        category: "cosmic",
        definition: "The automatic, reactive state of consciousness without witness awareness. A field of pure reactivity where patterns repeat endlessly.",
        icon: "git-commit"
    },
    "entropy plague": {
        term: "Entropy Plague",
        category: "cosmic",
        definition: "The cosmic force collapsing self-consciousness back to consciousness—causing witness awareness to regress into pure reactivity.",
        icon: "skull"
    },
    "khalorēē": {
        term: "Khalorēē",
        category: "biological",
        definition: "Inherited somatic patterns and belief systems that run automatically in the consciousness field until debugged.",
        icon: "dna"
    },
    "fractal individuation": {
        term: "Fractal Individuation",
        category: "technical",
        definition: "The principle that nodes remain distinct at every scale of evolution. Sovereignty is preserved even in high-resonance states.",
        icon: "layers"
    },
    "witnessos": {
        term: "WitnessOS",
        category: "technical",
        definition: "The operational protocols used by the team to maintain self-consciousness and debug consciousness fields.",
        icon: "monitor"
    },
    "somatic field": {
        term: "Somatic Field",
        category: "biological",
        definition: "The energetic envelope surrounding the physical body, containing the blueprints of current and inherited states.",
        icon: "activity"
    },
    "resonance map": {
        term: "Resonance Map",
        category: "technical",
        definition: "An interactive visualization of the connections between different scenes, chapters, and the user's somatic state.",
        icon: "map"
    },
    "crystallization interface": {
        term: "Crystallization Interface",
        category: "technical",
        definition: "The protocols used to bridge the gap between automatic field responses and witness capacity.",
        icon: "settings"
    },
    "choroid plexus": {
        term: "Choroid Plexus",
        definition: "In this context, the neural-energy gateway where consciousness data is filtered into the physical vessel.",
        category: "biological",
    },
    tryambakam: {
        term: "Tryambakam",
        definition: "A high-level diagnostic protocol that analyzes reality across three simultaneous layers: the physical, the emotional, and the structural.",
        category: "protocol",
    }
};

export function findLoreDefinition(text: string): LoreDefinition | null {
    const normalized = text.toLowerCase().trim();
    return LORE_DEFINITIONS[normalized] || null;
}
