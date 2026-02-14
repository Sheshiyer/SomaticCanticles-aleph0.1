-- Create Somatic Triggers Table (from INTERACTIVE_EXPERIENCE_DESIGN.md)
CREATE TABLE IF NOT EXISTS public.somatic_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id TEXT NOT NULL, -- "ch_13" format or integer reference if aligned
    text_id TEXT NOT NULL, -- e.g. "seg_045"
    base_text TEXT NOT NULL,
    variants JSONB NOT NULL DEFAULT '{}'::JSONB, -- { "sympathetic": "...", "parasympathetic": "..." }
    trigger_type TEXT NOT NULL, -- "circadian_rhythm", "scroll_velocity", "breath", "coherence"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for somatic_triggers
ALTER TABLE public.somatic_triggers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.somatic_triggers FOR SELECT TO public USING (true);
CREATE POLICY "Allow service role write access" ON public.somatic_triggers FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create Easter Eggs Table (from EASTER_EGGS_PLAN.md)
CREATE TABLE IF NOT EXISTS public.easter_eggs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- e.g. "The Tryambakam Acrostic"
    concept TEXT NOT NULL,
    execution_logic TEXT, -- Description of how it works technicaly
    trigger_condition TEXT, -- e.g. "Chapters 21-27 first letters"
    status TEXT NOT NULL DEFAULT 'concept' CHECK (status IN ('concept', 'planned', 'implemented', 'active')),
    metadata JSONB DEFAULT '{}'::JSONB, -- Store decoded messages, URLs, specific values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for easter_eggs
ALTER TABLE public.easter_eggs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.easter_eggs FOR SELECT TO public USING (true);
CREATE POLICY "Allow service role write access" ON public.easter_eggs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_somatic_chapter ON public.somatic_triggers(chapter_id);
CREATE INDEX IF NOT EXISTS idx_easter_eggs_status ON public.easter_eggs(status);
