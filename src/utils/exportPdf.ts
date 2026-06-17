import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import type { Story, CoverConfig } from 'src/types'

interface PdfOptions {
  includeCover: boolean
  includeAuthor: boolean
  includePageNumbers: boolean
}

function coverHtml(config: CoverConfig): string {
  const bg =
    config.type === 'gradient'
      ? `background: linear-gradient(135deg, ${config.value});`
      : `background-color: ${config.value};`

  return `
    <div style="page-break-after: always; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; ${bg} color: white; text-align: center; padding: 40px;">
      <h1 style="font-size: 36px; margin-bottom: 16px;">${config.title}</h1>
      ${config.subtitle ? `<p style="font-size: 20px; opacity: 0.9; margin-bottom: 8px;">${config.subtitle}</p>` : ''}
      ${config.author ? `<p style="font-size: 16px; opacity: 0.7;">${config.author}</p>` : ''}
    </div>
  `
}

function buildHtml(story: Story, options: PdfOptions): string {
  const cover = story.cover_json ? (JSON.parse(story.cover_json) as CoverConfig) : null
  const showCover = options.includeCover && cover && cover.title
  const author = options.includeAuthor && cover?.author ? cover.author : ''

  const date = new Date(story.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${story.title}</title>
        <style>
          @page { margin: 20mm; ${options.includePageNumbers ? '' : 'counter-reset: page;'}}

          body {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.8;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 0 20px;
          }

          h1 { font-size: 28pt; text-align: center; margin: 40px 0 8px; }
          h2 { font-size: 20pt; margin: 30px 0 12px; }
          blockquote {
            border-left: 3px solid #ccc;
            padding-left: 16px;
            margin: 16px 0;
            color: #555;
            font-style: italic;
          }
          .meta {
            text-align: center;
            color: #888;
            font-size: 10pt;
            margin-bottom: 40px;
          }
          p { margin: 0 0 12px; text-indent: 0; }
          img { max-width: 100%; height: auto; }
          ${options.includePageNumbers ? `
            @page { @bottom-right { content: counter(page); font-size: 9pt; color: #999; } }
          ` : ''}
        </style>
      </head>
      <body>
        ${showCover ? coverHtml(cover) : ''}
        <h1>${story.title}</h1>
        <div class="meta">
          ${author ? `${author} &middot; ` : ''}
          ${date} &middot; ${story.word_count} words
        </div>
        <div>${story.content}</div>
      </body>
    </html>
  `
}

export async function exportPdf(story: Story, options: PdfOptions): Promise<void> {
  const html = buildHtml(story, options)
  const { uri } = await Print.printToFileAsync({ html })
  const isAvailable = await Sharing.isAvailableAsync()

  if (isAvailable) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Share ${story.title}`,
    })
  }
}
