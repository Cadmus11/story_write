import { Text, View, TouchableOpacity } from 'react-native'
import type { Story } from 'src/types'

interface StoryCardProps {
  story: Story
  onPress: (id: string) => void
}

export function StoryCard({ story, onPress }: StoryCardProps) {
  const date = new Date(story.updated_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <TouchableOpacity
      onPress={() => onPress(story.id)}
      className="mb-4 rounded-2xl bg-white p-4 shadow-sm"
      activeOpacity={0.7}
    >
      <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
        {story.title}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-gray-500" numberOfLines={2}>
        {story.content.replace(/<[^>]*>/g, '') || 'No content yet'}
      </Text>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-xs text-gray-400">{date}</Text>
        <Text className="text-xs text-gray-400">
          {story.word_count} words
        </Text>
      </View>
    </TouchableOpacity>
  )
}
