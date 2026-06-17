import { useEffect, useRef, useCallback } from 'react'
import { AppState } from 'react-native'
import { useStoryStore } from 'src/store/storyStore'

export function useAutoSave(storyId: string, content: string, title: string, delayMs = 5000) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const updateStory = useStoryStore((s) => s.updateStory)
  const recalculateCounts = useStoryStore((s) => s.recalculateCounts)

  const save = useCallback(() => {
    updateStory(storyId, {
      content,
      title,
      updated_at: new Date().toISOString(),
    })
    recalculateCounts(storyId)
  }, [storyId, content, title, updateStory, recalculateCounts])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, delayMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, title, delayMs, save])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        if (timerRef.current) clearTimeout(timerRef.current)
        save()
      }
    })
    return () => subscription.remove()
  }, [save])

  return { saveNow: save }
}
