import { useState } from 'react'
import { Text, View, TouchableOpacity, Modal, ActivityIndicator, Switch } from 'react-native'
import type { Story } from 'src/types'
import { exportPdf } from 'src/utils/exportPdf'
import { exportEpub } from 'src/utils/exportEpub'

interface ExportModalProps {
  visible: boolean
  story: Story
  onClose: () => void
}

export function ExportModal({ visible, story, onClose }: ExportModalProps) {
  const [includeCover, setIncludeCover] = useState(true)
  const [includeAuthor, setIncludeAuthor] = useState(true)
  const [includePageNumbers, setIncludePageNumbers] = useState(true)
  const [exporting, setExporting] = useState<'pdf' | 'epub' | null>(null)

  const handlePdf = async () => {
    setExporting('pdf')
    try {
      await exportPdf(story, { includeCover, includeAuthor, includePageNumbers })
    } finally {
      setExporting(null)
      onClose()
    }
  }

  const handleEpub = async () => {
    setExporting('epub')
    try {
      await exportEpub(story, { includeCover, includeAuthor })
    } finally {
      setExporting(null)
      onClose()
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Export Story</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-base text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>

          <OptionRow label="Include Cover" value={includeCover} onChange={setIncludeCover} />
          <OptionRow label="Include Author" value={includeAuthor} onChange={setIncludeAuthor} />
          <OptionRow label="Page Numbers" value={includePageNumbers} onChange={setIncludePageNumbers} />

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handlePdf}
              disabled={exporting !== null}
              className="flex-1 items-center rounded-xl bg-gray-900 py-4"
            >
              {exporting === 'pdf' ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-medium text-white">Export PDF</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEpub}
              disabled={exporting !== null}
              className="flex-1 items-center rounded-xl border border-gray-300 py-4"
            >
              {exporting === 'epub' ? (
                <ActivityIndicator color="gray" />
              ) : (
                <Text className="text-base font-medium text-gray-900">Export EPUB</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

function OptionRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-50 py-3">
      <Text className="text-base text-gray-700">{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e5e7eb', true: '#1a1a1a' }}
        thumbColor="white"
      />
    </View>
  )
}
