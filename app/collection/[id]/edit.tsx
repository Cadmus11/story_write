import { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCollectionStore } from 'src/store/collectionStore'
import type { CoverConfig } from 'src/types'

export default function EditCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const collection = useCollectionStore((s) => s.collections.find((c) => c.id === id))
  const updateCollection = useCollectionStore((s) => s.updateCollection)

  const [title, setTitle] = useState(collection?.title ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')

  const handleSave = useCallback(async () => {
    await updateCollection(id!, {
      title: title || 'Untitled Collection',
      description,
      updated_at: new Date().toISOString(),
    })
    router.back()
  }, [id, title, description, updateCollection, router])

  if (!collection) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Collection not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-gray-500">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold text-gray-900">Edit Collection</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-base font-semibold text-gray-900">Save</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pt-6">
        <Text className="mb-1 text-sm font-medium text-gray-500">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Collection title"
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base"
          placeholderTextColor="#d1d5db"
        />

        <Text className="mb-1 mt-5 text-sm font-medium text-gray-500">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description (optional)"
          multiline
          numberOfLines={3}
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base"
          placeholderTextColor="#d1d5db"
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />
      </View>
    </SafeAreaView>
  )
}
