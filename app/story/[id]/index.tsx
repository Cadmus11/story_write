import { useCallback, useState } from 'react'
import { Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { WebView } from 'react-native-webview'
import { useStoryStore } from 'src/store/storyStore'
import { ExportModal } from 'src/components/ExportModal'
import type { CoverConfig } from 'src/types'

export default function ViewStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [showExport, setShowExport] = useState(false)
  const story = useStoryStore((s) => s.stories.find((st) => st.id === id))
  const duplicateStory = useStoryStore((s) => s.duplicateStory)
  const deleteStory = useStoryStore((s) => s.deleteStory)

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Story', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteStory(id!)
          router.back()
        },
      },
    ])
  }, [id, deleteStory, router])

  const handleDuplicate = useCallback(async () => {
    const copy = await duplicateStory(id!)
    if (copy) {
      router.push(`/story/${copy.id}/edit`)
    }
  }, [id, duplicateStory, router])

  if (!story) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Story not found</Text>
      </SafeAreaView>
    )
  }

  const cover: CoverConfig | null = story.cover_json
    ? JSON.parse(story.cover_json)
    : null

  const date = new Date(story.updated_at).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-gray-500">Back</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.push(`/story/${id}/edit`)}>
            <Text className="text-base text-gray-500">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowExport(true)}>
            <Text className="text-base text-gray-500">Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDuplicate}>
            <Text className="text-base text-gray-500">Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-base text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {cover && cover.title ? (
          cover.type === 'gradient' ? (
            <LinearGradient
              colors={cover.value.split(',') as [string, string, ...string[]]}
              className="h-56 items-center justify-end pb-6"
            >
              <Text className="px-6 text-center text-2xl font-bold text-white">{cover.title}</Text>
              {cover.subtitle ? (
                <Text className="mt-1 text-center text-base text-white/80">{cover.subtitle}</Text>
              ) : null}
              {cover.author ? (
                <Text className="mt-2 text-center text-sm text-white/60">{cover.author}</Text>
              ) : null}
            </LinearGradient>
          ) : (
            <View
              className="h-56 items-center justify-end pb-6"
              style={{ backgroundColor: cover.value }}
            >
              <Text className="px-6 text-center text-2xl font-bold text-white">{cover.title}</Text>
              {cover.subtitle ? (
                <Text className="mt-1 text-center text-base text-white/80">{cover.subtitle}</Text>
              ) : null}
              {cover.author ? (
                <Text className="mt-2 text-center text-sm text-white/60">{cover.author}</Text>
              ) : null}
            </View>
          )
        ) : null}

        <View className="px-4 pb-2 pt-4">
          <Text className="text-2xl font-bold text-gray-900">{story.title}</Text>
          <View className="mt-2 flex-row items-center gap-4">
            <Text className="text-sm text-gray-400">{date}</Text>
            <Text className="text-sm text-gray-400">{story.word_count} words</Text>
          </View>
        </View>

        <View className="flex-1 px-4 pb-8" style={{ minHeight: 400 }}>
          {story.content ? (
            <WebView
              source={{ html: `<html><meta name="viewport" content="width=device-width, initial-scale=1"><body style="font-family: -apple-system, Georgia, serif; font-size: 17px; line-height: 1.8; color: #1a1a1a; padding: 0; margin: 0;">${story.content}</body></html>` }}
              className="flex-1"
              scrollEnabled={false}
              originWhitelist={['*']}
            />
          ) : (
            <Text className="mt-8 text-center text-gray-400">No content yet. Tap Edit to start writing.</Text>
          )}
        </View>
      </ScrollView>

      {story && (
        <ExportModal
          visible={showExport}
          story={story}
          onClose={() => setShowExport(false)}
        />
      )}
    </SafeAreaView>
  )
}
