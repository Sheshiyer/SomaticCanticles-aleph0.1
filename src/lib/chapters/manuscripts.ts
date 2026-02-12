import fs from "fs";
import path from "path";

const CHAPTERS_DIR = path.join(process.cwd(), "chapters");

const MANUSCRIPT_MAPPING: Record<number, { book: string; file: string }> = {
    1: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-01-The-Choroid-Plexus.md" },
    2: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-02-Signal-Transduction.md" },
    3: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-03-The-Blood-Brain-Barrier.md" },
    4: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-04-The-Emperors-Genome.md" },
    5: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-05-The-Endocrine-Dogma.md" },
    6: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-06-The-Synaptic-Crossroads.md" },
    7: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-07-The-Breathfield-Weaver.md" },
    8: { book: "BOOK_1_ANAMNESIS_ENGINE", file: "Chapter-08-The-Compass-Calibration.md" },
    9: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-09-The-Sigil-Smith.md" },
    10: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-10-The-Debug-Protocol.md" },
    11: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-11-The-Avatar-Mutation.md" },
    12: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-12-The-Anamnesis-Engine.md" },
    13: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-13-The-Myocardial-Chorus.md" },
    14: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-14-The-Three-Body-Coordination.md" },
    15: { book: "BOOK_2_THE_MYOCARDIAL_CHORUS", file: "Chapter-15-The-Witness-Integration.md" },
    16: { book: "BOOK_3_THE_RIPENING", file: "Chapter-16-The-Wilt.md" },
    17: { book: "BOOK_3_THE_RIPENING", file: "Chapter-17-The-Gardener.md" },
    18: { book: "BOOK_3_THE_RIPENING", file: "Chapter-18-The-Synthesis-Protocol.md" },
    19: { book: "BOOK_3_THE_RIPENING", file: "Chapter-19-The-Three-Point-Problem.md" },
    20: { book: "BOOK_3_THE_RIPENING", file: "Chapter-20-The-Convergence-Point.md" },
    21: { book: "BOOK_3_THE_RIPENING", file: "Chapter-21-The-Test-Fire.md" },
    22: { book: "BOOK_3_THE_RIPENING", file: "Chapter-22-The-Perfect-World.md" },
    23: { book: "BOOK_3_THE_RIPENING", file: "Chapter-23-The-Flaw-in-the-Code.md" },
    24: { book: "BOOK_3_THE_RIPENING", file: "Chapter-24-The-Final-Procedure.md" },
    25: { book: "BOOK_3_THE_RIPENING", file: "Chapter-25-The-Void-of-Pure-Potential.md" },
    26: { book: "BOOK_3_THE_RIPENING", file: "Chapter-26-The-Architecture-of-New-Reality.md" },
    27: { book: "BOOK_3_THE_RIPENING", file: "Chapter-27-The-New-Beginning.md" },
};

import { ManuscriptScene, parseManuscriptIntoScenes } from "./manuscript-utils";

export { type ManuscriptScene, parseManuscriptIntoScenes };

export async function getManuscriptContent(chapterId: number): Promise<string | null> {
    const mapping = MANUSCRIPT_MAPPING[chapterId];
    if (!mapping) return null;

    const filePath = path.join(CHAPTERS_DIR, mapping.book, mapping.file);

    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`Manuscript file not found: ${filePath}`);
            return null;
        }
        return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
        console.error(`Error reading manuscript ${chapterId}:`, error);
        return null;
    }
}

export function getManuscriptInfo(chapterId: number) {
    return MANUSCRIPT_MAPPING[chapterId] || null;
}
