-- Transform lore table to support both Glossary and Long-form Articles
ALTER TABLE public.lore
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'glossary' CHECK (type IN ('glossary', 'article'));

-- Make existing glossary columns optional for articles
ALTER TABLE public.lore ALTER COLUMN term DROP NOT NULL;
ALTER TABLE public.lore ALTER COLUMN definition DROP NOT NULL;

-- Create index for title search
CREATE INDEX IF NOT EXISTS idx_lore_title ON public.lore(title);
CREATE INDEX IF NOT EXISTS idx_lore_type ON public.lore(type);
