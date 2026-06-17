import { Text, View } from 'react-native'

interface WordCountBarProps {
  wordCount: number
  charCount: number
}

export function WordCountBar({ wordCount, charCount }: WordCountBarProps) {
  return (
    <View className="flex-row justify-end border-t border-gray-100 px-4 py-2">
      <Text className="text-xs text-gray-400">
        {wordCount} words · {charCount} characters
      </Text>
    </View>
  )
}
