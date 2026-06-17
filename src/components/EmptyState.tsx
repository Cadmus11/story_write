import { Text, View } from 'react-native'

export function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-6xl">📖</Text>
      <Text className="mt-4 text-xl font-semibold text-gray-700">No stories yet</Text>
      <Text className="mt-2 text-center text-sm text-gray-500">
        Tap the + button to write your first story.
      </Text>
    </View>
  )
}
