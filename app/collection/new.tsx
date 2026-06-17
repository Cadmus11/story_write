import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useCollectionStore } from 'src/store/collectionStore'
import { Text, View } from 'react-native'

export default function NewCollectionScreen() {
  const router = useRouter()
  const createCollection = useCollectionStore((s) => s.createCollection)

  useEffect(() => {
    createCollection().then((collection) => {
      router.replace(`/collection/${collection.id}/edit`)
    })
  }, [])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-base text-gray-500">Creating new collection...</Text>
    </View>
  )
}
