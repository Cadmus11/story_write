import { FlatList } from 'react-native'
import type { Story } from 'src/types'
import { StoryListItem } from './StoryListItem'

interface StoryListProps {
  stories: Story[]
  onPress: (id: string) => void
}

export function StoryList({ stories, onPress }: StoryListProps) {
  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StoryListItem story={item} onPress={onPress} />
      )}
      showsVerticalScrollIndicator={false}
    />
  )
}
