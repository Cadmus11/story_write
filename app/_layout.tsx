import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { initDatabase } from 'src/db'
import { useStoryStore } from 'src/store/storyStore'
import { useCollectionStore } from 'src/store/collectionStore'

export default function RootLayout() {
  const loadStories = useStoryStore((s) => s.loadStories)
  const loadCollections = useCollectionStore((s) => s.loadCollections)

  useEffect(() => {
    initDatabase().then(() => {
      loadStories()
      loadCollections()
    })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="story/new" />
          <Stack.Screen name="story/[id]" />
          <Stack.Screen name="story/[id]/edit" />
          <Stack.Screen name="story/[id]/cover" />
          <Stack.Screen name="collection/new" />
          <Stack.Screen name="collection/[id]" />
          <Stack.Screen name="collection/[id]/edit" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
