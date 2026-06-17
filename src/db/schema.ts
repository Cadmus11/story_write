export const CREATE_STORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT NOT NULL DEFAULT '',
    cover_json TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    word_count INTEGER NOT NULL DEFAULT 0,
    char_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`

export const CREATE_INDEX_UPDATED_AT = `
  CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON stories(updated_at DESC);
`

export const CREATE_INDEX_CREATED_AT = `
  CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
`

export const CREATE_COLLECTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Collection',
    description TEXT NOT NULL DEFAULT '',
    cover_json TEXT,
    story_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`

export const CREATE_COLLECTION_STORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS collection_stories (
    collection_id TEXT NOT NULL,
    story_id TEXT NOT NULL,
    added_at TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, story_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
  );
`

export const ALL_SCHEMA_STATEMENTS = [
  CREATE_STORIES_TABLE,
  CREATE_COLLECTIONS_TABLE,
  CREATE_COLLECTION_STORIES_TABLE,
  CREATE_INDEX_UPDATED_AT,
  CREATE_INDEX_CREATED_AT,
]
