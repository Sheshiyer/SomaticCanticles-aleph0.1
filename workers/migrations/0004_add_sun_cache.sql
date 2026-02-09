-- Migration: Add sun cache table for sunrise/sunset data
-- Created: 2024-03-20

-- Sun cache table for storing sunrise/sunset API responses
CREATE TABLE IF NOT EXISTS sun_cache (
  id TEXT PRIMARY KEY,  -- Format: lat,lng,date
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  date TEXT NOT NULL,
  sunrise TEXT,
  sunset TEXT,
  solar_noon TEXT,
  day_length TEXT,
  cached_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_sun_cache_location_date 
  ON sun_cache(latitude, longitude, date);

-- Index for cache expiration queries
CREATE INDEX IF NOT EXISTS idx_sun_cache_cached_at 
  ON sun_cache(cached_at);
