import { View, FlatList } from 'react-native'
import type { Story } from 'src/types'
import { StoryCard } from './StoryCard'

interface StoryGridProps {
  stories: Story[]
  onPress: (id: string) => void
}

export function StoryGrid({ stories, onPress }: StoryGridProps) {
  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <StoryCard story={item} onPress={onPress} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  )
}
