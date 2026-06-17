import { useMemo } from 'react'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function useWordCount(htmlContent: string) {
  return useMemo(() => {
    const text = stripHtml(htmlContent).trim()
    const char_count = text.length
    const word_count = text ? text.split(/\s+/).length : 0
    return { word_count, char_count }
  }, [htmlContent])
}
