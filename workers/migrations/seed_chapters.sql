-- Seed chapters with manuscript content
-- Run with: wrangler d1 execute somatic-canticles-db --env production --remote --file=./migrations/seed_chapters.sql

-- Clear existing data (if any)
DELETE FROM user_progress;
DELETE FROM chapters;

-- Insert Chapter 1: The Choroid Plexus
INSERT INTO chapters (id, "order", title, subtitle, cycle, unlock_trigger, duration_minutes, canticle_url, audio_url, icon_url, color_theme, description, content, unlock_conditions, lore_metadata, created_at) 
VALUES (
  1, 1, 'The Choroid Plexus', 'The Fluid Self', 'physical', 'registration_complete', 16,
  '/canticles/01-the-fluid-self.mp3', '/audio/chapters/01-choroid-plexus.mp3', '/icons/chapters/fluid-self.svg', 'ember',
  'Establish the foundation of body awareness through the image of clear, flowing cerebrospinal fluid. Based on Book 1, Chapter 1.',
  '{"intro":{"title":"The Fluid Self","text":"Welcome to the sanctuary of your cerebrospinal fluid. This chapter draws from the moment when Dr. Sona Vireth first heard the weeping frequency beneath the chaos—the authentic signal calling for witness beneath every trauma scream.","duration_minutes":2},"story_context":{"excerpt":"The datascapes of the choroid plexus were screaming...","somatic_event":"Witnessing a full-system Khalorēē rejection event","character_focus":"Dr. Sona Vireth","key_insight":"Beneath every scream of trauma, there is a weeping frequency"},"practice":{"title":"CSF Flow Awareness","duration_minutes":8,"preparation":"Find a comfortable seated position","steps":["Close your eyes","Visualize cerebrospinal fluid","Notice the rhythm","Breathe into turbulence","Rest in the flow"],"closing":"Return awareness to your body"},"reflection":{"prompts":["What areas feel blocked?","Where do you need better flow?"],"journal_suggestion":"Draw your inner waterscape"},"canticle":{"title":"The Fluid Self","duration_minutes":8,"soundscape":"Flowing water, crystal bowls","intention":"Establish body awareness through fluid imagery"}}',
  '{"type":"automatic","description":"Unlocked upon registration"}',
  '{"power_number":1,"element":"water","tarot":"The Magician","trilogy_source":{"book":1,"chapter":1},"character_focus":"Dr. Sona Vireth","key_concept":"Khalorēē rejection event"}',
  datetime('now')
);

-- Insert minimal chapters (2-12) with basic info
INSERT INTO chapters (id, "order", title, subtitle, cycle, unlock_trigger, duration_minutes, canticle_url, color_theme, description, unlock_conditions, created_at) VALUES
  (2, 2, 'Signal Transduction', 'Signal Songs', 'physical', 'high_physical_sustained', 18, '/canticles/02-signal-songs.mp3', 'ember', 'Attune to the body''s signaling system', '{"type":"biorhythm","physical":{"min":0.5},"description":"Physical cycle above 50%"}', datetime('now')),
  (3, 3, 'The Blood-Brain Barrier', 'The Barrier Gates', 'physical', 'physical_peak', 20, '/canticles/03-barrier-gates.mp3', 'ember', 'Establish healthy boundaries', '{"type":"biorhythm","physical":{"peak":true},"description":"Physical cycle at peak"}', datetime('now')),
  (4, 4, 'The Endocrine Dogma', 'Chemical Messengers', 'emotional', 'emotional_unlock_available', 22, '/canticles/04-chemical-messengers.mp3', 'ocean', 'Harmonize with endocrine wisdom', '{"type":"biorhythm","emotional":{"min":0.4},"description":"Emotional cycle above 40%"}', datetime('now')),
  (5, 5, 'The Synaptic Crossroads', 'Crossroads', 'emotional', 'emotional_peak', 24, '/canticles/05-crossroads.mp3', 'ocean', 'Embody the power of choice', '{"type":"biorhythm","emotional":{"peak":true},"description":"Emotional cycle at peak"}', datetime('now')),
  (6, 6, 'The Compass Calibration', 'Calibration', 'emotional', 'emotional_flow_state', 26, '/canticles/06-calibration.mp3', 'ocean', 'Establish internal compass', '{"type":"biorhythm","emotional":{"min":0.3,"max":0.7},"description":"Emotional cycle balanced"}', datetime('now')),
  (7, 7, 'The Sigil Smith', 'Sigil Sounds', 'intellectual', 'intellectual_unlock_available', 20, '/canticles/07-sigil-sounds.mp3', 'solar', 'Encode transformation subconsciously', '{"type":"biorhythm","intellectual":{"min":0.4},"description":"Intellectual cycle above 40%"}', datetime('now')),
  (8, 8, 'The Debug Protocol', 'Debug Mode', 'intellectual', 'intellectual_peak', 22, '/canticles/08-debug-mode.mp3', 'solar', 'Apply technical precision', '{"type":"biorhythm","intellectual":{"peak":true},"description":"Intellectual cycle at peak"}', datetime('now')),
  (9, 9, 'The Myocardial Chorus', 'Heart Resonance', 'intellectual', 'intellectual_flow_state', 24, '/canticles/09-heart-resonance.mp3', 'solar', 'Experience heart resonance', '{"type":"biorhythm","intellectual":{"min":0.3,"max":0.7},"description":"Intellectual cycle balanced"}', datetime('now')),
  (10, 10, 'The Witness Integration', 'The Witness', 'spiritual', 'spiritual_unlock_available', 26, '/canticles/10-the-witness.mp3', 'lunar', 'Stabilize integrated witness', '{"type":"biorhythm","spiritual":{"min":0.4},"description":"Spiritual cycle above 40%"}', datetime('now')),
  (11, 11, 'The Synthesis Protocol', 'Synthesis', 'spiritual', 'spiritual_peak', 28, '/canticles/11-synthesis.mp3', 'lunar', 'Integrate all four cycles', '{"type":"biorhythm","spiritual":{"peak":true},"description":"Spiritual cycle at peak"}', datetime('now')),
  (12, 12, 'The New Beginning', 'New Beginning', 'spiritual', 'spiritual_peak_sustained', 30, '/canticles/12-new-beginning.mp3', 'lunar', 'Inaugurate the new cycle', '{"type":"biorhythm","spiritual":{"peak":true,"sustained_days":3},"description":"Spiritual peak for 3 days"}', datetime('now'));

-- Verify insertion
SELECT COUNT(*) as total_chapters FROM chapters;
