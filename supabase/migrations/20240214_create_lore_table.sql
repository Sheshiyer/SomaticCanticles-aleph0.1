-- Create Lore Table
CREATE TABLE IF NOT EXISTS public.lore (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    term TEXT NOT NULL UNIQUE,
    definition TEXT,
    category TEXT NOT NULL CHECK (category IN ('concept', 'protocol', 'system', 'cosmology', 'technology', 'faction', 'character', 'language', 'history', 'institution', 'framework')),
    details JSONB DEFAULT '{}'::JSONB,
    source TEXT DEFAULT 'system',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lore ENABLE ROW LEVEL SECURITY;

-- Create Policy for Read Access (Public)
CREATE POLICY "Allow public read access" ON public.lore
    FOR SELECT TO public
    USING (true);

-- Create Policy for Write Access (Service Role Only)
CREATE POLICY "Allow service role write access" ON public.lore
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create index on term for fast lookups
CREATE INDEX IF NOT EXISTS idx_lore_term ON public.lore(term);
CREATE INDEX IF NOT EXISTS idx_lore_category ON public.lore(category);
