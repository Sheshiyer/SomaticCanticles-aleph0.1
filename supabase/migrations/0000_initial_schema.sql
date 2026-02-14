-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  google_id TEXT UNIQUE,
  birthdate TEXT, -- YYYY-MM-DD
  timezone TEXT DEFAULT 'UTC',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- CHAPTERS TABLE
CREATE TABLE public.chapters (
  id SERIAL PRIMARY KEY,
  "order" INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  cycle TEXT CHECK (cycle IN ('physical', 'emotional', 'intellectual', 'spiritual')),
  unlock_trigger TEXT,
  duration_minutes INTEGER,
  canticle_url TEXT,
  audio_url TEXT,
  icon_url TEXT,
  color_theme TEXT,
  description TEXT,
  content JSONB,
  unlock_conditions JSONB,
  lore_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Chapters
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapters are viewable by everyone" ON public.chapters
  FOR SELECT USING (true);

-- USER PROGRESS TABLE
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id INTEGER REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- RLS: User Progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- BIORHYTHM SNAPSHOTS
CREATE TABLE public.biorhythm_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  physical REAL,
  emotional REAL,
  intellectual REAL,
  spiritual REAL,
  physical_peak BOOLEAN DEFAULT false,
  emotional_peak BOOLEAN DEFAULT false,
  intellectual_peak BOOLEAN DEFAULT false,
  spiritual_peak BOOLEAN DEFAULT false,
  sunrise_time TEXT,
  sunset_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Biorhythm Snapshots
ALTER TABLE public.biorhythm_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own biorhythms" ON public.biorhythm_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own biorhythms" ON public.biorhythm_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- SUN CACHE (Global cache for sunrise/sunset)
CREATE TABLE public.sun_cache (
  id TEXT PRIMARY KEY, -- Composite key: lat,lng,date
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  date TEXT NOT NULL,
  sunrise TEXT,
  sunset TEXT,
  solar_noon TEXT,
  day_length TEXT,
  cached_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Sun Cache
ALTER TABLE public.sun_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sun cache is readable by everyone" ON public.sun_cache
  FOR SELECT USING (true);


-- STREAKS
CREATE TABLE public.streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  streak_type TEXT NOT NULL,
  current_count INTEGER DEFAULT 0,
  longest_count INTEGER DEFAULT 0,
  freezes_used INTEGER DEFAULT 0,
  last_activity_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Streaks
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);


-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- HIGHLIGHTS
CREATE TABLE public.highlights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id INTEGER REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  scene_index INTEGER NOT NULL,
  text TEXT NOT NULL,
  color TEXT DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Highlights
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own highlights" ON public.highlights
  USING (auth.uid() = user_id);

-- BOOKMARKS
CREATE TABLE public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id INTEGER REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  scene_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
  USING (auth.uid() = user_id);

-- TRIGGERS for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON public.streaks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
