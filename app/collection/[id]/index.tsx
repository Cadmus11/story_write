import { useCallback, useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Alert, FlatList } from 'react-native'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useCollectionStore } from 'src/store/collectionStore'
import { StoryCard } from 'src/components/StoryCard'
import type { Collection, CoverConfig, Story } from 'src/types'

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const collection = useCollectionStore((s) =>
    s.collections.find((c) => c.id === id)
  )
  const deleteCollection = useCollectionStore((s) => s.deleteCollection)
  const getStories = useCollectionStore((s) => s.getStoriesInCollection)
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    if (id) getStories(id).then(setStories)
  }, [id, getStories])

  const handleDelete = useCallback(() => {
    if (!collection) return
    Alert.alert('Delete Collection', `Delete "${collection.title}"? Stories in the collection will not be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCollection(id!)
          router.back()
        },
      },
    ])
  }, [id, collection, deleteCollection, router])

  const handleStoryPress = useCallback(
    (storyId: string) => {
      router.push(`/story/${storyId}`)
    },
    [router]
  )

  if (!collection) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Collection not found</Text>
      </SafeAreaView>
    )
  }

  const cover: CoverConfig | null = collection.cover_json
    ? JSON.parse(collection.cover_json)
    : null

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-gray-500">Back</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.push(`/collection/${id}/edit`)}>
            <Text className="text-base text-gray-500">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-base text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cover && cover.title ? (
        cover.type === 'gradient' ? (
          <LinearGradient
            colors={cover.value.split(',') as [string, string, ...string[]]}
            className="h-40 items-center justify-center"
          >
            <Text className="px-4 text-center text-xl font-bold text-white">{collection.title}</Text>
          </LinearGradient>
        ) : (
          <View className="h-40 items-center justify-center" style={{ backgroundColor: cover.value }}>
            <Text className="px-4 text-center text-xl font-bold text-white">{collection.title}</Text>
          </View>
        )
      ) : (
        <View className="h-24 items-center justify-center bg-gray-100 px-4">
          <Text className="text-center text-xl font-bold text-gray-800">{collection.title}</Text>
        </View>
      )}

      <View className="px-4 pb-2 pt-3">
        {collection.description ? (
          <Text className="text-sm text-gray-500">{collection.description}</Text>
        ) : null}
        <Text className="mt-1 text-xs text-gray-400">
          {collection.story_count} {collection.story_count === 1 ? 'story' : 'stories'}
        </Text>
      </View>

      {stories.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base text-gray-400">No stories in this collection yet.</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <StoryCard story={item} onPress={handleStoryPress} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
