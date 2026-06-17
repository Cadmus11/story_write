import { useState } from 'react'
import { Text, View, TouchableOpacity, TextInput, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import type { CoverConfig } from 'src/types'

interface CoverCreatorProps {
  config: CoverConfig
  onChange: (config: CoverConfig) => void
}

const GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#f5576c', '#ff6f91'],
]

const COLORS = [
  '#667eea', '#f5576c', '#4facfe', '#fa709a',
  '#a18cd1', '#fccb90', '#e0c3fc', '#43e97b',
  '#38f9d7', '#fa709a', '#f6d365', '#96fbc4',
]

export function CoverCreator({ config, onChange }: CoverCreatorProps) {
  const [mode, setMode] = useState<'color' | 'gradient' | 'image'>(config.type)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      onChange({ ...config, type: 'image', value: result.assets[0].uri })
      setMode('image')
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="h-64">
        {mode === 'image' && config.type === 'image' ? (
          <Image source={{ uri: config.value }} className="h-full w-full" resizeMode="cover" />
        ) : mode === 'gradient' ? (
          <LinearGradient colors={GRADIENTS[0] as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="h-full w-full items-center justify-end pb-6">
            <CoverOverlay config={config} />
          </LinearGradient>
        ) : (
          <View style={{ backgroundColor: config.value || COLORS[0] }} className="h-full w-full items-center justify-end pb-6">
            <CoverOverlay config={config} />
          </View>
        )}
      </View>

      <View className="flex-row justify-center gap-3 px-4 py-4">
        <ModeButton label="Color" active={mode === 'color'} onPress={() => { setMode('color'); onChange({ ...config, type: 'color', value: COLORS[0] }) }} />
        <ModeButton label="Gradient" active={mode === 'gradient'} onPress={() => { setMode('gradient'); onChange({ ...config, type: 'gradient', value: GRADIENTS[0].join(',') }) }} />
        <ModeButton label="Image" active={mode === 'image'} onPress={pickImage} />
      </View>

      {mode === 'color' && (
        <View className="flex-row flex-wrap justify-center gap-3 px-4">
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => onChange({ ...config, type: 'color', value: c })}
              className="h-10 w-10 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </View>
      )}

      {mode === 'gradient' && (
        <View className="flex-row flex-wrap justify-center gap-3 px-4">
          {GRADIENTS.map((g) => (
            <TouchableOpacity
              key={g.join('')}
              onPress={() => onChange({ ...config, type: 'gradient', value: g.join(',') })}
              className="h-10 w-10 rounded-full"
            >
              <LinearGradient colors={g as [string, string, ...string[]]} className="h-full w-full rounded-full" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View className="mt-6 px-4">
        <TextInput
          value={config.title}
          onChangeText={(v) => onChange({ ...config, title: v })}
          placeholder="Cover Title"
          className="mb-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base"
        />
        <TextInput
          value={config.subtitle}
          onChangeText={(v) => onChange({ ...config, subtitle: v })}
          placeholder="Subtitle (optional)"
          className="mb-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base"
        />
        <TextInput
          value={config.author}
          onChangeText={(v) => onChange({ ...config, author: v })}
          placeholder="Author (optional)"
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base"
        />
      </View>
    </View>
  )
}

function CoverOverlay({ config }: { config: CoverConfig }) {
  return (
    <View className="items-center px-6">
      {config.title ? (
        <Text className="text-center text-2xl font-bold text-white">{config.title}</Text>
      ) : null}
      {config.subtitle ? (
        <Text className="mt-2 text-center text-base text-white/80">{config.subtitle}</Text>
      ) : null}
      {config.author ? (
        <Text className="mt-3 text-center text-sm text-white/60">{config.author}</Text>
      ) : null}
    </View>
  )
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full px-5 py-2 ${active ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
    </TouchableOpacity>
  )
}
