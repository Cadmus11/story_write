import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStoryStore } from 'src/store/storyStore'
import { Text, View } from 'react-native'

export default function NewStoryScreen() {
  const router = useRouter()
  const createStory = useStoryStore((s) => s.createStory)

  useEffect(() => {
    createStory().then((story) => {
      router.replace(`/story/${story.id}/edit`)
    })
  }, [])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-base text-gray-500">Creating new story...</Text>
    </View>
  )
}
