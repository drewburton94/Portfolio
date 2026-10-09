-- Editable site content: one JSON document per key (about, projects, history, ...).
CREATE TABLE IF NOT EXISTS content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Privacy-friendly analytics: no cookies, no IP addresses stored.
-- vid is a salted hash that changes every day, so it can count unique visitors
-- within a day but cannot track anyone across days.
CREATE TABLE IF NOT EXISTS events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,
  type    TEXT NOT NULL,   -- pageview | section | project | click | chat
  name    TEXT,
  ref     TEXT,            -- referrer host (pageview only)
  country TEXT,
  device  TEXT,            -- mobile | tablet | desktop
  vid     TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts);
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events (type, ts);

-- Tiny fixed-window rate limiter (login attempts, chat, analytics).
CREATE TABLE IF NOT EXISTS rate (
  key   TEXT PRIMARY KEY,
  n     INTEGER NOT NULL,
  start INTEGER NOT NULL
);
