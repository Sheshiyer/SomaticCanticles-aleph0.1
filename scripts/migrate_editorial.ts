
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as dotenv from "https://deno.land/x/dotenv/mod.ts";

// Load env
const env = dotenv.config({ path: ".env.local" });
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || env.NEXT_PUBLIC_SUPABASE_URL; // Use NEXT_PUBLIC if SUPABASE_URL missing
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || env.SUPABASE_SECRET_KEY; // Use SECRET if SERVICE missing

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase credentials.");
    console.log("URL:", SUPABASE_URL);
    console.log("KEY present:", !!SUPABASE_SERVICE_ROLE_KEY);
    Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 1. Easter Eggs Data from EASTER_EGGS_PLAN.md
const easterEggs = [
    {
        name: "The Tryambakam Acrostic",
        concept: "The first letter of the final 7 chapters (Chapters 21-27) spells out a hidden command: CONNECT or WITNESS.",
        execution_logic: "Check first letters of chapter titles 21-27.",
        trigger_condition: "Reading Chapters 21-27",
        status: "planned",
        metadata: { "target_word": "CONNECT" }
    },
    {
        name: "The Binary Heartbeat",
        concept: "Jian’s terminal displays a raw data stream. Translating binary to ASCII reads 'I AM LISTENING'.",
        execution_logic: "Binary string in Chapter 13 terminal view.",
        trigger_condition: " decoding binary in Ch 13",
        status: "planned",
        metadata: { "decoded_message": "I AM LISTENING" }
    },
    {
        name: "The Ghost URL",
        concept: "A footnote references a legacy archive. URL leads to a real-world landing page.",
        execution_logic: "Hidden link in footnote.",
        trigger_condition: "Clicking hidden link",
        status: "planned",
        metadata: { "url": "www.witness-os.org/severance" }
    },
    {
        name: "The Gardener's Redactions",
        concept: "Redacted words in Preface/Intro are visible when highlighting.",
        execution_logic: "CSS styling for redacted text that reveals on hover/select.",
        trigger_condition: "Highlighting redacted text",
        status: "planned"
    },
    {
        name: "The Bio-Hacker Nootropic Stack",
        concept: "Sona's tea blend in Ch 7 is a real adaptogen recipe.",
        execution_logic: "Publish recipe in backmatter.",
        trigger_condition: "Reading Ch 7 / Backmatter",
        status: "planned"
    },
    {
        name: "The 432Hz ISBN",
        concept: "ISBN-13 digits sum to 27 or barcode resembles waveform.",
        execution_logic: "Visual design of barcode.",
        trigger_condition: "Scanning ISBN",
        status: "concept"
    },
    {
        name: "The Errata Slip",
        concept: "Fake errata slip correcting reality.",
        execution_logic: "Physical insert or digital popup on load.",
        trigger_condition: "Opening book/app",
        status: "concept"
    },
    {
        name: "The Mirror Chapters",
        concept: "Chapter 12 and 25 have exact same word count.",
        execution_logic: "Editorial constraint.",
        trigger_condition: "Word count analysis",
        status: "concept"
    },
    {
        name: "The Living Page Numbers",
        concept: "Page numbers glitch during Severance Event (Ch 24).",
        execution_logic: "Dynamic page numbering component.",
        trigger_condition: "Reading Ch 24",
        status: "planned"
    },
    {
        name: "The Hidden Weaver",
        concept: "A silent figure ('Aletheos') appears in background of 3 scenes.",
        execution_logic: "Textual inclusion.",
        trigger_condition: "Reading specific scenes",
        status: "planned"
    }
];

// 2. Terminology Check from EDITORIAL_BRIEF.md
const keyTerms = [
    { term: "Khalorēē", definition: "The bio-metabolic reserve of awareness. (Not 'Calorie')", category: "concept" },
    { term: "NOESIS", definition: "The operating system of consciousness.", category: "system" },
    { term: "Prana", definition: "Vital energy.", category: "concept" },
    { term: "Somanaut", definition: "A consciousness explorer.", category: "character" }, // or role
    { term: "The Vine", definition: "Deterministic structure.", category: "entity" },
    { term: "The Gardener", definition: "Antagonist. Conservational force.", category: "character" }
];

console.log("Migrating Easter Eggs...");
for (const egg of easterEggs) {
    const { error } = await supabase
        .from('easter_eggs')
        .upsert(egg, { onConflict: 'name' });
    
    if (error) console.error(`Error upserting egg ${egg.name}:`, error);
    else console.log(`Upserted egg: ${egg.name}`);
}

console.log("Verifying Key Terms...");
for (const item of keyTerms) {
    // Check if exists
    const { data: existing, error: fetchError } = await supabase
        .from('lore')
        .select('id, term')
        .eq('term', item.term)
        .single();
    
    if (!existing) {
        console.log(`Term '${item.term}' missing. Inserting...`);
        const { error: insertError } = await supabase
            .from('lore')
            .insert({ ...item, source: 'editorial_brief' });
        
        if (insertError) console.error(`Error inserting term ${item.term}:`, insertError);
        else console.log(`Inserted term: ${item.term}`);
    } else {
        console.log(`Term '${item.term}' exists.`);
    }
}

console.log("Done.");
