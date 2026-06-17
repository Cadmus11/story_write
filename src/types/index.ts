export interface CoverConfig {
  type: 'color' | 'gradient' | 'image'
  value: string
  title: string
  subtitle: string
  author: string
}

export type StoryStatus = 'draft' | 'published'

export interface Story {
  id: string
  title: string
  content: string
  cover_json: string | null
  status: StoryStatus
  word_count: number
  char_count: number
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  title: string
  description: string
  cover_json: string | null
  story_count: number
  created_at: string
  updated_at: string
}

export type SortOption = 'updated_at' | 'created_at' | 'title'

export type ViewMode = 'grid' | 'list'
