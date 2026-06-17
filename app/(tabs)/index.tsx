import { useCallback } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStoryStore } from 'src/store/storyStore'
import { StoryGrid } from 'src/components/StoryGrid'
import { StoryList } from 'src/components/StoryList'
import { EmptyState } from 'src/components/EmptyState'

export default function LibraryScreen() {
  const router = useRouter()
  const stories = useStoryStore((s) => s.stories)
  const viewMode = useStoryStore((s) => s.viewMode)
  const sortBy = useStoryStore((s) => s.sortBy)
  const createStory = useStoryStore((s) => s.createStory)
  const setViewMode = useStoryStore((s) => s.setViewMode)
  const setSortBy = useStoryStore((s) => s.setSortBy)

  const handleCreate = useCallback(async () => {
    const story = await createStory()
    router.push(`/story/${story.id}/edit`)
  }, [createStory, router])

  const handlePress = useCallback(
    (id: string) => {
      router.push(`/story/${id}`)
    },
    [router]
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-gray-900">StoryWrite</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => setSortBy(sortBy === 'updated_at' ? 'title' : 'updated_at')}>
            <Text className="text-sm text-gray-500">
              {sortBy === 'updated_at' ? 'Recent' : sortBy === 'title' ? 'A-Z' : 'Created'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            <Text className="text-sm text-gray-500">
              {viewMode === 'grid' ? '☰' : '⊞'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {stories.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'grid' ? (
        <StoryGrid stories={stories} onPress={handlePress} />
      ) : (
        <StoryList stories={stories} onPress={handlePress} />
      )}

      <TouchableOpacity
        onPress={handleCreate}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-2xl text-white">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
