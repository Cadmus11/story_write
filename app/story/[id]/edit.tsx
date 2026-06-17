import { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStoryStore } from 'src/store/storyStore'
import { RichTextEditor } from 'src/components/RichTextEditor'
import { WordCountBar } from 'src/components/WordCountBar'
import { useAutoSave } from 'src/hooks/useAutoSave'
import { useWordCount } from 'src/hooks/useWordCount'

export default function EditStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const story = useStoryStore((s) => s.stories.find((st) => st.id === id))
  const deleteStory = useStoryStore((s) => s.deleteStory)

  const [title, setTitle] = useState(story?.title ?? 'Untitled')
  const [content, setContent] = useState(story?.content ?? '')

  useAutoSave(id!, content, title)

  const { word_count, char_count } = useWordCount(content)

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Story', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteStory(id!)
          router.back()
        },
      },
    ])
  }, [id, deleteStory, router])

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-gray-500">Back</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.push(`/story/${id}/cover`)}>
            <Text className="text-base text-gray-500">Cover</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-base text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Story title..."
        className="border-b border-gray-100 px-4 py-3 text-xl font-semibold text-gray-900"
        placeholderTextColor="#d1d5db"
      />

      <RichTextEditor content={content} onContentChange={setContent} />

      <WordCountBar wordCount={word_count} charCount={char_count} />
    </SafeAreaView>
  )
}
