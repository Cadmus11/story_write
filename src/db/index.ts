import * as SQLite from 'expo-sqlite'
import { ALL_SCHEMA_STATEMENTS } from './schema'
import type { Story } from 'src/types'

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
