
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";

// Load environment variables
const env = await load({ allowEmptyValues: true, examplePath: null });
const SUPABASE_URL = env["SUPABASE_URL"] || Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"] || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface LoreCandidate {
  path: string;
  category: string;
  cycle?: "physical" | "emotional" | "intellectual" | "spiritual";
  achievement_id?: string;
  tags: string[];
}

// Manually mapped candidates from content_inventory.md - VERIFIED PATHS
const CANDIDATES: LoreCandidate[] = [
  // TERRAIN & CULTURE
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/01_SEVEN_GALACTIC_CULTURES.md", category: "Culture", tags: ["history", "sociology"], achievement_id: "Historian" },
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/04_TAROT_BIOLOGICAL_EVENT_MAP.md", category: "Terrain", tags: ["mapping", "events"], achievement_id: "Cartographer" },

  // PROTOCOLS
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/00_GALACTIC_FEDERATION_CHARTER.md", category: "Protocol", tags: ["law", "federation"] },
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/01_GALACTIC_FEDERATION_TRANSFORMATION_PLAN.md", category: "Protocol", tags: ["strategy", "federation"] },
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/02_QUANTUM_AWARENESS_INTEGRATION.md", category: "Science", tags: ["quantum", "consciousness"], cycle: "intellectual" },
  { path: ".docs/01_WORLD_BIBLE/04_WORLD_BUILDING/03_QUANTUM_SIGIL_INTEGRATION.md", category: "Tech", tags: ["sigils", "technology"], cycle: "intellectual" },

  // BIO-ENGINEERING
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Consciousness_Compression_Patterns.md", category: "Bio-Eng", tags: ["compression", "data"], achievement_id: "Bio-Hacker" },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Consciousness_Elevation_Paths.md", category: "Bio-Eng", tags: ["elevation", "evolution"], achievement_id: "Bio-Hacker" },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Dehydration_Protocols.md", category: "Bio-Eng", tags: ["dehydration", "maintenance"], cycle: "physical" },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Evolutionary_Possibility_Matrix.md", category: "Bio-Eng", tags: ["evolution", "probability"] },

  // INTERFACES
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Character_Awareness_Systems.md", category: "Interface", tags: ["ui", "awareness"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Crystallization_Interfaces.md", category: "Interface", tags: ["crystallization", "ui"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Emergence_Visualization_Interfaces.md", category: "Interface", tags: ["visualization", "ui"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Meta_Awareness_Interfaces.md", category: "Interface", tags: ["meta", "ui"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Meta_Narrative_Interfaces.md", category: "Interface", tags: ["narrative", "ui"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Observation_Field_Interfaces.md", category: "Interface", tags: ["observation", "ui"], cycle: "intellectual" },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Quantum_Debugging_Interfaces.md", category: "Interface", tags: ["debugging", "ui"], cycle: "intellectual" },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Stability_Maintenance_Interfaces.md", category: "Interface", tags: ["stability", "ui"], cycle: "emotional" },

  // PHASE 3 - PROTOCOLS & RITUALS (Note: Some 01_PROTOCOLS... files might be missing or misplaced, checking find output...)
  // AZTEC, KABBALISTIC, NORDIC, TRYAMBAKAM were NOT in the find output. They might be in a different folder or deleted.
  // Converting the paths that ARE confirmed in the find output or skipping.
  // Confirmed in find output:
  // - 03_TECHNOLOGY/Bio_Engineering/Evolutionary_Trajectories.md
  // - 03_TECHNOLOGY/Bio_Engineering/Orbital_Consciousness_Tracking_Systems.md
  // - 03_TECHNOLOGY/Consciousness_Interfaces/State_Management_Interfaces.md
  // - 03_TECHNOLOGY/Consciousness_Interfaces/Transformation_Interfaces.md
  // - 05_VISUALIZATIONS/01_KHALOREE_SYSTEMS.md
  // - 05_VISUALIZATIONS/02_TECHNOLOGY_MAP.md
  
  // Adding confirmed files only:
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Evolutionary_Trajectories.md", category: "Bio-Eng", tags: ["future", "evolution"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Bio_Engineering/Orbital_Consciousness_Tracking_Systems.md", category: "Tech", tags: ["satellite", "tracking"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/State_Management_Interfaces.md", category: "Tech", tags: ["state", "management"] },
  { path: ".docs/01_WORLD_BIBLE/03_TECHNOLOGY/Consciousness_Interfaces/Transformation_Interfaces.md", category: "Interface", tags: ["transformation", "ui"] },
  { path: ".docs/01_WORLD_BIBLE/05_VISUALIZATIONS/01_KHALOREE_SYSTEMS.md", category: "Core", tags: ["visuals", "systems"] },
  { path: ".docs/01_WORLD_BIBLE/05_VISUALIZATIONS/02_TECHNOLOGY_MAP.md", category: "Tech", tags: ["map", "roadmap"], cycle: "intellectual" },
];



async function migrate() {
  console.log(`🚀 Starting migration of ${CANDIDATES.length} lore documents...`);

  for (const candidate of CANDIDATES) {
    try {
      const fullPath = `${Deno.cwd()}/${candidate.path}`;
      const content = await Deno.readTextFile(fullPath);
      
      // Extract title from first line or filename
      const lines = content.split('\n');
      const title = lines[0].startsWith('# ') 
        ? lines[0].replace('# ', '').trim() 
        : candidate.path.split('/').pop()?.replace('.md', '').replace(/_/g, ' ') || "Untitled";

      // Insert into DB
      const { error } = await supabase
        .from('lore')
        .upsert({
          title: title,
          content: content,
          category: candidate.category,
          tags: candidate.tags,
          cycle: candidate.cycle || null,
          achievement_id: candidate.achievement_id || null,
          source_path: candidate.path,
          updated_at: new Date().toISOString()
        }, { onConflict: 'title' });

      if (error) {
        console.error(`❌ Failed to migrate ${candidate.path}:`, error.message);
      } else {
        console.log(`✅ Migrated: ${title}`);
      }

    } catch (err) {
      console.error(`⚠️ Error reading/processing ${candidate.path}:`, err.message);
    }
  }

  console.log("✨ Migration complete!");
}

migrate();
