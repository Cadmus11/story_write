import { create } from 'zustand'
import type { Story, SortOption, ViewMode } from 'src/types'
import * as DB from 'src/db'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function getNow(): string {
  return new Date().toISOString()
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

function countWords(html: string): number {
  const text = stripHtml(html).trim()
  if (!text) return 0
  return text.split(/\s+/).length
}

function countChars(html: string): number {
  return stripHtml(html).length
}

interface StoryState {
  stories: Story[]
  isLoading: boolean
  sortBy: SortOption
  viewMode: ViewMode
  loadStories: () => Promise<void>
  createStory: () => Promise<Story>
  getStory: (id: string) => Story | undefined
  updateStory: (id: string, updates: Partial<Story>) => Promise<void>
  deleteStory: (id: string) => Promise<void>
  duplicateStory: (id: string) => Promise<Story | undefined>
  setSortBy: (sort: SortOption) => void
  setViewMode: (mode: ViewMode) => void
  recalculateCounts: (id: string) => Promise<void>
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  isLoading: false,
  sortBy: 'updated_at',
  viewMode: 'grid',

  loadStories: async () => {
    set({ isLoading: true })
    const { sortBy } = get()
    const stories = await DB.getAllStories(sortBy)
    set({ stories, isLoading: false })
  },

  createStory: async () => {
    const now = getNow()
    const story: Story = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      cover_json: null,
      status: 'draft',
      word_count: 0,
      char_count: 0,
      created_at: now,
      updated_at: now,
    }
    await DB.insertStory(story)
    const { sortBy } = get()
    const stories = await DB.getAllStories(sortBy)
    set({ stories })
    return story
  },

  getStory: (id: string) => {
    return get().stories.find((s) => s.id === id)
  },

  updateStory: async (id: string, updates: Partial<Story>) => {
    await DB.updateStory({ id, ...updates })
    const { sortBy } = get()
    const stories = await DB.getAllStories(sortBy)
    set({ stories })
  },

  deleteStory: async (id: string) => {
    await DB.deleteStory(id)
    const { sortBy } = get()
    const stories = await DB.getAllStories(sortBy)
    set({ stories })
  },

  duplicateStory: async (id: string) => {
    const original = get().stories.find((s) => s.id === id)
    if (!original) return undefined
    const now = getNow()
    const copy: Story = {
      ...original,
      id: generateId(),
      title: `${original.title} (Copy)`,
      created_at: now,
      updated_at: now,
    }
    await DB.insertStory(copy)
    const { sortBy } = get()
    const stories = await DB.getAllStories(sortBy)
    set({ stories })
    return copy
  },

  setSortBy: (sortBy: SortOption) => {
    set({ sortBy })
    get().loadStories()
  },

  setViewMode: (viewMode: ViewMode) => {
    set({ viewMode })
  },

  recalculateCounts: async (id: string) => {
    const story = get().stories.find((s) => s.id === id)
    if (!story) return
    const word_count = countWords(story.content)
    const char_count = countChars(story.content)
    await DB.updateStory({ id, word_count, char_count, updated_at: getNow() })
    set({
      stories: get().stories.map((s) =>
        s.id === id ? { ...s, word_count, char_count } : s
      ),
    })
  },
}))
