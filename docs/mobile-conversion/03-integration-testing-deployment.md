# MD File 3: Integration, Testing, and Deployment Guide

## Somatic Canticles -- React Native (Expo) Mobile Conversion

This document covers the sync engine protocol, conflict resolution strategy, API integration layer, testing pyramid, CI/CD pipeline, app store submission process, OTA update strategy, performance optimizations, and monitoring infrastructure for the Somatic Canticles mobile application.

---

## 1. Sync Engine Implementation

The sync engine provides bidirectional data synchronization between the local SQLite database (via Drizzle ORM) and the remote Supabase PostgreSQL backend. The protocol follows a push-then-pull model triggered by lifecycle events.

### Sync Protocol Sequence

The full sync cycle proceeds through four ordered phases:

1. **Network Check**: On app startup, the engine queries `NetInfo.fetch()` to determine connectivity. If offline, sync is deferred and mutations accumulate in the queue. A `NetInfo.addEventListener` callback triggers sync when connectivity is restored.

2. **PUSH Phase**: The engine queries the local `mutationQueue` table for all rows where `synced = false`, ordered by `createdAt` ascending (FIFO). These mutations are batched into a single `POST /api/mobile/sync` request containing `{ mutations: [...], lastSyncedAt: ISO_timestamp }`. The server processes each mutation with entity-specific conflict rules and returns the count of applied mutations plus any conflicts.

3. **PULL Phase**: Immediately after the push, the engine issues `GET /api/mobile/sync?since=lastSyncedAt` to retrieve server-side changes. The response includes change sets grouped by entity type. The engine applies these within a single SQLite transaction to maintain consistency.

4. **Metadata Update**: On successful completion, the engine updates the `syncMetadata` table with the new `lastSyncedAt` from the server's `serverTimestamp`, ensuring the next sync fetches only incremental changes.

### Mutation Queue Design

Every local write operation produces a mutation record persisted in the `mutationQueue` SQLite table:

```
mutationQueue {
  id: TEXT PRIMARY KEY (UUID v4)
  entityType: TEXT (highlights | bookmarks | userProgress | biorhythmSnapshots)
  entityId: TEXT (UUID of the affected entity)
  action: TEXT (create | update | delete)
  payload: TEXT (JSON-serialized entity data)
  createdAt: TEXT (ISO 8601 timestamp)
  synced: INTEGER (0 = pending, 1 = synced)
}
```

Mutations are processed in strict FIFO order. After a successful push, confirmed mutations are marked `synced = 1`. Failed mutations remain in the queue for the next sync attempt. Mutations older than 30 days that have been synced are periodically pruned.

### Per-Entity Sync Rules

**Chapters** are pull-only. The server sends the full chapter list with `updatedAt` timestamps. The engine compares against local copies and inserts or updates as needed.

**Highlights** use bidirectional sync. Local creates and deletes are pushed; server state is pulled and merged. On conflict, the client wins because user annotation intent is authoritative.

**Bookmarks** follow the same bidirectional pattern as highlights with client-wins conflict resolution.

**UserProgress** uses bidirectional sync with field-level merging: `MAX(completionPercentage)`, earliest non-null `completedAt`, and summed `timeSpentSeconds` deltas. Progress is never lost.

**Achievements** and **Streaks** are pull-only. The server evaluates unlock conditions and calculates streaks from complete activity history.

**BiorhythmSnapshots** are calculated on the client and cached on the server. The server stores but does not modify them.

### New API Endpoint

`POST /api/mobile/sync` accepts the following request structure:

```json
{
  "mutations": [
    { "id": "uuid", "entityType": "highlights", "entityId": "uuid",
      "action": "create", "payload": { ... }, "createdAt": "ISO" }
  ],
  "lastSyncedAt": "2026-02-20T00:00:00.000Z"
}
```

The response returns:

```json
{
  "applied": 3,
  "conflicts": [ { "entityType": "userProgress", "entityId": "uuid", "resolution": "merged" } ],
  "serverChanges": { "chapters": [...], "highlights": [...], "achievements": [...] },
  "serverTimestamp": "2026-02-20T12:00:00.000Z"
}
```

### Background Sync Triggers

Sync triggers on three events: (1) `AppState` transitions to `active` (app foregrounded), (2) `NetInfo` detects offline-to-online transition, and (3) a periodic 15-minute interval while the app remains active.

---

## 2. Conflict Resolution Strategy

The sync engine uses a last-write-wins baseline with entity-specific overrides designed to preserve user intent and prevent data loss.

### Entity Conflict Matrix

| Entity | Direction | Conflict Strategy | Rationale |
|---|---|---|---|
| chapters | Server to Client | No conflict possible | Server-only writes |
| highlights | Bidirectional | Client wins | User annotation intent is primary |
| bookmarks | Bidirectional | Client wins | User bookmark intent is primary |
| userProgress | Bidirectional | Field-level merge | Never lose progress |
| achievements | Server to Client | Server wins | Server validates unlock conditions |
| streaks | Server to Client | Server wins | Server has complete activity history |

### UserProgress Merge Logic

When both client and server have modified the same `userProgress` record, the engine applies field-level merging:

- `completionPercentage`: `MAX(client_value, server_value)` -- progress only moves forward.
- `timeSpentSeconds`: `SUM(client_delta, server_value)` -- reading time accumulates from all sessions.
- `completedAt`: The earliest non-null timestamp between client and server, preserving the original completion moment.
- `notes`: If both sides modified notes, concatenate with a delimiter: `client_notes + "\n---\n" + server_notes`. This prevents silent data loss on note edits.

### Tombstone-Based Deletes

Entities are never hard-deleted during sync. A `deletedAt` timestamp is set instead. The sync engine propagates soft deletes bidirectionally: pull-phase records with `deletedAt` are marked deleted locally, and push-phase local deletions are sent as mutation records with `action: "delete"`. Tombstones are cleaned up after 30 days from both local SQLite and the server.

### Conflict Logging

All detected conflicts are recorded in a local `conflictLog` SQLite table containing: `id`, `entityType`, `entityId`, `clientValue` (JSON), `serverValue` (JSON), `resolution` (which side won or how merge was applied), and `resolvedAt`. This table supports debugging sync issues and is excluded from the sync process itself. Conflict logs older than 90 days are pruned automatically.

---

## 3. API Integration and Mobile Endpoints

### Reusing the Existing Hono API

The mobile app reuses all existing Hono API endpoints running on Cloudflare Workers. No backend rewrite is required. The current endpoints for auth, chapters, biorhythm, progress, bookmarks, and highlights remain unchanged.

### CORS Configuration Update

The Hono CORS middleware must be updated to allow mobile origins. Add `somatic-canticles://` (the custom URL scheme) and `exp://` (the Expo development client scheme) to the allowed origins list alongside the existing `localhost:3000`, `*.vercel.app`, `*.pages.dev`, and `somatic-canticles.pages.dev` entries.

### New Mobile-Specific Endpoints

Three new endpoints are added to the Hono API:

- `POST /api/mobile/sync`: The batch sync endpoint described in Section 1. Accepts a mutation array and returns server changes since the provided timestamp.
- `GET /api/mobile/audio-manifest`: Returns a JSON array of all canticle audio files with their download URLs, file sizes in bytes, duration in seconds, and content hashes for cache validation. This allows the app to present download progress and manage storage efficiently.
- `POST /api/mobile/register-push-token`: Accepts `{ token: string, platform: "ios" | "android" }` and stores the Expo push token associated with the authenticated user. Tokens are used for remote push notifications including streak reminders and achievement unlocks.

### Auth Header Injection

The API client wrapper injects `Authorization: Bearer <token>` into all Hono API requests. The access token comes from the Supabase client session. On `401 Unauthorized`, the wrapper calls `POST /auth/refresh` with the stored refresh token, obtains a new access token, and retries the original request once. If refresh fails, the user is redirected to login.

### Request Resilience

All data requests use a 10-second timeout. Audio download requests use a 60-second timeout. Failed requests are retried with exponential backoff: 1 second, 2 seconds, 4 seconds, then 8 seconds, with a maximum of 3 retry attempts. Network errors and 5xx server responses trigger retries. Client errors (4xx other than 401) are not retried.

---

## 4. Testing Strategy

### Testing Pyramid

The project follows a standard testing pyramid: 70% unit tests, 20% integration tests, and 10% end-to-end tests. Coverage targets are 80% for unit tests, 60% for integration tests, and 6 critical E2E flows.

### Unit Tests (Jest + React Native Testing Library)

Unit tests validate isolated logic and component rendering:

**Biorhythm Calculations**: Test `isPeak()`, `isCritical()`, and `getCycleStatus()` against known date inputs with deterministic expected outputs. Verify physical (23-day), emotional (28-day), and intellectual (33-day) cycle calculations produce correct sine-wave positions.

**Sync Engine**: Test the mutation queue processor in isolation: verify FIFO ordering, test that failed mutations remain in queue, confirm synced mutations are marked correctly. Test each conflict resolution function: verify `MAX` selection for completionPercentage, `SUM` for timeSpentSeconds, earliest-timestamp selection for completedAt, and concatenation for notes.

**Zustand Stores**: Test state transitions for each store -- verify that dispatching actions produces expected state shapes, test selectors return correct derived data, and confirm store hydration from AsyncStorage restores persisted state correctly.

**Component Rendering**: Test `ChapterCard` renders correct title, progress bar percentage, and lock state. Test `AchievementCard` displays earned versus locked states. Test `CycleBars` renders three bars with correct heights proportional to biorhythm values. All component tests use mock data fixtures.

**API Client**: Test request URL construction, header injection, JSON serialization. Test error handling: verify 401 triggers refresh flow, verify retry logic respects backoff timing, verify timeout errors are surfaced correctly.

### Integration Tests (Jest + MSW)

Integration tests use Mock Service Worker (MSW) to intercept network requests and simulate server behavior:

**Auth Flow**: Test the complete sequence: call login with credentials, verify session tokens are stored, make an authenticated request, verify the auth header is present, simulate token expiry, verify automatic refresh and request retry.

**Sync Flow**: Create a local mutation in SQLite, trigger sync, verify the MSW handler receives the correct mutation payload, return mock server changes, verify local database is updated with server data.

**Offline-to-Online Transition**: Create multiple mutations while the network mock returns failures. Simulate network restoration via NetInfo mock. Verify all queued mutations are pushed in a single batch and local state reconciles with server response.

### E2E Tests (Maestro)

Maestro is chosen over Detox for three reasons: YAML-based test definitions require no compilation step, setup is simpler with Expo managed workflow (no native build configuration needed), and Maestro supports both iOS and Android from the same test files.

Six critical user flows are tested:

1. **Login Flow**: Launch app, enter email and password, tap login, verify dashboard screen loads with user greeting.
2. **Chapter Reading**: From dashboard, scroll to chapter list, tap an unlocked chapter, verify scene content renders, scroll through scenes.
3. **Highlight Creation**: While reading, long-press text to highlight, select color, confirm highlight persists after navigating away and returning.
4. **Bookmark Persistence**: Create a bookmark on a scene, navigate to a different chapter, return to bookmarks list, verify the bookmark entry exists.
5. **Audio Playback**: Navigate to a chapter with audio, tap the download button, wait for completion, tap play, verify playback controls are visible, background the app, verify audio continues.
6. **Discord Linking**: Navigate to settings, tap Link Discord, verify OTP screen appears, enter code, verify success state.

Example Maestro YAML for the login flow:

```yaml
appId: com.somaticanticles.app
---
- launchApp
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "testpassword123"
- tapOn: "Sign In"
- assertVisible: "Welcome back"
```

### Test Data

A seed script populates the local SQLite database with sample data: 3 unlocked chapters with scene content, 2 locked chapters, 5 highlights, 3 bookmarks, a userProgress record at 40% completion, 2 earned achievements, and a 5-day streak. This seed runs before integration and E2E test suites.

---

## 5. CI/CD Pipeline

### GitHub Actions Workflow

The pipeline triggers on pushes to `main` and `develop` branches, and on pull requests targeting `main`. Jobs run sequentially to ensure each gate passes before proceeding.

**Lint Job**: Runs `bunx eslint . --ext .ts,.tsx` with the React Native ESLint configuration. Fails the pipeline on any error-level violations. Warnings are reported but do not block.

**Typecheck Job**: Runs `bunx tsc --noEmit` with TypeScript strict mode enabled. This catches type errors without producing output files. The `tsconfig.json` extends Expo's base configuration with strict null checks and no implicit any.

**Unit Test Job**: Runs `bun test` with the Jest React Native preset. Generates a coverage report in lcov format. A GitHub Actions step posts the coverage summary as a comment on the pull request using a coverage reporter action. The job fails if coverage drops below the 80% threshold.

**EAS Build Job**: Builds are triggered based on the branch context:

- `feature/*` branches: Development profile builds targeting iOS Simulator and Android emulator APK. These are used for local team testing.
- `develop` branch: Preview profile builds using internal distribution. iOS builds go to TestFlight internal group. Android builds go to the Play Console internal testing track.
- `main` branch: Production profile builds creating store-ready artifacts. iOS generates an IPA signed with distribution certificate. Android generates an AAB (Android App Bundle).

The `eas.json` build profiles are configured as:

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "channel": "preview" },
    "production": { "channel": "production", "autoIncrement": true }
  }
}
```

**E2E Test Job**: After the preview build completes, Maestro flows run against the built artifact on a CI emulator. Each flow captures a screenshot on failure, which is uploaded as a GitHub Actions artifact for debugging. The job installs Maestro via the official CLI installer and runs all YAML flows in the `e2e/` directory.

### Branch Strategy

The branching model maps directly to distribution channels: `main` deploys to production (App Store and Play Store), `develop` deploys to preview (TestFlight and Internal Testing), and `feature/*` branches produce development builds for team testing. Merges to `develop` require passing CI. Merges to `main` require passing CI plus one code review approval.

---

## 6. App Store and Play Store Submission

### Apple App Store

An Apple Developer Account ($99/year) is required. EAS handles certificate generation and provisioning profile management automatically through its credentials service, eliminating manual certificate management.

TestFlight distribution is configured through EAS Submit. Internal testers (up to 25) receive builds immediately without review. External testers (up to 10,000) require a brief beta review by Apple. The `eas submit --platform ios` command uploads the build and configures TestFlight metadata.

App Store Connect requires: app name ("Somatic Canticles"), subtitle, description, keywords (meditation, biorhythm, wellness, reading), and primary category (Health & Fitness or Books). Screenshots are required for 6.7-inch (iPhone 15 Pro Max) and 6.5-inch (iPhone 11 Pro Max for backward compatibility) display sizes. A privacy policy URL is mandatory.

The content rating self-assessment must accurately reflect that the app contains wellness and meditation content. Review guidelines require that the app avoids making medical claims -- all biorhythm features should be described as informational and for personal reflection only.

### Google Play Store

A Google Play Console account requires a one-time $25 fee. EAS Build produces AAB format for Android, which is the required format for Play Store distribution.

The release track progression follows: internal testing (immediate access for team), closed testing (invite-only beta testers), open testing (public beta), and finally production release. Each promotion between tracks can be done through the Play Console.

Store listing requires: app title (50 character limit), short description (80 characters), full description (4000 characters), and screenshots for phone (minimum 2) and 7-inch tablet displays. The feature graphic (1024x500 pixels) appears at the top of the store listing.

The IARC content rating questionnaire must be completed to receive a rating. The data safety section must declare that the app collects account information (email, username) and usage data (reading progress, biorhythm data) via Supabase, and that data can be deleted upon user request.

### Shared Requirements

The app icon must be provided at 1024x1024 pixels. For Android, an adaptive icon with separate foreground and background layers is required. Version numbering follows semantic versioning (1.0.0) with the build number auto-incremented by EAS on each build. Both platforms require a privacy policy hosted at a public URL.

---

## 7. OTA Updates Strategy

### EAS Update Configuration

EAS Update enables over-the-air delivery of JavaScript bundle changes without requiring a full native rebuild. This covers UI changes, bug fixes, new screens, and logic updates. Native module changes (new Expo SDK versions, new native dependencies) still require a full EAS Build.

### Update Channels

Three channels map to the branch strategy: `production` receives stable releases published manually after verification, `preview` receives automatic updates on every merge to `develop`, and `development` receives automatic updates on feature branch pushes. Each channel is linked to its corresponding build profile in `eas.json`.

### Update Policies

**Critical updates** (security fixes, data integrity issues) use a force-update pattern. On app launch, `expo-updates` checks for available updates. If a critical update is flagged, the app displays a blocking modal and applies the update before allowing the user to proceed.

**Feature updates** display a non-blocking banner at the top of the dashboard: "Update Available -- Tap to install." The user chooses when to apply the update. The banner persists across sessions until the update is applied.

**Minor fixes** use silent background updates. The update is downloaded in the background and applied on the next app launch. The user experiences no interruption.

### Rollback Strategy

EAS Update supports instant rollback by reassigning a channel to a previous update bundle. If Sentry reports a crash rate exceeding 5% within one hour of an update publish, the on-call engineer reassigns the channel to the previous stable bundle. Automated rollback can be configured via a GitHub Actions workflow that polls Sentry's API for crash-free session rates and triggers `eas update --rollback` if the threshold is breached.

### Update Size Optimization

EAS Update transmits only the JavaScript bundle diff, not the full bundle. Typical update sizes range from 100KB to 2MB for logic and UI changes. Larger updates introducing new screens or significant assets range from 2MB to 5MB. The full native binary (50MB+) is never re-downloaded for OTA updates.

---

## 8. Performance Optimization

### Startup Performance

The app targets a cold start time under 2 seconds on a mid-range Android device. This is achieved through several strategies: lazy-loading non-critical screens (Achievements, Settings, Lore) using `React.lazy()` with Suspense boundaries, preloading dashboard data (user profile, chapter progress, active streak) during the splash screen phase using `expo-splash-screen`'s `preventAutoHideAsync()` to hold the splash until data is ready, and deferring non-essential initialization (Sentry setup, push notification registration) until after the first meaningful paint.

### List Performance

All scrollable lists use `FlashList` from Shopify instead of `FlatList` for better scroll performance through cell recycling. Each list specifies `estimatedItemSize`: chapter cards at 120px, achievement cards at 80px, lore entries at 100px. Heterogeneous lists use `getItemType` to enable proper recycling across different view types.

### Image Optimization

The `expo-image` component replaces React Native's `Image` for all rendering. It provides disk and memory caching, blur-hash placeholders during loading, and progressive JPEG support. Chapter covers are served in WebP at 400px for thumbnails and 800px for detail headers.

### Memory Management

The biorhythm wheel rendered with React Native Skia cleans up its canvas and animation listeners via `useEffect` cleanup on unmount. Audio resources managed through `expo-av` are released when leaving the reader screen. The React Native Performance Monitor tracks JS thread frame rate and memory usage during development, with alerts for memory exceeding 200MB.

### Bundle Size

The initial JavaScript bundle targets under 15MB (excluding downloadable audio content). Lucide icons are imported individually (`import { BookOpen } from 'lucide-react-native'`) rather than using barrel imports, which enables tree-shaking of unused icons. The `expo-bundle-analyzer` plugin generates a treemap visualization of the bundle to identify large dependencies. Any single dependency exceeding 500KB triggers a review for alternatives or lazy-loading.

---

## 9. Monitoring and Error Tracking

### Sentry Integration

The Sentry React Native SDK is initialized at app startup with source map uploads configured in the EAS Build process. This enables readable stack traces for production crashes. Each EAS Build automatically uploads source maps to Sentry using the `@sentry/react-native` Expo config plugin, associating maps with the correct release version and distribution build number.

### Performance Monitoring

Sentry's performance monitoring tracks four key metrics: app start duration (time from native launch to first React render), screen load time (time-to-interactive for each navigation route), API response time (duration of each Hono API request), and sync engine duration (total time for a complete push-pull sync cycle). Custom spans wrap the sync engine phases to provide granular timing breakdowns.

### Custom Breadcrumbs

Breadcrumbs provide contextual trail data leading up to errors. The app logs breadcrumbs for: navigation events (screen transitions via React Navigation), sync triggers and completions (including mutation count and duration), audio playback state changes (play, pause, seek, error), offline-to-online transitions (NetInfo state changes), and chapter unlock events. These breadcrumbs appear in the Sentry issue detail view, providing context for reproducing crashes.

### Release Health

The Sentry release health dashboard monitors crash-free session rates with a target of 99.5% or higher. Alerts are configured to notify the team Slack channel when the crash-free rate drops below 99% for any release. Each EAS Update publish creates a new Sentry release, enabling per-update crash tracking.

### User Feedback

The app integrates Sentry User Feedback, triggered by a shake gesture (detected via `expo-sensors` accelerometer). Shaking the device presents a modal where users can describe the issue they encountered. The feedback is attached to the most recent Sentry event, providing direct user context for bug reports. This mechanism supplements the automated crash reporting with qualitative user descriptions.
