import { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native'
import { useCollectionStore } from 'src/store/collectionStore'
import type { Collection } from 'src/types'

interface AddToCollectionModalProps {
  visible: boolean
  storyId: string
  onClose: () => void
}

export function AddToCollectionModal({ visible, storyId, onClose }: AddToCollectionModalProps) {
  const collections = useCollectionStore((s) => s.collections)
  const loadCollections = useCollectionStore((s) => s.loadCollections)
  const addStory = useCollectionStore((s) => s.addStory)
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    if (visible) loadCollections()
  }, [visible])

  const handleAdd = async (collectionId: string) => {
    setAdding(collectionId)
    await addStory(collectionId, storyId)
    setAdding(null)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[60%] rounded-t-3xl bg-white px-6 pb-10 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Add to Collection</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-base text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>

          {collections.length === 0 ? (
            <Text className="py-8 text-center text-sm text-gray-400">
              No collections yet. Create one first.
            </Text>
          ) : (
            <FlatList
              data={collections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CollectionRow
                  collection={item}
                  onPress={handleAdd}
                  isAdding={adding === item.id}
                />
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}

function CollectionRow({
  collection,
  onPress,
  isAdding,
}: {
  collection: Collection
  onPress: (id: string) => void
  isAdding: boolean
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(collection.id)}
      disabled={isAdding}
      className="flex-row items-center justify-between border-b border-gray-50 py-4"
    >
      <View>
        <Text className="text-base font-medium text-gray-900">{collection.title}</Text>
        <Text className="text-sm text-gray-400">
          {collection.story_count} {collection.story_count === 1 ? 'story' : 'stories'}
        </Text>
      </View>
      {isAdding ? (
        <ActivityIndicator size="small" color="#1a1a1a" />
      ) : (
        <Text className="text-sm text-gray-500">Add</Text>
      )}
    </TouchableOpacity>
  )
}
