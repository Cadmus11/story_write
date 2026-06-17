import { create } from 'zustand'
import type { Collection, Story } from 'src/types'
import * as DB from 'src/db'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function getNow(): string {
  return new Date().toISOString()
}

interface CollectionState {
  collections: Collection[]
  isLoading: boolean
  loadCollections: () => Promise<void>
  createCollection: () => Promise<Collection>
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>
  deleteCollection: (id: string) => Promise<void>
  getStoriesInCollection: (id: string) => Promise<Story[]>
  addStory: (collectionId: string, storyId: string) => Promise<void>
  removeStory: (collectionId: string, storyId: string) => Promise<void>
  isStoryInCollection: (collectionId: string, storyId: string) => Promise<boolean>
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  isLoading: false,

  loadCollections: async () => {
    set({ isLoading: true })
    const collections = await DB.getAllCollections()
    set({ collections, isLoading: false })
  },

  createCollection: async () => {
    const now = getNow()
    const collection: Collection = {
      id: generateId(),
      title: 'Untitled Collection',
      description: '',
      cover_json: null,
      story_count: 0,
      created_at: now,
      updated_at: now,
    }
    await DB.insertCollection(collection)
    const collections = await DB.getAllCollections()
    set({ collections })
    return collection
  },

  updateCollection: async (id: string, updates: Partial<Collection>) => {
    await DB.updateCollection({ id, ...updates })
    const collections = await DB.getAllCollections()
    set({ collections })
  },

  deleteCollection: async (id: string) => {
    await DB.deleteCollection(id)
    const collections = await DB.getAllCollections()
    set({ collections })
  },

  getStoriesInCollection: async (id: string) => {
    return DB.getStoriesInCollection(id)
  },

  addStory: async (collectionId: string, storyId: string) => {
    await DB.addStoryToCollection(collectionId, storyId)
    const collections = await DB.getAllCollections()
    set({ collections })
  },

  removeStory: async (collectionId: string, storyId: string) => {
    await DB.removeStoryFromCollection(collectionId, storyId)
    const collections = await DB.getAllCollections()
    set({ collections })
  },

  isStoryInCollection: async (collectionId: string, storyId: string) => {
    return DB.isStoryInCollection(collectionId, storyId)
  },
}))
