import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-4 py-3">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-base text-gray-500">More settings coming soon.</Text>
      </View>
    </SafeAreaView>
  )
}
