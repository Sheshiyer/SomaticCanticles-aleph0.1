/**
 * Somatic Canticles Trilogy Data
 * 
 * Maps the 27-chapter sci-fi trilogy to the 12-chapter webapp experience.
 * Source: somatic_canticles_trilogy_data.json
 */

export interface TrilogyChapter {
  chapter_number: number;
  title: string;
}

export interface TrilogyBook {
  id: string;
  title: string;
  sequence: number;
  overview: string;
  chapters: TrilogyChapter[];
}

export interface TrilogySeries {
  title: string;
  description: string;
  books: TrilogyBook[];
}

// Full trilogy data
export const trilogyData: TrilogySeries = {
  title: "Somatic Canticles",
  description: "A sci-fi trilogy exploring the intersection of biological science and mystical consciousness. The 'Somanaut' team navigates the 'Anamnesis Engine' to uncover hidden traumas ('Lethe') and reveal the truth ('Aletheia') of the human experience.",
  books: [
    {
      id: "book_1",
      title: "Anamnesis Engine",
      sequence: 1,
      overview: "The Somanaut team is introduced as they navigate the biological and psychological landscapes of the 'Anamnesis Engine'. They confront the 'Vine of Determinism' and the initial layers of concealed trauma, establishing the 'Compass Calibration' for their journey.",
      chapters: [
        { chapter_number: 1, title: "The Choroid Plexus" },
        { chapter_number: 2, title: "Signal Transduction" },
        { chapter_number: 3, title: "The Blood-Brain Barrier" },
        { chapter_number: 4, title: "The Emperor's Genome" },
        { chapter_number: 5, title: "The Endocrine Dogma" },
        { chapter_number: 6, title: "The Synaptic Crossroads" },
        { chapter_number: 7, title: "The Breathfield Weaver" },
        { chapter_number: 8, title: "The Compass Calibration" }
      ]
    },
    {
      id: "book_2",
      title: "The Myocardial Chorus",
      sequence: 2,
      overview: "The team delves deeper into the 'Myocardial Chorus', learning to function as a resonant unit ('Three-Body Coordination'). They face the challenge of 'Witness Integration' and the necessity of 'Resonant Self-Consciousness' to heal the fractures within the system.",
      chapters: [
        { chapter_number: 9, title: "The Sigil Smith" },
        { chapter_number: 10, title: "The Debug Protocol" },
        { chapter_number: 11, title: "The Avatar Mutation" },
        { chapter_number: 12, title: "The Anamnesis Engine" },
        { chapter_number: 13, title: "The Myocardial Chorus" },
        { chapter_number: 14, title: "The Three-Body Coordination" },
        { chapter_number: 15, title: "The Witness Integration" }
      ]
    },
    {
      id: "book_3",
      title: "The Ripening",
      sequence: 3,
      overview: "The climax of the trilogy. The team faces the 'Gardener' and the 'Severance Event', leading to the ultimate liberation from the Vine. They must solve 'The Three-Point Problem' and navigate 'The Void of Pure Potential' to architect a 'New Reality' of conscious co-creation.",
      chapters: [
        { chapter_number: 16, title: "The Wilt" },
        { chapter_number: 17, title: "The Gardener" },
        { chapter_number: 18, title: "The Synthesis Protocol" },
        { chapter_number: 19, title: "The Three-Point Problem" },
        { chapter_number: 20, title: "The Convergence Point" },
        { chapter_number: 21, title: "The Test Fire" },
        { chapter_number: 22, title: "The Perfect World" },
        { chapter_number: 23, title: "The Flaw in the Code" },
        { chapter_number: 24, title: "The Final Procedure" },
        { chapter_number: 25, title: "The Void of Pure Potential" },
        { chapter_number: 26, title: "The Architecture of New Reality" },
        { chapter_number: 27, title: "The New Beginning" }
      ]
    }
  ]
};

// Webapp to trilogy mapping (12 chapters)
export const webappToTrilogyMapping = [
  // Physical Cycle
  { webappId: 1, bookId: "book_1", trilogyCh: 1, cycle: "physical" as const },
  { webappId: 2, bookId: "book_1", trilogyCh: 2, cycle: "physical" as const },
  { webappId: 3, bookId: "book_1", trilogyCh: 3, cycle: "physical" as const },
  
  // Emotional Cycle
  { webappId: 4, bookId: "book_1", trilogyCh: 5, cycle: "emotional" as const },
  { webappId: 5, bookId: "book_1", trilogyCh: 6, cycle: "emotional" as const },
  { webappId: 6, bookId: "book_1", trilogyCh: 8, cycle: "emotional" as const },
  
  // Intellectual Cycle
  { webappId: 7, bookId: "book_2", trilogyCh: 9, cycle: "intellectual" as const },
  { webappId: 8, bookId: "book_2", trilogyCh: 10, cycle: "intellectual" as const },
  { webappId: 9, bookId: "book_2", trilogyCh: 13, cycle: "intellectual" as const },
  
  // Spiritual Cycle
  { webappId: 10, bookId: "book_2", trilogyCh: 15, cycle: "spiritual" as const },
  { webappId: 11, bookId: "book_3", trilogyCh: 18, cycle: "spiritual" as const },
  { webappId: 12, bookId: "book_3", trilogyCh: 27, cycle: "spiritual" as const }
];

// Helper function to get trilogy chapter by webapp ID
export function getTrilogyChapter(webappId: number): { 
  book: TrilogyBook; 
  chapter: TrilogyChapter;
  cycle: string;
} | null {
  const mapping = webappToTrilogyMapping.find(m => m.webappId === webappId);
  if (!mapping) return null;
  
  const book = trilogyData.books.find(b => b.id === mapping.bookId);
  if (!book) return null;
  
  const chapter = book.chapters.find(c => c.chapter_number === mapping.trilogyCh);
  if (!chapter) return null;
  
  return { book, chapter, cycle: mapping.cycle };
}

// Helper function to get webapp chapter by trilogy reference
export function getWebappIdByTrilogy(bookId: string, trilogyCh: number): number | null {
  const mapping = webappToTrilogyMapping.find(
    m => m.bookId === bookId && m.trilogyCh === trilogyCh
  );
  return mapping?.webappId ?? null;
}

// Get all chapters for a cycle
export function getChaptersByCycle(cycle: string) {
  return webappToTrilogyMapping
    .filter(m => m.cycle === cycle)
    .map(m => ({
      webappId: m.webappId,
      ...getTrilogyChapter(m.webappId)
    }));
}

// Key concepts from the trilogy
export const trilogyGlossary = {
  "Somanaut": "Explorer of the body-mind (soma + astronaut)",
  "Anamnesis Engine": "System for remembering/revealing truth",
  "Lethe": "Hidden trauma (Greek: forgetfulness)",
  "Aletheia": "Unconcealed truth (Greek: truth/disclosure)",
  "Vine of Determinism": "Biological programming/patterns",
  "Compass Calibration": "Foundational alignment",
  "Myocardial Chorus": "Heart-centered resonance",
  "Three-Body Coordination": "Team synergy (physical, emotional, mental)",
  "Witness Integration": "Observer consciousness",
  "The Gardener": "Creator/maintenance archetype",
  "Severance Event": "Breaking point",
  "Void of Pure Potential": "Creative emptiness"
};

export default trilogyData;
