# StoryWrite — Development Progress

**Tagline:** *"Capture your life. Share your story."*

---

## Legend

- ✅ Done
- 🔄 In Progress
- ⬜ Not Started

---

## Phase 0: Project Setup
- ✅ Rename from Auralis_App to StoryWrite
- ✅ Install Expo SDK 54 dependencies
- ✅ Configure Expo Router (file-based routing)
- ✅ Set up TypeScript strict mode
- ✅ Install: expo-sqlite, zustand, @10play/tentap-editor, expo-image-picker, expo-linear-gradient, react-native-webview, react-native-gesture-handler, react-native-screens

---

## Phase 1: Data Layer
- ✅ SQLite schema (`stories` table)
- ✅ Database CRUD helpers (init, getAll, getById, insert, update, delete)
- ✅ Zustand store with full CRUD + duplicate + sort/view state
- ✅ Auto-save hook (5s debounce + app background save)
- ✅ Word/character count hook

---

## Phase 2: Navigation
- ✅ Root layout (GestureHandler + SafeArea + Stack navigator)
- ✅ Tab layout (Library + Settings)
- ✅ Route: `(tabs)/index` — Story Library
- ✅ Route: `(tabs)/settings` — Settings placeholder
- ✅ Route: `story/new` — Create story redirect
- ✅ Route: `story/[id]` — Read story view
- ✅ Route: `story/[id]/edit` — Rich text editor
- ✅ Route: `story/[id]/cover` — Cover creator

---

## Phase 3: Story Management (MVP)
- ✅ Create story (FAB on library screen)
- ✅ Save draft (auto-save every 5s + on background)
- ✅ Rich text editor (Bold, Italic, Underline, H1, H2, Lists, Blockquote)
- ✅ Character count
- ✅ Word count
- ✅ Story library (grid view)
- ✅ Story library (list view)
- ✅ Sort by: Recently Updated / Alphabetical / Creation Date
- ✅ Read/open story
- ✅ Edit story
- ✅ Delete story (with confirmation dialog)
- ✅ Duplicate story

---

## Phase 4: Cover Creator (MVP)
- ✅ Color picker (12 preset colors)
- ✅ Gradient picker (8 preset gradients)
- ✅ Image picker (from device gallery)
- ✅ Title overlay
- ✅ Subtitle overlay
- ✅ Author overlay
- ✅ Save cover to story

---

## Phase 5: UI/UX (MVP)
- ✅ Grid/list view toggle
- ✅ Sort toggle
- ✅ Empty state placeholder
- ✅ Word count bar on editor
- ✅ Delete confirmation dialog
- ✅ "Back", "Edit", "Delete", "Duplicate" buttons on view screen
- ✅ Cover display on view screen

---

## Phase 6: Export ✅

| Feature | Status |
|---|---|
| PDF export | ✅ |
| EPUB export | ✅ |
| Include cover | ✅ |
| Include author | ✅ |
| Include page numbers | ✅ |
| Export modal with toggle options | ✅ |
| Share sheet integration | ✅ |

---

## Phase 7: Story Collections (Post-MVP)

| Feature | Status |
|---|---|
| Collection data model | ⬜ |
| Create/edit collections | ⬜ |
| Add/remove stories from collections | ⬜ |
| Collection cover | ⬜ |
| Nested collections | ⬜ |

---

## Phase 8: Publishing & Sharing (Post-MVP)

| Feature | Status |
|---|---|
| Private / Unlisted / Public toggle | ⬜ |
| Share PDF | ⬜ |
| Share EPUB | ⬜ |
| Share link | ⬜ |
| Share story image preview | ⬜ |

---

## Phase 9: Story Store / Social (Post-MVP)

| Feature | Status |
|---|---|
| Discover feed (Trending, New, Most Read) | ⬜ |
| Follow writers | ⬜ |
| Bookmark stories | ⬜ |
| Like stories | ⬜ |
| Comments | ⬜ |
| Reading history | ⬜ |
| Story pages (cover, author, reading time, views, likes) | ⬜ |

---

## Phase 10: Authentication & Cloud (Post-MVP)

| Feature | Status |
|---|---|
| Email auth | ⬜ |
| Google auth | ⬜ |
| Apple auth | ⬜ |
| Supabase cloud sync | ⬜ |
| Cloud backup | ⬜ |

---

## Phase 11: AI Features (Future)

| Feature | Status |
|---|---|
| AI writing assistant (continue, rewrite, grammar) | ⬜ |
| Mood analysis | ⬜ |
| Story insights (themes, topics, emotions) | ⬜ |
| AI cover generator | ⬜ |
| AI title generator | ⬜ |
| AI story timeline | ⬜ |

---

## Phase 12: Monetization (Future)

| Feature | Status |
|---|---|
| Free tier (unlimited local stories, PDF export, basic covers) | ⬜ |
| Premium tier (cloud sync, AI, EPUB, analytics) | ⬜ |
| Creator tier (publish, profile, monetized stories) | ⬜ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 |
| Language | TypeScript (strict) |
| Navigation | Expo Router 6 |
| UI | React Native + NativeWind (TailwindCSS) |
| State | Zustand |
| Local DB | expo-sqlite |
| Rich Text | Custom WebView editor (via react-native-webview) |
| Covers | expo-linear-gradient, expo-image-picker |
| Animations | react-native-reanimated |
| Gestures | react-native-gesture-handler |

---

*Last updated: 2026-06-17*
