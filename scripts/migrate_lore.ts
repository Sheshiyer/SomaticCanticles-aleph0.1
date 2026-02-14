
// Scripts to generate SQL insert statements from JSON

const loreJson = await Deno.readTextFile("/Volumes/madara/2026/twc-vault/01-Projects/Somatic-Canticles/01_WORLD_BIBLE/00_CORE_FOUNDATION/somatic_canticles_lore_data.json");
const data = JSON.parse(loreJson);

const loreItems: any[] = [];

// 1. Key Concepts
if (data.core_foundation?.key_concepts) {
    for (const item of data.core_foundation.key_concepts) {
        loreItems.push({
            term: item.term,
            definition: item.definition,
            category: "concept",
            source: "world_bible_json"
        });
    }
}

// 2. Protocols (Tryambakam)
if (data.protocols?.tryambakam_protocol) {
    const proto = data.protocols.tryambakam_protocol;
    loreItems.push({
        term: "Tryambakam Protocol",
        definition: proto.description,
        category: "protocol",
        details: { phases: proto.phases, vectors: proto.vectors },
        source: "world_bible_json"
    });
}

// 3. Systems (13 Lenses)
if (data.systems?.lenses_13?.list) {
    for (const item of data.systems.lenses_13.list) {
        loreItems.push({
            term: item.name,
            definition: `Diagnostic Lens focusing on ${item.focus}.`,
            category: "system",
            details: item,
            source: "world_bible_json"
        });
    }
}

// 4. Cosmology
if (data.cosmology?.cosmic_trinity?.levels) {
    for (const level of data.cosmology.cosmic_trinity.levels) {
        loreItems.push({
            term: level.name,
            definition: `Level of consciousness corresponding to ${level.brain_system}`,
            category: "cosmology",
            details: level,
            source: "world_bible_json"
        });
    }
}

// 5. Technology (Ripening Stages)
if (data.technology?.ripening_stages) {
    for (const stage of data.technology.ripening_stages) {
        loreItems.push({
            term: stage.name,
            definition: stage.state,
            category: "stage",
            details: stage,
            source: "world_bible_json"
        });
    }
}

// 6. Factions (Galactic Cultures)
if (data.factions?.galactic_cultures) {
    for (const faction of data.factions.galactic_cultures) {
        loreItems.push({
            term: faction.name,
            definition: faction.principle,
            category: "faction",
            details: faction,
            source: "world_bible_json"
        });
    }
}

// 7. Characters
if (data.characters?.somanaut_team) {
    for (const char of data.characters.somanaut_team) {
        loreItems.push({
            term: char.name,
            definition: `${char.role}. Specialty: ${char.specialty}`,
            category: "character",
            details: char,
            source: "world_bible_json"
        });
    }
}

// Generate SQL
let sql = "-- Lore Migration SQL\n";
for (const item of loreItems) {
    const term = item.term.replace(/'/g, "''");
    const definition = item.definition ? `'${item.definition.replace(/'/g, "''")}'` : 'NULL';
    const source = item.source ? `'${item.source.replace(/'/g, "''")}'` : 'NULL';
    const details = item.details ? `'${JSON.stringify(item.details).replace(/'/g, "''")}'` : "'{}'::JSONB";
    const category = `'${item.category}'`;

    sql += `
INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('${term}', ${definition}, ${category}, ${details}, ${source})
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();
`;
}

await Deno.writeTextFile("scripts/lore_migration.sql", sql);
console.log(`Generated SQL for ${loreItems.length} items.`);
