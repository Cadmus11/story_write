import * as SQLite from 'expo-sqlite'
import { ALL_SCHEMA_STATEMENTS } from './schema'
import type { Story, Collection } from 'src/types'

let db: SQLite.SQLiteDatabase | null = null

export async function initDatabase(): Promise<void> {
  if (db) return
  db = await SQLite.openDatabaseAsync('storywrite.db')
  for (const stmt of ALL_SCHEMA_STATEMENTS) {
    await db.execAsync(stmt)
  }
}

function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

export async function getAllStories(sortBy: string = 'updated_at'): Promise<Story[]> {
  const database = getDb()
  const rows = await database.getAllAsync<Story>(
    `SELECT * FROM stories ORDER BY ${sortBy} DESC`
  )
  return rows
}

export async function getStoryById(id: string): Promise<Story | null> {
  const database = getDb()
  const row = await database.getFirstAsync<Story>(
    'SELECT * FROM stories WHERE id = ?',
    [id]
  )
  return row ?? null
}

export async function insertStory(story: Story): Promise<void> {
  const database = getDb()
  await database.runAsync(
    `INSERT INTO stories (id, title, content, cover_json, status, word_count, char_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      story.id,
      story.title,
      story.content,
      story.cover_json,
      story.status,
      story.word_count,
      story.char_count,
      story.created_at,
      story.updated_at,
    ]
  )
}

export async function updateStory(
  story: Partial<Story> & { id: string }
): Promise<void> {
  const database = getDb()
  const fields: string[] = []
  const values: (string | number | null)[] = []

  const allowedFields: (keyof Story)[] = [
    'title', 'content', 'cover_json', 'status', 'word_count', 'char_count', 'updated_at',
  ]

  for (const field of allowedFields) {
    if (field in story) {
      fields.push(`${field} = ?`)
      const val = story[field as keyof Story]
      values.push(val !== undefined ? (val as string | number | null) : null)
    }
  }

  if (fields.length === 0) return

  values.push(story.id)
  await database.runAsync(
    `UPDATE stories SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

export async function deleteStory(id: string): Promise<void> {
  const database = getDb()
  await database.runAsync('DELETE FROM stories WHERE id = ?', [id])
}

export async function getAllCollections(): Promise<Collection[]> {
  const database = getDb()
  const rows = await database.getAllAsync<Collection>(
    'SELECT * FROM collections ORDER BY updated_at DESC'
  )
  return rows
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const database = getDb()
  const row = await database.getFirstAsync<Collection>(
    'SELECT * FROM collections WHERE id = ?',
    [id]
  )
  return row ?? null
}

export async function getStoriesInCollection(collectionId: string): Promise<Story[]> {
  const database = getDb()
  const rows = await database.getAllAsync<Story>(
    `SELECT s.* FROM stories s
     JOIN collection_stories cs ON cs.story_id = s.id
     WHERE cs.collection_id = ?
     ORDER BY cs.sort_order ASC, cs.added_at DESC`,
    [collectionId]
  )
  return rows
}

export async function insertCollection(collection: Collection): Promise<void> {
  const database = getDb()
  await database.runAsync(
    `INSERT INTO collections (id, title, description, cover_json, story_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      collection.id,
      collection.title,
      collection.description,
      collection.cover_json,
      collection.story_count,
      collection.created_at,
      collection.updated_at,
    ]
  )
}

export async function updateCollection(
  collection: Partial<Collection> & { id: string }
): Promise<void> {
  const database = getDb()
  const fields: string[] = []
  const values: (string | number | null)[] = []

  const allowedFields: (keyof Collection)[] = [
    'title', 'description', 'cover_json', 'story_count', 'updated_at',
  ]

  for (const field of allowedFields) {
    if (field in collection) {
      fields.push(`${field} = ?`)
      const val = collection[field as keyof Collection]
      values.push(val !== undefined ? (val as string | number | null) : null)
    }
  }

  if (fields.length === 0) return

  values.push(collection.id)
  await database.runAsync(
    `UPDATE collections SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

export async function deleteCollection(id: string): Promise<void> {
  const database = getDb()
  await database.runAsync('DELETE FROM collections WHERE id = ?', [id])
}

export async function addStoryToCollection(
  collectionId: string,
  storyId: string,
  sortOrder: number = 0
): Promise<void> {
  const database = getDb()
  const now = new Date().toISOString()
  await database.runAsync(
    'INSERT OR IGNORE INTO collection_stories (collection_id, story_id, added_at, sort_order) VALUES (?, ?, ?, ?)',
    [collectionId, storyId, now, sortOrder]
  )
  await database.runAsync(
    'UPDATE collections SET story_count = (SELECT COUNT(*) FROM collection_stories WHERE collection_id = ?) WHERE id = ?',
    [collectionId, collectionId]
  )
}

export async function removeStoryFromCollection(
  collectionId: string,
  storyId: string
): Promise<void> {
  const database = getDb()
  await database.runAsync(
    'DELETE FROM collection_stories WHERE collection_id = ? AND story_id = ?',
    [collectionId, storyId]
  )
  await database.runAsync(
    'UPDATE collections SET story_count = (SELECT COUNT(*) FROM collection_stories WHERE collection_id = ?) WHERE id = ?',
    [collectionId, collectionId]
  )
}

export async function isStoryInCollection(
  collectionId: string,
  storyId: string
): Promise<boolean> {
  const database = getDb()
  const row = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM collection_stories WHERE collection_id = ? AND story_id = ?',
    [collectionId, storyId]
  )
  return (row?.count ?? 0) > 0
}
