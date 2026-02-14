
export interface CodonResult {
    aminoAcid: string;
    resonance: string;
    frequency: number;
    description: string;
    isSpecial?: boolean;
}

const NUCLEOTIDES = ['A', 'U', 'C', 'G'];

export const CODON_MAPPING: Record<string, CodonResult> = {
    "AUG": {
        aminoAcid: "Methionine",
        resonance: "INITIALIZATION NODE",
        frequency: 432.0,
        description: "The primary activation sequence for the Anamnesis Engine. Root frequency stabilization achieved.",
        isSpecial: true
    },
    "UAA": {
        aminoAcid: "STOP",
        resonance: "TERMINATION VOID",
        frequency: 0.0,
        description: "Signal for narrative boundary. System entering standby.",
        isSpecial: true
    },
    "UAG": {
        aminoAcid: "STOP",
        resonance: "TERMINATION VOID",
        frequency: 0.0,
        description: "Signal for narrative boundary. System entering standby.",
        isSpecial: true
    },
    "UGA": {
        aminoAcid: "STOP",
        resonance: "TERMINATION VOID",
        frequency: 0.0,
        description: "Signal for narrative boundary. System entering standby.",
        isSpecial: true
    },
    "GAA": {
        aminoAcid: "Glutamic Acid",
        resonance: "EMOTIONAL CONDUCTOR",
        frequency: 528.0,
        description: "Highly conductive for Heart-Soma resonance. Facilitates emotional integration."
    },
    "AAA": {
        aminoAcid: "Lysine",
        resonance: "PURE POTENTIAL",
        frequency: 444.0,
        description: "Unstructured Khaloree reserve. High entropy, ready for crystallization."
    },
    "CCC": {
        aminoAcid: "Proline",
        resonance: "STRUCTURAL RIGIDITY",
        frequency: 396.0,
        description: "Hardened boundary layer. Recommended for defense-heavy sectors."
    },
    "GGG": {
        aminoAcid: "Glycine",
        resonance: "KINETIC PRANA",
        frequency: 639.0,
        description: "Fluctuating resonance. Ideal for rapid scene-to-scene transition state."
    },
    "UUC": {
        aminoAcid: "Phenylalanine",
        resonance: "SENSOR NODES",
        frequency: 285.0,
        description: "Enhanced somatic awareness. Increases highlight capture efficiency."
    },
    "CAA": {
        aminoAcid: "Glutamine",
        resonance: "NEURAL BRIDGE",
        frequency: 852.0,
        description: "Facilitates communication between Analytical and Intuitive axes."
    },
    "UUU": {
        aminoAcid: "Phenylalanine",
        resonance: "CRYSTAL STABILITY",
        frequency: 174.0,
        description: "Structural lattice reinforcement. Reduces noise in the Khaloree field."
    },
    // Add more as needed, or generate procedurally for the 64 combinations
};

export function getCodonResult(codon: string): CodonResult {
    const sequence = codon.toUpperCase().replace(/T/g, 'U');

    if (CODON_MAPPING[sequence]) {
        return CODON_MAPPING[sequence];
    }

    // Procedural generation for remaining codons to ensure all 64 work
    const bases = sequence.split('');
    if (bases.length !== 3 || !bases.every(b => NUCLEOTIDES.includes(b))) {
        throw new Error("INVALID SEQUENCE: MUST BE 3 NUCLEOTIDES (A, U, C, G)");
    }

    // Default resonance logic
    return {
        aminoAcid: "Unknown Peptide",
        resonance: "STABLE RESONANCE",
        frequency: 440.0 + (sequence.charCodeAt(0) % 100),
        description: `Generic biological synthesis confirmed for sequence ${sequence}. No high-level sacred markers detected.`
    };
}
