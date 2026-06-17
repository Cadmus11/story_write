import { useCallback, useRef } from 'react'
import { View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { WebView } from 'react-native-webview'

interface RichTextEditorProps {
  content: string
  onContentChange: (html: string) => void
}

const EDITOR_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Georgia', serif;
    font-size: 18px;
    line-height: 1.8;
    padding: 16px;
    color: #1a1a1a;
  }
  h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; }
  h2 { font-size: 22px; font-weight: 600; margin: 20px 0 10px; }
  blockquote {
    border-left: 3px solid #d1d5db;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
    font-style: italic;
  }
  ul, ol { padding-left: 24px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }
</style>
</head>
<body>
<div id="editor" contenteditable="true"></div>
<script>
  const editor = document.getElementById('editor');
  let isUpdating = false;

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    let node = range.commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentNode;
    const parent = node.closest ? node.closest('h1,h2,blockquote,p,li') : node;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'selection',
      tag: parent ? parent.tagName.toLowerCase() : 'p'
    }));
  });

  editor.addEventListener('input', () => {
    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(() => {
        isUpdating = false;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'content',
          html: editor.innerHTML
        }));
      });
    }
  });

  function setContent(html) {
    editor.innerHTML = html;
  }

  function execCmd(command, value) {
    document.execCommand(command, false, value || null);
    editor.focus();
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'content',
      html: editor.innerHTML
    }));
  }
</script>
</body>
</html>
`

export function RichTextEditor({ content, onContentChange }: RichTextEditorProps) {
  const webViewRef = useRef<WebView>(null)
  const contentRef = useRef(content)

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data)
        if (msg.type === 'content' && msg.html !== contentRef.current) {
          contentRef.current = msg.html
          onContentChange(msg.html)
        }
      } catch {}
    },
    [onContentChange]
  )

  const execCommand = useCallback((command: string, value?: string) => {
    webViewRef.current?.injectJavaScript(
      `execCmd('${command}', '${value || ''}'); true;`
    )
  }, [])

  const execOnLoad = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      `setContent('${content.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'); true;`
    )
  }, [content])

  return (
    <View className="flex-1">
      <Toolbar onCommand={execCommand} />
      <WebView
        ref={webViewRef}
        source={{ html: EDITOR_HTML }}
        onMessage={handleMessage}
        onLoad={execOnLoad}
        className="flex-1"
        scrollEnabled
        originWhitelist={['*']}
        dataDetectorTypes="none"
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  )
}

interface ToolbarProps {
  onCommand: (command: string, value?: string) => void
}

function Toolbar({ onCommand }: ToolbarProps) {
  const buttons = [
    { label: 'B', command: 'bold' },
    { label: 'I', command: 'italic' },
    { label: 'U', command: 'underline' },
    { label: 'H1', command: 'formatBlock', value: 'h1' },
    { label: 'H2', command: 'formatBlock', value: 'h2' },
    { label: '•', command: 'insertUnorderedList' },
    { label: '"', command: 'formatBlock', value: 'blockquote' },
  ]

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-200 bg-white"
    >
      <View className="flex-row items-center gap-1 px-2 py-2">
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.command + (btn.value || '')}
            onPress={() => onCommand(btn.command, btn.value)}
            className="rounded-md px-3 py-1.5 active:bg-gray-100"
          >
            <Text className="text-sm font-medium text-gray-700">{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
