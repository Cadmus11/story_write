import * as Sharing from 'expo-sharing'
import { File } from 'expo-file-system'
import { Paths } from 'expo-file-system'
import JSZip from 'jszip'
import type { Story, CoverConfig } from 'src/types'

interface EpubOptions {
  includeCover: boolean
  includeAuthor: boolean
}

function sanitize(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildContentOpf(story: Story, cover: CoverConfig | null, options: EpubOptions): string {
  const author = options.includeAuthor && cover?.author ? sanitize(cover.author) : 'Unknown'
  const title = sanitize(story.title)
  const date = story.created_at.slice(0, 10)

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${story.id}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>en</dc:language>
    <dc:date>${date}</dc:date>
    <meta property="dcterms:modified">${story.updated_at}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
    <item id="css" href="styles.css" media-type="text/css"/>
    ${options.includeCover && cover?.title ? '<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>' : ''}
  </manifest>
  <spine>
    ${options.includeCover && cover?.title ? '<itemref idref="cover"/>' : ''}
    <itemref idref="chapter1"/>
  </spine>
</package>`
}

function buildNavXhtml(story: Story): string {
  const title = sanitize(story.title)
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>${title}</title></head>
<body>
  <nav epub:type="toc">
    <h1>${title}</h1>
    <ol>
      <li><a href="chapter1.xhtml">${title}</a></li>
    </ol>
  </nav>
</body>
</html>`
}

function buildCoverXhtml(config: CoverConfig): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${sanitize(config.title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body style="margin:0;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;">
  <h1 style="font-size:2em;margin-bottom:0.5em;">${sanitize(config.title)}</h1>
  ${config.subtitle ? `<p style="font-size:1.2em;color:#555;">${sanitize(config.subtitle)}</p>` : ''}
  ${config.author ? `<p style="font-size:1em;color:#888;margin-top:2em;">${sanitize(config.author)}</p>` : ''}
</body>
</html>`
}

function buildChapterXhtml(story: Story): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${sanitize(story.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <h1>${sanitize(story.title)}</h1>
  ${story.content}
</body>
</html>`
}

export async function exportEpub(story: Story, options: EpubOptions): Promise<void> {
  const cover = story.cover_json ? (JSON.parse(story.cover_json) as CoverConfig) : null
  const fileName = `${story.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.epub`

  const zip = new JSZip()

  zip.file('mimetype', 'application/epub+zip')

  zip.folder('META-INF')!.file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

  const oebps = zip.folder('OEBPS')!
  oebps.file('content.opf', buildContentOpf(story, cover, options))
  oebps.file('nav.xhtml', buildNavXhtml(story))
  oebps.file('chapter1.xhtml', buildChapterXhtml(story))
  oebps.file('styles.css', `body { font-family: Georgia, 'Times New Roman', serif; font-size: 1em; line-height: 1.8; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0 20px; }
h1 { font-size: 1.8em; text-align: center; margin: 1em 0; }
h2 { font-size: 1.4em; margin: 1.2em 0 0.6em; }
p { margin: 0 0 0.8em; }
blockquote { border-left: 3px solid #ccc; padding-left: 1em; margin: 1em 0; color: #555; font-style: italic; }
img { max-width: 100%; height: auto; }`)

  if (options.includeCover && cover?.title) {
    oebps.file('cover.xhtml', buildCoverXhtml(cover))
  }

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' })

  const reader = new FileReader()
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

  const base64Data = base64.split(',')[1]

  const file = new File(Paths.cache, fileName)
  file.write(base64Data, { encoding: 'base64' })

  const isAvailable = await Sharing.isAvailableAsync()
  if (isAvailable) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/epub+zip',
      dialogTitle: `Share ${story.title}`,
    })
  }
}
