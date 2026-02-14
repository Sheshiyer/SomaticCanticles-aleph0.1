-- Lore Migration SQL

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Noesis', 'Participatory Awareness. The universe as a field of awareness where observation influences outcomes.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('The Entropy Plague', 'A self-replicating information virus feeding on fragmented awareness, creating the ''Vine of Determinism''.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('The Severance Sequence', 'The 4-phase protocol to liberate a subject: Insertion, Mapping, Anamnesis, Egress.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Authorship Sovereignty', 'The state where an individual becomes the ''Architect'' of their reality field, not just a character.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Tzimtzum', 'Metabolic Contraction. A defensive compression of awareness into a high-density ''Seed State''.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Amrita', 'Synthesized metabolic carrier fluid that increases informatic conductivity for the Severance Event.', 'concept', '{}'::JSONB, 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Tryambakam Protocol', 'The Technical Veda; schematic for the Anamnesis Engine to liberate awareness.', 'protocol', '{"phases":[{"phase":"1. Tryambakaṃ","technical_name":"The Three-Eyes","goal":"Activating the Triangulation Engine (Psychē/Bios/Hylē)."},{"phase":"2. Puṣṭivardhanam","technical_name":"The Ripening","goal":"Increasing Awareness Charge via metabolic support."},{"phase":"3. Bandhanan","technical_name":"The Vine","goal":"Identifying the site of Deterministic Bonding (Trauma)."},{"phase":"4. Mā''mṛtāt","technical_name":"The Severance","goal":"Executing the Leap of Authorship into the Source."}],"vectors":{"standard":[{"name":"Soma Vector","definition":"The uncorrupted ''God-Code'' of the soul."},{"name":"Manas Interface","definition":"The present active witness capacity (Team)."},{"name":"Muladhara Terminus","definition":"The physical grounding point."}],"severance_event":[{"name":"Pure Joy (The Note)","holder":"Dr. Sona Vireth","definition":"Unconditional joy as substrate."},{"name":"Catalyst Clarity (The Bell)","holder":"Dr. Corvan Luminth","definition":"Witnessing the trauma without interpretation."},{"name":"Present Coherence","holder":"Gideon Seter","definition":"Complete team unity preventing fragmentation."}]}}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Vimshottari Dasha', 'Diagnostic Lens focusing on Karmic Timing.', 'system', '{"id":1,"name":"Vimshottari Dasha","focus":"Karmic Timing"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Nakshatra Engine', 'Diagnostic Lens focusing on Stellar Resonance.', 'system', '{"id":2,"name":"Nakshatra Engine","focus":"Stellar Resonance"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Chakra-Kosha', 'Diagnostic Lens focusing on Bio-Energetic Flow.', 'system', '{"id":3,"name":"Chakra-Kosha","focus":"Bio-Energetic Flow"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('TCM Organ Clock', 'Diagnostic Lens focusing on Biological Periodicity.', 'system', '{"id":4,"name":"TCM Organ Clock","focus":"Biological Periodicity"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Human Design', 'Diagnostic Lens focusing on Decision Mechanics.', 'system', '{"id":5,"name":"Human Design","focus":"Decision Mechanics"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Gene Keys', 'Diagnostic Lens focusing on Frequency Mutation.', 'system', '{"id":6,"name":"Gene Keys","focus":"Frequency Mutation"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Enneagram', 'Diagnostic Lens focusing on Ego-Architecture.', 'system', '{"id":7,"name":"Enneagram","focus":"Ego-Architecture"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Tarot', 'Diagnostic Lens focusing on Archetypal Process.', 'system', '{"id":8,"name":"Tarot","focus":"Archetypal Process"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Numerology', 'Diagnostic Lens focusing on Geometric Resonance.', 'system', '{"id":9,"name":"Numerology","focus":"Geometric Resonance"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Biorhythm Engine', 'Diagnostic Lens focusing on Bio-Physical Cycles.', 'system', '{"id":10,"name":"Biorhythm Engine","focus":"Bio-Physical Cycles"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('HRV Integration', 'Diagnostic Lens focusing on Heart Coherence.', 'system', '{"id":11,"name":"HRV Integration","focus":"Heart Coherence"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Biofield Viewer', 'Diagnostic Lens focusing on Signal Stability.', 'system', '{"id":12,"name":"Biofield Viewer","focus":"Signal Stability"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('The New Beginning', 'Diagnostic Lens focusing on Narrative Authorship.', 'system', '{"id":13,"name":"The New Beginning","focus":"Narrative Authorship"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Immanence', 'High Entropy (Autopilot)', 'stage', '{"stage":1,"name":"Immanence","archetype":"The Sleepwalker","state":"High Entropy (Autopilot)"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Lethe', 'The Fog (Redaction)', 'stage', '{"stage":2,"name":"Lethe","archetype":"The Forgotten","state":"The Fog (Redaction)"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Noesis', 'Awareness of the Field', 'stage', '{"stage":3,"name":"Noesis","archetype":"The Seeker","state":"Awareness of the Field"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Anamnesis', 'Recovery of Truth', 'stage', '{"stage":4,"name":"Anamnesis","archetype":"The Witness","state":"Recovery of Truth"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Aletheia', 'Restored Logic', 'stage', '{"stage":5,"name":"Aletheia","archetype":"The Architect","state":"Restored Logic"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Severance', 'Breaking the Vine', 'stage', '{"stage":6,"name":"Severance","archetype":"The Liberator","state":"Breaking the Vine"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Authorship', 'The New Beginning', 'stage', '{"stage":7,"name":"Authorship","archetype":"The Source","state":"The New Beginning"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Sahasrara Galaxy', 'Reality is structured and mappable.', 'faction', '{"name":"Sahasrara Galaxy","sectors":"The Crown Sectors","tradition":"Vedic Systematics","house":"House Quoril (The Architects)","principle":"Reality is structured and mappable.","focus":"Neuro-cartography, systematic mapping, higher-order logic.","vessel":"Manas Yantra"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Ajna Galaxy', 'The Way flows naturally.', 'faction', '{"name":"Ajna Galaxy","sectors":"The Third Eye Sectors","tradition":"Daoist Flow Dynamics","house":"House Luminth (The Weavers)","principle":"The Way flows naturally.","focus":"Narrative vision, light-weaving, observation without interference.","vessel":"Yìshí Qìxiè"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Anahata Galaxy', 'Reality is resonant and harmonious.', 'faction', '{"name":"Anahata Galaxy","sectors":"The Heart Sectors","tradition":"Sufi Resonance","house":"House Vireth (The Alchemists)","principle":"Reality is resonant and harmonious.","focus":"Emotional attunement, frequency alignment, bio-acoustic engineering.","vessel":"Adawat al-Wa''i"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Muladhara Galaxy', 'Reality is structured and must be defended.', 'faction', '{"name":"Muladhara Galaxy","sectors":"The Root Sectors","tradition":"Kabbalistic Tzimtzum","house":"House Seter (The Guardians)","principle":"Reality is structured and must be defended.","focus":"Boundary maintenance, defensive shielding, atomic density.","vessel":"Klei Toda''ah"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Manipura Galaxy', 'Reality is transformed by Will.', 'faction', '{"name":"Manipura Galaxy","sectors":"The Fire Networks","tradition":"Yogic Transformation","principle":"Reality is transformed by Will.","focus":"Power dynamics, transformation, rapid evolution.","vessel":"Agni Yantra"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Svadhishthana Galaxy', 'Reality is fluid and adaptable.', 'faction', '{"name":"Svadhishthana Galaxy","sectors":"The Water Collective","tradition":"Tantric Fluidity","principle":"Reality is fluid and adaptable.","focus":"Creativity, flow states, emotional processing.","vessel":"Jala Yantra"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Vishuddha Galaxy', 'Reality is created through Speech.', 'faction', '{"name":"Vishuddha Galaxy","sectors":"The Communication Grid","tradition":"Hermetic Expression","principle":"Reality is created through Speech.","focus":"Communication protocols, truth-telling, code.","vessel":"Vak Yantra"}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Dr. Jian Quoril', 'The Neuro-Cartographer. Specialty: Somatic Datascape Mapping & Resonance Topology', 'character', '{"name":"Dr. Jian Quoril","role":"The Neuro-Cartographer","house":"House Quoril","enneagram":"Type 5 - The Investigator","specialty":"Somatic Datascape Mapping & Resonance Topology","psychology":"Finds security in knowledge; views emotion as unreliable data.","arc_summary":"From Rigid Logic to Integrated Wisdom.","arcs":{"book_1":"Grudgingly accepts limits of logic; integrates qualitative data.","book_2":"Evolves ''system'' definition to include paradox; maps emotional topology.","book_3":"Refuses ''Certainty''; chooses ''Aliveness''. Holds Manas Interface as moving constellation."}}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Gideon Seter', 'The Systems Immunologist. Specialty: Bio-Threat Assessment & Tzimtzum Compression Shielding', 'character', '{"name":"Gideon Seter","role":"The Systems Immunologist","house":"House Seter","enneagram":"Type 8 - The Challenger","specialty":"Bio-Threat Assessment & Tzimtzum Compression Shielding","psychology":"Decisive, grounded, protective. Binary worldview: threat/non-threat.","arc_summary":"From Protector to Guardian.","arcs":{"book_1":"Learns to use strength as container (space-holding) rather than shield.","book_2":"Learns discerning vulnerability for internal healing.","book_3":"Refuses ''Safety''; chooses ''Growth''. Holds Coherence Vector."}}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Dr. Sona Vireth', 'The Bio-Acoustic Engineer. Specialty: Metabolic Emergence & Emotional Frequency Analysis', 'character', '{"name":"Dr. Sona Vireth","role":"The Bio-Acoustic Engineer","house":"House Vireth","enneagram":"Type 4 - The Individualist","specialty":"Metabolic Emergence & Emotional Frequency Analysis","psychology":"Deeply empathetic, intuitive, creative. Feels everything.","arc_summary":"From Emotional Container to Resonant Channel.","arcs":{"book_1":"Differentiates empathy from identification. Validates intuitive data.","book_2":"Masters Coherence Cultivation; becomes active lighthouse.","book_3":"Refuses ''Peace'' (Anesthesia); chooses ''Depth''. Holds Note Vector (Joy)."}}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();

INSERT INTO public.lore (term, definition, category, details, source)
VALUES ('Dr. Corvan Luminth', 'The Psycho-Pathologist & Team Lead. Specialty: Aletheia Mapping & Narrative Diagnostics', 'character', '{"name":"Dr. Corvan Luminth","role":"The Psycho-Pathologist & Team Lead","house":"House Luminth","enneagram":"Type 9 - The Peacemaker","specialty":"Aletheia Mapping & Narrative Diagnostics","psychology":"Calm, patient, holistic thinker. Seeks harmony.","arc_summary":"From Passive Witness to Active Alchemist.","arcs":{"book_1":"Accepts burden of authorship; edits rather than just interpreting.","book_2":"Masters holding space for conflict; reality as dialogue.","book_3":"Refuses ''Perfect Meaning''; chooses ''Reality''. Holds Bell Vector (Clarity)."}}', 'world_bible_json')
ON CONFLICT (term) DO UPDATE SET
    definition = EXCLUDED.definition,
    category = EXCLUDED.category,
    details = EXCLUDED.details,
    source = EXCLUDED.source,
    updated_at = now();
