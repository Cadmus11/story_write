import { Text, View, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { Collection, CoverConfig } from 'src/types'

interface CollectionCardProps {
  collection: Collection
  onPress: (id: string) => void
}

export function CollectionCard({ collection, onPress }: CollectionCardProps) {
  const cover: CoverConfig | null = collection.cover_json
    ? JSON.parse(collection.cover_json)
    : null

  const date = new Date(collection.updated_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <TouchableOpacity
      onPress={() => onPress(collection.id)}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm"
      activeOpacity={0.7}
    >
      {cover && cover.title ? (
        cover.type === 'gradient' ? (
          <LinearGradient
            colors={cover.value.split(',') as [string, string, ...string[]]}
            className="h-32 items-center justify-center"
          >
            <Text className="px-4 text-center text-lg font-bold text-white" numberOfLines={2}>
              {collection.title}
            </Text>
          </LinearGradient>
        ) : (
          <View
            className="h-32 items-center justify-center"
            style={{ backgroundColor: cover.value }}
          >
            <Text className="px-4 text-center text-lg font-bold text-white" numberOfLines={2}>
              {collection.title}
            </Text>
          </View>
        )
      ) : (
        <View className="h-32 items-center justify-center bg-gray-100">
          <Text className="px-4 text-center text-lg font-bold text-gray-700" numberOfLines={2}>
            {collection.title}
          </Text>
        </View>
      )}

      <View className="px-4 py-3">
        {collection.description ? (
          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {collection.description}
          </Text>
        ) : null}
        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-xs text-gray-400">
            {collection.story_count} {collection.story_count === 1 ? 'story' : 'stories'}
          </Text>
          <Text className="text-xs text-gray-400">{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
