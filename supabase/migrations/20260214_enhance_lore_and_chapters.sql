-- Add metadata columns to lore table
ALTER TABLE public.lore 
ADD COLUMN IF NOT EXISTS cycle TEXT CHECK (cycle IN ('physical', 'emotional', 'intellectual', 'spiritual')),
ADD COLUMN IF NOT EXISTS achievement_id TEXT,
ADD COLUMN IF NOT EXISTS unlock_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS source_path TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lore_cycle ON public.lore(cycle);
CREATE INDEX IF NOT EXISTS idx_lore_achievement ON public.lore(achievement_id);

-- Update Chapters 13-27 with cycles (Book 2 & 3)
-- Book 2
UPDATE public.chapters SET cycle = 'physical' WHERE id IN (13, 14, 15);
UPDATE public.chapters SET cycle = 'emotional' WHERE id IN (16, 17, 18);

-- Book 3
UPDATE public.chapters SET cycle = 'intellectual' WHERE id IN (19, 20, 21);
UPDATE public.chapters SET cycle = 'spiritual' WHERE id IN (22, 23, 24);
-- For the final chapters, we map to spiritual as 'Void/Unity' falls under this umbrella in the current schema constraint
UPDATE public.chapters SET cycle = 'spiritual' WHERE id IN (25, 26, 27);
