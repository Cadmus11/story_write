import { Text, View, TouchableOpacity } from 'react-native'
import type { Story } from 'src/types'

interface StoryListItemProps {
  story: Story
  onPress: (id: string) => void
}

export function StoryListItem({ story, onPress }: StoryListItemProps) {
  const date = new Date(story.updated_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <TouchableOpacity
      onPress={() => onPress(story.id)}
      className="border-b border-gray-100 px-4 py-4"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900" numberOfLines={1}>
            {story.title}
          </Text>
          <Text className="mt-0.5 text-sm text-gray-500" numberOfLines={1}>
            {story.content.replace(/<[^>]*>/g, '') || 'No content yet'}
          </Text>
        </View>
        <View className="ml-4 items-end">
          <Text className="text-xs text-gray-400">{date}</Text>
          <Text className="mt-0.5 text-xs text-gray-400">{story.word_count} words</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
