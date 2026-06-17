import { useCallback } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCollectionStore } from 'src/store/collectionStore'
import { CollectionCard } from 'src/components/CollectionCard'

export default function CollectionsScreen() {
  const router = useRouter()
  const collections = useCollectionStore((s) => s.collections)
  const createCollection = useCollectionStore((s) => s.createCollection)

  const handleCreate = useCallback(async () => {
    const collection = await createCollection()
    router.push(`/collection/${collection.id}/edit`)
  }, [createCollection, router])

  const handlePress = useCallback(
    (id: string) => {
      router.push(`/collection/${id}`)
    },
    [router]
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-gray-900">Collections</Text>
      </View>

      {collections.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl">📂</Text>
          <Text className="mt-4 text-xl font-semibold text-gray-700">No collections yet</Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Group your stories into collections.
          </Text>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <CollectionCard collection={item} onPress={handlePress} />
          )}
        />
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
