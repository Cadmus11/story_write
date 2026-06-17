import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { initDatabase } from 'src/db'
import { useStoryStore } from 'src/store/storyStore'

export default function RootLayout() {
  const loadStories = useStoryStore((s) => s.loadStories)

  useEffect(() => {
    initDatabase().then(() => loadStories())
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
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
