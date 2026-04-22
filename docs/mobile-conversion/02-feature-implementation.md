# MD File 2: Feature Implementation Guide

## Somatic Canticles - React Native (Expo) Conversion

This document provides the complete technical blueprint for porting every major feature of the Somatic Canticles web application to React Native using Expo. Each section maps a web component or system to its mobile equivalent, specifying libraries, architectural patterns, data flow, and implementation details. The shared biorhythm calculation layer (`src/lib/biorhythm/types.ts`) remains unchanged and is consumed directly by the mobile codebase as pure TypeScript functions.

---

## 1. Biorhythm Visualization System

### BiorhythmWheel: SVG to Skia Canvas

The web `BiorhythmWheel.tsx` renders four concentric SVG arcs using Framer Motion for transitions. The mobile version replaces this entirely with `@shopify/react-native-skia`, which provides a GPU-accelerated Canvas primitive ideal for custom drawing.

**Ring Geometry.** The wheel draws four concentric arcs representing Physical (inner, `#FF6B6B`), Emotional (`#9B59B6`), Intellectual (`#3498DB`), and Spiritual (outer, `#F1C40F`). Each arc's sweep angle maps to the normalized cycle value from -1 to 1, converted to a 0-360 degree range. The Skia `Path` API constructs each arc using `addArc()` with the cycle-specific radius matching the web's proportional sizing: `size * 0.18`, `size * 0.25`, `size * 0.32`, and `size * 0.39`. Gradient fills use `Shader.MakeLinearGradient` with the cycle color transitioning from full opacity at the arc start to 40% opacity at the arc end, providing visual depth.

**Peak Indicators.** When a cycle value exceeds 0.8 (the `isPeak()` threshold from `types.ts`), a glowing dot renders at that arc's terminal position. This uses a Skia `Circle` with a `BlurMask` filter to create the glow effect. The dot pulses using Reanimated 3's `withRepeat(withTiming())` to animate the blur radius between 2 and 8 pixels.

**Center Text.** The center of the wheel displays the current date and an overall energy level calculated as the average of all four absolute cycle values. This uses Skia's `Text` and `Font` primitives rather than React Native Text components, keeping all rendering within the single Canvas.

**Animation.** When biorhythm data updates, arc sweep angles animate smoothly using Reanimated shared values. Each arc's target angle is a `useSharedValue` that drives the Skia path recalculation on each frame via `useDerivedValue`. Transitions use `withSpring` for organic easing with damping of 15 and stiffness of 90.

### CycleBars: Victory Native Horizontal Bars

The web `CycleBars.tsx` renders horizontal progress bars with CSS transitions. The mobile version uses `VictoryBar` from Victory Native with horizontal orientation. Each bar receives the cycle's normalized value (mapped 0 to 100%), its `colorValue` from `CYCLE_CONFIGS`, and a label showing the percentage alongside the status string returned by `getCycleStatus()`. Bar fill animations use Victory's built-in `animate` prop with a duration of 500ms and easing of `"cubicInOut"`.

### ForecastChart: Victory Line and Area

The web `ForecastChart` uses Recharts for multi-line prediction charts. The mobile version uses `VictoryChart` containing four `VictoryLine` components, one per cycle, each colored by its `CYCLE_CONFIGS[].colorValue`. A `VictoryVoronoiContainer` enables touch interaction: tapping or dragging along the chart reveals a tooltip with that day's values for all four cycles. Two view modes (7-day and 30-day) are toggled via a segmented control above the chart. The 30-day view uses `VictoryArea` with reduced opacity fills beneath each line for visual clarity at the wider scale.

### Dashboard Summary Cards

Four summary cards sit above the charts: peak cycles count (how many cycles currently exceed 0.8), critical days in the forecast (days where any cycle's `isCritical()` returns true), the strongest cycle today (highest absolute value), and the next peak date (earliest date in `PredictionData.peaks` that is in the future). Each card is a pressable NativeWind-styled container with the relevant cycle color accent.

---

## 2. Chapter System

### Chapter List Screen

The chapter list uses `FlashList` from `@shopify/flash-list` for optimal scroll performance across the 12 chapters. Each item renders a `ChapterCard` component. The estimated item size is set to 180 pixels to assist FlashList's recycling algorithm.

### ChapterCard Component

Each `ChapterCard` displays the chapter title, a brief synopsis, the associated cycle color as a left border accent, and the current reading progress as a percentage overlay. Locked chapters render with reduced opacity (0.4) and a lock icon from `lucide-react-native`. Unlocked but unstarted chapters show full opacity with a play indicator. Chapters with associated audio display a small headphone icon in the corner. The card uses NativeWind classes for styling with the cycle-specific border color applied dynamically using a style prop that references `CYCLE_CONFIGS[].colorValue`.

### Chapter Detail Screen

Tapping a card navigates to a detail screen showing the full chapter description, unlock conditions in human-readable form, metadata (word count, estimated read time, scene count), and a prominent "Begin Reading" button. If the chapter is locked, the detail screen instead shows the unlock conditions with the current biorhythm values alongside the required thresholds, giving the user a clear picture of what needs to change.

### Unlock Engine

The web's `unlock-engine.ts` evaluates `ChapterUnlockConditions` against a `BiorhythmState`. This logic ports directly since it is pure TypeScript with no DOM dependencies. The mobile app runs this evaluation on each biorhythm recalculation (triggered on app foreground or daily schedule). When a chapter transitions from locked to unlocked, the app stores the unlock event in the local SQLite `chapterUnlocks` table and triggers the unlock animation.

---

## 3. Chapter Reader -- The Core Experience

The `ChapterReader.tsx` is the largest and most complex component in the web codebase at 52KB. The mobile port decomposes this monolith into a coordinated set of smaller components managed by a `ReaderProvider` context.

### Scene-Based Navigation

Chapter content is authored in Markdown where `##` headers delimit scenes. The web's `parseManuscriptIntoScenes()` utility from `manuscript-utils.ts` splits content by these headers, returning an array of `ManuscriptScene` objects. This function is pure TypeScript and ports directly. On mobile, each scene renders within a `ScrollView` with `ref` anchors tracked via `onLayout` callbacks that record each scene's Y offset. A scene index component at the bottom of the screen shows navigation dots (one per scene, filled for current, outlined for others). Previous and Next buttons flank these dots. Tapping a dot or button calls `scrollViewRef.current.scrollTo({ y: sceneOffsets[index], animated: true })`. The current scene is determined by comparing the scroll position against stored offsets using an `onScroll` handler with a throttle of 100ms.

### Markdown Rendering

The mobile reader uses `react-native-markdown-display` with a custom rules object. Standard rules handle headings, paragraphs, lists, bold, italic, code blocks, and blockquotes with NativeWind-compatible styling. Two custom rules extend the base renderer.

**Lore Term Detection.** A preprocessing step runs a regex scan against all keys in `LORE_DEFINITIONS` (imported from `lore.ts`). The regex is constructed by joining all term keys with the pipe operator, wrapped in word boundaries: `new RegExp('\\b(' + terms.join('|') + ')\\b', 'gi')`. Matched terms are wrapped in a custom `LoreTerm` component that renders as a styled `Text` with an underline and the term's category color. Pressing the term opens the lore bottom sheet pre-focused on that entry.

**Choice Blocks.** Content within triple-backtick `choice` fences renders as a vertical stack of pressable buttons. Each choice option is a line within the block. Selecting a choice records the selection in local state and applies a selected style (filled background with the chapter's cycle color).

### Highlight System

Text selection on React Native presents platform-specific challenges. The implementation uses a custom approach where long-pressing within a rendered text block activates selection mode. The `onSelectionChange` event on the underlying `TextInput` (rendered in read-only mode for selectable text) captures the start and end indices. Once a selection exists, a floating color picker appears above the selection showing four circular buttons: primary (`#3498DB`), gold (`#F1C40F`), resonance (`#06b6d4`), and danger (`#f87171`). Tapping a color saves the highlight to the local SQLite `highlights` table with columns: `id`, `chapterId`, `sceneIndex`, `startOffset`, `endOffset`, `text`, `color`, and `createdAt`. The highlight then renders immediately as a colored background span on the matching text range.

### Bookmark System

Each scene header row includes a bookmark icon (outline when unbookmarked, filled when bookmarked). Tapping toggles the bookmark state and persists it to the local `bookmarks` table with columns: `id`, `chapterId`, `sceneIndex`, `createdAt`. A "Jump to Bookmark" option in the reader menu presents a list of bookmarked scenes for the current chapter, allowing quick navigation.

### Reader Controls

Four control options persist across reader sessions. **Font size** cycles through four levels (14, 16, 18, 22 points) stored in the Zustand `settingsStore` and applied via a dynamic style on the markdown container. **Focus mode** hides the status bar using `StatusBar.setHidden(true)` and removes the navigation header and bottom scene bar, expanding the reading area to full screen within `SafeAreaView` bounds. **Theme toggle** switches between light and dark color schemes using NativeWind's `useColorScheme` hook, toggling the `dark` class on the root container. **Progress tracking** updates automatically as the user scrolls, calculating the percentage of total content height consumed and syncing to the server via debounced API calls every 5 seconds.

---

## 4. Lore and Oracle System

### Bottom Sheet Oracle

The web `OraclePopover.tsx` renders a floating popover for searching and browsing lore definitions. On mobile, this becomes a `@gorhom/bottom-sheet` that slides up from the screen bottom with snap points at 40% and 85% of screen height.

The sheet content contains a search input at the top with real-time filtering as the user types. Below the search bar, a horizontal `ScrollView` of category filter chips represents the seven lore categories: technology, spiritual, biological, protocol, consciousness, technical, and cosmic. Each chip is a pressable pill-shaped element that toggles its category filter. When active, the chip fills with the category's assigned color. The filtered results appear in a `FlashList` below the chips, each entry showing the term name in bold, a small category badge, and the definition text truncated to three lines with an expand toggle.

### Inline Lore in Reader

As described in the Reader section, lore terms detected via regex render as tappable styled text. When tapped, the lore bottom sheet opens with its search field pre-populated with the tapped term and the results filtered to show that specific entry at the top. This creates a seamless lookup flow where the user can then browse related terms without leaving the reader.

### Related Lore Panel

A collapsible side panel (implemented as a `@gorhom/bottom-sheet` sliding from the right via a custom layout) shows lore entries related to the current chapter's themes. This panel is populated by matching chapter metadata tags against lore categories, surfacing the most relevant definitions for the content being read.

---

## 5. Highlights and Bookmarks

### Highlight Creation Flow

The highlight creation process involves three stages. First, the user long-presses on a text block within the reader. This activates selection mode using React Native's built-in text selection, capturing the selected range via `onSelectionChange`. Second, once a valid selection exists (minimum 3 characters), a floating toolbar animates in above the selection using Reanimated's `FadeIn` layout animation. The toolbar shows four colored circles representing the highlight palette. Third, tapping a color commits the highlight: the selected text, its position indices, scene index, and chosen color are written to the SQLite `highlights` table. The markdown renderer immediately reflects the new highlight by checking rendered text ranges against stored highlights and applying the corresponding background color.

### Bookmark Management

Bookmarks are per-scene toggles. The bookmark icon in each scene's header serves as both indicator and toggle. When tapped, the bookmark record is either inserted into or deleted from the SQLite `bookmarks` table. A dedicated "Bookmarks" tab in the reader's settings menu lists all bookmarks for the current chapter, sorted by scene order, each showing the scene title and a tap target to scroll to that position.

### Offline Persistence and Sync

Both highlights and bookmarks are stored locally first in SQLite tables managed by Drizzle ORM. A sync manager runs on a 30-second interval when the app has network connectivity, pushing unsynced local records (identified by a `syncedAt` null column) to the Supabase backend. Conflicts are resolved with a last-write-wins strategy using timestamps. When the app comes online after an offline period, the sync manager runs immediately and reconciles both directions: local changes push up and server changes pull down.

---

## 6. Achievements and Streaks

### Achievement Card Component

Each achievement card renders an icon from `lucide-react-native`, the achievement title, a description, and a progress bar for incomplete achievements. The card's border color reflects the achievement's rarity: common uses `#9CA3AF` (gray), rare uses `#3B82F6` (blue), epic uses `#8B5CF6` (purple), and legendary uses `#F59E0B` (gold). Unlocked achievements display a subtle shimmer animation using Reanimated's `withRepeat` on a linear gradient overlay that translates horizontally across the card every 3 seconds. The unlock moment triggers a scale-up animation from 0.8 to 1.0 combined with an opacity fade-in.

### Achievement Gallery

The gallery screen uses `FlashList` with a `SectionList`-style layout, grouping achievements by rarity (legendary at top, common at bottom). Each section header shows the rarity name with its color and the count of unlocked versus total achievements in that tier. The screen header displays the overall completion percentage across all 8 achievement types.

### Streak System

The streak display appears prominently on the dashboard showing the current consecutive-day count alongside a fire icon that scales proportionally to streak length (capped at 2x at 30 days). Below it, the longest streak record provides historical context. The freeze mechanic shows the remaining freeze count (typically 2 per month) with a snowflake icon. Activating a freeze consumes one charge and preserves the streak for one missed day. The freeze button is disabled when no freezes remain or when the user has already checked in today.

### Unlock Celebration Modal

The web's `UnlockAnimation.tsx` runs a 5-phase cinematic sequence over 13 seconds using Framer Motion. The mobile port uses Reanimated 3 with sequenced animations. Phase 1 (0-2s): the screen darkens to black with a pulsing circular glow at center using `withRepeat(withSequence())`. Phase 2 (2-5s): a vertical light beam expands from center using animated height and opacity values. Phase 3 (5-8s): the achievement or chapter symbol fades in and scales from 0.5 to 1.0 within the beam. Phase 4 (8-11s): the title text and description type in character by character using a timed index that increments every 50ms. Phase 5 (11-13s): particles disperse outward using 20 animated `View` elements with randomized trajectories calculated via `withSpring` to random X/Y offsets, while the main content fades out. The entire sequence runs inside a full-screen `Modal` with transparent background.

---

## 7. Audio System

### react-native-track-player Configuration

The audio system uses `react-native-track-player` which provides true background playback, lock screen controls, and notification media integration. Setup requires registering a playback service in the app's entry point that handles remote events (play, pause, skip, seek). The service runs in a separate native thread, ensuring audio continues when the app is backgrounded or the screen is locked.

**Track Metadata.** Each of the 13 canticles is registered as a track with: title (chapter name), artist ("Somatic Canticles"), artwork (a URI to the chapter's icon stored locally or fetched remotely), and duration. The track queue can hold all 13 tracks for sequential playback or a single track for focused listening.

### Audio Player Component

The player component appears as a persistent bottom bar when audio is active, collapsible to a mini-player showing only the track title and play/pause button. Expanding it reveals the full interface: a scrubber bar showing elapsed and remaining time, play/pause button, 15-second skip-back and skip-forward buttons, and a speed selector cycling through 0.5x, 1x, 1.5x, and 2x via `TrackPlayer.setRate()`. A sleep timer option allows the user to set audio to stop after 15, 30, 45, or 60 minutes using a background timer that calls `TrackPlayer.pause()` on expiry.

### Download System

Audio downloads use `expo-file-system`'s `downloadAsync` and `createDownloadResumable` APIs. Each download targets the app's document directory at `${FileSystem.documentDirectory}canticles/{trackId}.mp3`. Download progress is tracked via the resumable callback and displayed as a circular progress indicator on the download button. Completed downloads are recorded in the SQLite `downloadedAudio` table with columns: `trackId`, `filePath`, `downloadedAt`, and `sizeBytes`. The storage management screen aggregates total downloaded size (estimated maximum of 200MB for all 13 canticles) and allows individual track deletion. When a track is available locally, the player loads from the local file path instead of the remote URL. Background downloads on iOS use `NSURLSession` via Expo's native module integration.

### Auto-Play Integration

An optional setting triggers audio playback when the user opens a chapter in the reader. If the chapter's canticle is downloaded, playback begins from the local file. Otherwise, it streams from the remote URL. The auto-play preference is stored in `settingsStore` and toggled in the reader's settings menu.

---

## 8. Discord Bot Integration

### Discord OAuth via Supabase

The Discord authentication flow uses Supabase Auth's built-in Discord provider. The mobile app initiates the OAuth flow by opening a web-based auth URL via `expo-auth-session`, which handles the redirect through the registered deep link scheme: `somatic-canticles://auth/callback`. Upon successful authentication, the callback delivers an authorization code that the app exchanges for a Supabase session. The Discord user ID is then associated with the user's profile record.

### OTP Linking Flow

For users who prefer linking without full OAuth, a one-time password flow is available. The user runs the `/link` slash command in the Somatic Canticles Discord server. The bot generates a 6-digit alphanumeric OTP in the format `X7-K9-P2`, stores it in the `discordOtps` database table with a 10-minute expiry timestamp, and DMs it to the user. In the mobile app's Settings screen under "Discord Integration," the user enters this OTP into a formatted input field. The app calls the `/api/discord/verify-otp` endpoint, which validates the OTP against the stored record, checks expiry, and if valid, writes the `discord_id` to the user's profile and deletes the OTP record. Successful linking displays a confirmation with the Discord username.

### Bot DM Notifications

Once linked, the Discord bot sends contextual DM notifications based on user activity and biorhythm changes. Chapter unlock messages include the chapter number, title, and which cycle peaked to trigger it. Daily biorhythm summaries provide all four cycle percentages formatted as a compact message. Streak reminders alert users when their streak is at risk of breaking. All bot notifications respect the user's `discordListening` toggle stored in their profile settings, which is configurable from the mobile app's Settings screen.

---

## 9. Push Notifications

### expo-notifications Setup

Push notification support uses `expo-notifications` with platform-specific backends: Apple Push Notification service (APNs) for iOS and Firebase Cloud Messaging (FCM) for Android. The setup requires requesting permission on first launch via `Notifications.requestPermissionsAsync()`, registering the device token with the Supabase backend via `Notifications.getExpoPushTokenAsync()`, and configuring notification categories for interactive actions.

### Local Notifications

Three types of local notifications operate without server involvement. **Biorhythm peak alerts** run a daily background task (using `expo-task-manager`) that calculates the current biorhythm values and schedules a notification if any cycle crosses the 0.8 peak threshold. **Streak reminders** schedule a notification for 8 PM local time if the user has not opened the app that day, prompting them to maintain their streak. **Chapter unlock alerts** trigger when the local biorhythm calculation detects that unlock conditions for a previously locked chapter are now satisfied.

### Remote Notifications

Server-sent notifications handle events that originate outside the device. **Content updates** notify users when new chapters or lore entries are published, triggered by a Supabase Edge Function that iterates registered device tokens. **Discord-forwarded events** convert Discord bot triggers into push notifications for users who have both Discord linked and push enabled, ensuring they receive alerts even when Discord is not installed.

### Notification Categories and Actions

Two notification categories provide quick actions. The "chapter" category includes a "Read Now" action that deep links directly to the chapter reader via the URL scheme `somatic-canticles://chapter/{id}`. The "dashboard" category includes a "View Dashboard" action linking to `somatic-canticles://dashboard`. Permission handling degrades gracefully: if the user denies push permissions, all notification-dependent features fall back to in-app indicators (badge counts, banner messages on the dashboard) without disrupting core functionality.
