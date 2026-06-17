import { useState, useEffect, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStoryStore } from 'src/store/storyStore'
import { CoverCreator } from 'src/components/CoverCreator'
import type { CoverConfig } from 'src/types'

export default function CoverScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const story = useStoryStore((s) => s.stories.find((st) => st.id === id))
  const updateStory = useStoryStore((s) => s.updateStory)

  const [config, setConfig] = useState<CoverConfig>(() => {
    if (story?.cover_json) {
      return JSON.parse(story.cover_json)
    }
    return { type: 'color', value: '#667eea', title: story?.title || '', subtitle: '', author: '' }
  })

  useEffect(() => {
    if (story && !story.cover_json) {
      setConfig((prev) => ({ ...prev, title: story.title }))
    }
  }, [story])

  const handleSave = useCallback(async () => {
    await updateStory(id!, {
      cover_json: JSON.stringify(config),
      updated_at: new Date().toISOString(),
    })
    router.back()
  }, [id, config, updateStory, router])

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-gray-500">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-gray-900">Cover</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-base font-semibold text-gray-900">Save</Text>
        </TouchableOpacity>
      </View>

      <CoverCreator config={config} onChange={setConfig} />
    </SafeAreaView>
  )
}
