# Somatic Canticles Mobile: Architecture and Foundation

## Document Metadata

- **Document**: 01 of N -- Architecture and Foundation
- **Platform**: React Native (Expo SDK 53)
- **Source Application**: Somatic Canticles Web (Next.js 16 / React 19)
- **Last Updated**: 2026-02-25

---

## 1. Introduction and Migration Strategy

Somatic Canticles is a consciousness and wellness education platform built around a 12-chapter biorhythm-driven narrative. The web application runs on Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, and shadcn/ui, with Supabase handling authentication and a Hono API deployed on Cloudflare Workers using Drizzle ORM against SQLite/D1. The mobile conversion targets React Native with Expo for several reasons specific to this application's nature.

First, the reading experience demands native scroll performance and gesture handling that web views cannot match. Highlights, bookmarks, and long-form chapter content require smooth 60fps interaction. Second, audio canticle playback across 13 tracks totaling approximately 143 minutes needs background audio support, lock-screen controls, and media session integration, all of which are native platform concerns. Third, the biorhythm system depends on daily engagement. Push notifications tied to cycle peaks, critical days, and streak maintenance drive retention in ways that web push notifications cannot reliably deliver across both iOS and Android. Finally, offline reading is a core requirement. Users in retreat settings or low-connectivity environments need full chapter access without network dependency.

The migration follows a parallel development strategy. The web application continues running and receiving updates throughout mobile development. Both clients share the same Hono API on Cloudflare Workers and the same Supabase authentication backend. Code reuse concentrates on three categories: biorhythm calculation logic (the pure TypeScript functions in `src/lib/biorhythm/`), type definitions and API contracts (interfaces like `BiorhythmData`, `CycleConfig`, `PredictionDay`, and the Drizzle schema types), and Zod validation schemas used by the Hono API. These shared artifacts will be extracted into a `packages/shared` workspace package that both the web app and mobile app depend on. UI components are not shared; they are rebuilt using React Native primitives and NativeWind.

---

## 2. Project Setup and Expo Configuration

Initialize the project using the Expo CLI with the TypeScript template. The project lives in a sibling directory to the web app within the same monorepo, managed by a root-level workspace configuration.

```bash
npx create-expo-app@latest somatic-canticles-mobile --template tabs
cd somatic-canticles-mobile
```

Configure the project for Expo SDK 53. The `app.config.ts` file replaces `app.json` for dynamic configuration support. Install EAS CLI globally for build and submission management.

```bash
npm install -g eas-cli
eas init
eas build:configure
```

Install the essential Expo packages that the application requires across its feature set:

```bash
npx expo install expo-secure-store expo-sqlite expo-file-system \
  expo-notifications expo-linking expo-image expo-local-authentication \
  expo-constants expo-device expo-haptics expo-font expo-splash-screen \
  expo-status-bar expo-web-browser expo-crypto
```

Install third-party dependencies for state management, styling, navigation, audio, and animations:

```bash
npx expo install nativewind tailwindcss react-native-reanimated \
  moti react-native-gesture-handler react-native-safe-area-context \
  react-native-screens react-native-track-player \
  @react-native-community/netinfo
npm install zustand @tanstack/react-query \
  @tanstack/query-async-storage-persister @tanstack/react-query-persist-client \
  @supabase/supabase-js drizzle-orm react-native-mmkv date-fns zod
npm install -D drizzle-kit
```

For the development environment, configure both iOS Simulator (Xcode 16+) and Android Emulator (Android Studio with API 34+). Run `npx expo prebuild` to generate native projects when custom native modules require it. During standard development, `npx expo start` launches the Metro bundler with Expo Go or a development build.

---

## 3. Folder Structure

The mobile project mirrors the web application's organizational patterns while adapting to Expo Router conventions. The following tree represents the complete project structure:

```
somatic-canticles-mobile/
  app/                          # Expo Router file-based routes
    _layout.tsx                 # Root layout (providers, fonts)
    index.tsx                   # Entry redirect
    (auth)/
      _layout.tsx               # Auth stack layout
      login.tsx                 # Email/password login
      register.tsx              # Registration
      forgot-password.tsx       # Password reset
    (app)/
      _layout.tsx               # Tab layout with auth guard
      (tabs)/
        _layout.tsx             # Bottom tab navigator
        index.tsx               # Dashboard tab
        chapters/
          index.tsx             # Chapter list
          [id]/
            index.tsx           # Chapter detail
            read.tsx            # Chapter reader
        progress.tsx            # Progress/biorhythm tab
        achievements.tsx        # Achievements tab
        settings.tsx            # Settings tab
      onboarding.tsx            # Modal: first-run flow
      unlock-celebration.tsx    # Modal: chapter unlock
  src/
    components/                 # Reusable UI components
      ui/                       # Primitives (Button, Card, Input)
      chapters/                 # Chapter-specific components
      biorhythm/                # Cycle charts, gauges
      achievements/             # Badge displays, tier cards
      audio/                    # Player bar, track list
    lib/                        # Business logic
      supabase/                 # Supabase client configuration
      biorhythm/                # Calculation logic (shared)
      audio/                    # Track player service
      sync/                     # Offline sync engine
      notifications/            # Push notification handlers
    db/                         # Local SQLite database
      schema.ts                 # Drizzle table definitions
      migrations/               # Schema migration files
      client.ts                 # Database connection
    stores/                     # Zustand state stores
      auth.store.ts
      settings.store.ts
      sync.store.ts
    hooks/                      # Custom React hooks
    types/                      # Shared type definitions
    constants/                  # App-wide constants
  assets/                       # Static assets (images, fonts)
```

The `app/` directory maps directly to the web app's route structure. The web's `app/(dashboard)/chapters/[id]/read/page.tsx` becomes `app/(app)/(tabs)/chapters/[id]/read.tsx` in the mobile project. The `src/lib/` directory mirrors the web's `src/lib/` with identical subdirectory names. Business logic files like biorhythm calculations and type definitions are imported from the shared workspace package, ensuring both platforms compute identical values.

---

## 4. Navigation Architecture

Expo Router v4 provides file-based routing that parallels Next.js App Router conventions. The navigation architecture uses two route groups at the top level: `(auth)` for unauthenticated flows and `(app)` for the authenticated experience.

The root `_layout.tsx` wraps the entire application in providers (QueryClientProvider, theme context, font loading) and handles the initial authentication check. It redirects to `(auth)/login` when no valid session exists and to `(app)` when authenticated.

The `(auth)` group uses a simple stack navigator with three screens: login, register, and forgot-password. These screens have no tab bar and no header back button on the login screen.

The `(app)` group contains the primary tab navigator and modal routes. The tab navigator defines five tabs mapping to the web sidebar navigation:

| Tab | Icon | Web Equivalent |
|-----|------|----------------|
| Dashboard | `LayoutDashboard` | `/dashboard` |
| Chapters | `BookOpen` | `/chapters` |
| Progress | `Activity` | `/dashboard/progress` |
| Achievements | `Trophy` | `/dashboard/achievements` |
| Settings | `Settings` | `/dashboard/settings` |

Within the Chapters tab, a nested stack handles the drill-down flow: Chapter List leads to Chapter Detail leads to Chapter Reader. The reader screen hides both the tab bar and the status bar for an immersive reading experience.

Modal routes sit outside the tab navigator but within the `(app)` group. The onboarding modal presents during first launch to collect the user's birthdate (required for biorhythm calculations) and notification preferences. The unlock celebration modal fires when a chapter's unlock conditions are met, presenting an animated reveal sequence.

Deep linking configuration in `app.config.ts` registers the `somatic-canticles://` scheme. Two deep link patterns are critical. The OAuth callback `somatic-canticles://auth/callback` handles the redirect after Discord and Google sign-in flows. Push notification deep links like `somatic-canticles://chapters/3` navigate directly to specific content when the user taps a notification. The linking configuration maps these URL patterns to the corresponding Expo Router routes.

```typescript
// app.config.ts (partial)
export default {
  scheme: "somatic-canticles",
  plugins: [
    ["expo-router", {
      origin: "https://somatic-canticles.app",
    }],
  ],
};
```

---

## 5. Supabase Client for React Native

The mobile application uses `@supabase/supabase-js` directly rather than `@supabase/ssr`, which is designed for server-side cookie management. The web app creates its client with `createBrowserClient()` from `@supabase/ssr`, relying on HTTP-only cookies for session persistence through middleware. The mobile client takes a fundamentally different approach: tokens are stored in the device's secure enclave via `expo-secure-store`.

Create the Supabase client with a custom storage adapter:

```typescript
// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: SecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

The `detectSessionInUrl` flag is set to `false` because mobile OAuth uses deep link callbacks rather than URL fragment parsing. The `autoRefreshToken` flag ensures the client automatically refreshes the JWT before expiration, maintaining seamless connectivity without user intervention.

Register an auth state change listener at the application root to respond to sign-in, sign-out, and token refresh events. This listener drives navigation decisions (redirecting to login on sign-out) and triggers the sync engine when a session becomes available. The web app achieves this same pattern in its dashboard layout with `supabase.auth.onAuthStateChange`, but the mobile version centralizes the listener in the root layout to avoid multiple subscriptions.

The key architectural difference from the web is the absence of middleware-based session validation. The web app's `middleware.ts` calls `supabase.auth.getUser()` on every request and redirects unauthenticated users. On mobile, this guard lives in the `(app)/_layout.tsx` component, which checks for a valid session before rendering child routes and redirects to the auth group otherwise.

---

## 6. Local SQLite Database

The mobile app uses `expo-sqlite` with Drizzle ORM to maintain a local database that mirrors the server schema. This local database serves two purposes: it enables offline access to all read content and it provides the mutation queue for the sync engine.

Initialize the database connection and Drizzle client:

```typescript
// src/db/client.ts
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const expoDb = openDatabaseSync("somatic-canticles.db");
expoDb.execSync("PRAGMA journal_mode = WAL");
expoDb.execSync("PRAGMA foreign_keys = ON");

export const db = drizzle(expoDb, { schema });
```

The local schema mirrors every table from the web app's `src/db/schema.ts`: `users`, `discordOtps`, `chapters` (with JSON columns for `content`, `unlockConditions`, and `loreMetadata`), `userProgress`, `biorhythmSnapshots` (with all four cycle values and peak booleans), `sunCache`, `streaks` (with `freezesUsed`), `achievements`, `refreshTokens`, `rateLimits`, `notifications`, `highlights` (with `sceneIndex`, `text`, and `color`), and `bookmarks` (with `sceneIndex`). Each table includes a `syncedAt` timestamp column not present in the server schema, used by the sync engine to track the last synchronization time.

Two additional mobile-only tables extend the schema:

```typescript
export const downloadedAudio = sqliteTable("downloaded_audio", {
  trackId: text("track_id").primaryKey(),
  filePath: text("file_path").notNull(),
  downloadedAt: integer("downloaded_at", { mode: "timestamp" }),
  sizeBytes: integer("size_bytes").notNull(),
});

export const syncMetadata = sqliteTable("sync_metadata", {
  entityType: text("entity_type").primaryKey(),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
  pendingChanges: integer("pending_changes").default(0),
});
```

The `downloadedAudio` table tracks which of the 13 canticle audio tracks have been downloaded for offline playback, storing the local file path and size for storage management. The `syncMetadata` table maintains per-entity-type sync cursors so the sync engine knows the high-water mark for each table.

Schema migrations use Drizzle Kit to generate migration files stored in `src/db/migrations/`. On app launch, the database client runs any pending migrations before the application renders. Type definitions are shared between web and mobile through the `packages/shared` workspace, ensuring that a `Chapter` type or `BiorhythmSnapshot` type is identical across both platforms.

---

## 7. Authentication Flow

The mobile app supports three authentication methods through Supabase: email/password, Discord OAuth, and Google OAuth. Each method ultimately produces a Supabase session stored in `expo-secure-store` via the custom storage adapter described in Section 5.

Email and password authentication is the primary flow. The login screen calls `supabase.auth.signInWithPassword()` with the user's credentials. Registration calls `supabase.auth.signUp()` and redirects to a verification screen. Password reset uses `supabase.auth.resetPasswordForEmail()` to send a recovery link. These flows mirror the web app's `app/auth/login/page.tsx` and `app/auth/register/page.tsx` screens but use React Native form components instead of shadcn/ui inputs.

Discord OAuth follows the PKCE flow using `expo-web-browser` and `expo-linking`. The app calls `supabase.auth.signInWithOAuth({ provider: 'discord' })` with a redirect URL of `somatic-canticles://auth/callback`. This opens the system browser for Discord authorization. After the user grants permission, Discord redirects back to the app via the registered deep link. The Expo Router catches this callback in `app/(auth)/callback.tsx`, which exchanges the authorization code for a session using `supabase.auth.exchangeCodeForSession()`. Google OAuth follows the identical pattern with `provider: 'google'`.

The Discord OTP linking flow is unique to this application. Users who already have a Somatic Canticles account can link their Discord identity for bot interactions. The flow works as follows: the user runs the `/link` command in the Somatic Canticles Discord bot, which generates a 6-digit OTP code in the format `X7-K9-P2` and stores it in the `discordOtps` table with a 10-minute expiration. The user enters this code in the mobile app's settings screen. The app sends the code to the Hono API, which validates it against the `discordOtps` table, and if valid, writes the `discordId` to the user's record in the `users` table. This links the accounts without requiring Discord OAuth.

Session persistence relies entirely on `expo-secure-store`. On app launch, the Supabase client automatically restores the session from secure storage and attempts a token refresh if the access token has expired. If the refresh token is also expired, the user is redirected to the login screen.

Biometric authentication via Face ID or Touch ID serves as a convenience unlock. After initial login, the app prompts the user to enable biometric unlock. When enabled, `expo-local-authentication` verifies the user's identity before restoring the stored session. This does not replace Supabase authentication; it gates access to the already-persisted session tokens.

---

## 8. State Management Architecture

The application divides state into two categories: client state managed by Zustand and server state cached by TanStack Query. This separation ensures that UI-specific concerns remain fast and synchronous while data fetching benefits from caching, background refetching, and offline persistence.

Three Zustand stores handle client state:

The `authStore` holds the current Supabase session, user profile data, and authentication status. It exposes actions for sign-in, sign-out, and session refresh. Components access the current user through `useAuthStore((s) => s.user)` without triggering unnecessary re-renders across unrelated state changes.

The `settingsStore` persists user preferences to MMKV storage: theme mode (dark, light, or system), reading font size, notification toggles for cycle peaks and streak reminders, and audio quality preferences. MMKV provides synchronous reads, so settings are available immediately on app launch without async loading states.

The `syncStore` tracks the synchronization engine's operational state: whether a sync is currently in progress, the count of pending mutations in the queue, the timestamp of the last successful sync, and any sync errors. The dashboard displays this information so users understand their offline data freshness.

TanStack Query manages all server-derived data: chapters, user progress, biorhythm snapshots, achievements, streaks, highlights, and bookmarks. The query client is configured with the async storage persister backed by MMKV, ensuring that cached query data survives app restarts. Stale times are tuned per entity type. Chapters use a 24-hour stale time since content rarely changes. Biorhythm snapshots use a 1-hour stale time since values change daily. Highlights and bookmarks use a 5-minute stale time to stay responsive to cross-device edits.

Optimistic updates are critical for the reading experience. When a user creates a highlight or bookmark, the mutation immediately updates the TanStack Query cache before the network request completes. If the request fails, the cache rolls back to the previous state and the mutation enters the sync queue for retry. This pattern ensures that the reading flow is never interrupted by network latency. The implementation uses TanStack Query's `onMutate`, `onError`, and `onSettled` callbacks to manage the optimistic lifecycle.

---

## 9. Offline Sync Engine Design

The sync engine is the most architecturally significant mobile-specific component. It enables full offline functionality by maintaining a local mutation queue and a bidirectional synchronization protocol with the Hono API.

The architecture consists of three subsystems: the mutation queue, the sync manager, and the conflict resolver. When the app performs a write operation (creating a highlight, updating progress, toggling a bookmark), the mutation is recorded in a local `pendingMutations` SQLite table with the entity type, operation type (create, update, delete), the payload, and a timestamp. Simultaneously, the local database is updated so the UI reflects the change immediately.

The sync manager runs on two triggers: a periodic timer (every 5 minutes when the app is foregrounded) and a network state change event from `@react-native-community/netinfo`. When connectivity is restored after an offline period, the sync manager initiates a full sync cycle. Each cycle follows a push-then-pull protocol.

During the push phase, the engine reads all pending mutations from the queue, ordered by timestamp, and sends them to the API in batches. Each successful push removes the mutation from the queue. Failed pushes use exponential backoff with jitter, starting at 1 second and capping at 5 minutes. After 10 consecutive failures, the engine pauses and surfaces an error through the `syncStore`.

During the pull phase, the engine requests changes from the server that occurred after the last known sync timestamp for each entity type. The server responds with the changed records, and the engine applies them to the local database according to per-entity conflict resolution rules.

The conflict resolution rules are specific to each entity type and reflect the domain semantics of Somatic Canticles:

**Chapters** sync server-to-client only. Chapter content is authored by administrators and never modified by users on the client. The pull phase overwrites the local chapter data unconditionally.

**Highlights and bookmarks** use bidirectional sync with client-wins resolution. If a user creates a highlight offline and the same user creates a different highlight on the web, both are preserved. If the same highlight is edited on both platforms (a color change on mobile, a text edit on web), the client version wins because the most recent user intent was on the device in hand.

**User progress** uses bidirectional sync with server-wins merge logic. The merge takes the higher completion percentage between local and server values. If the local record shows 60% completion and the server shows 75%, the merged result is 75%. Time spent seconds are summed rather than replaced, preventing data loss from concurrent reading sessions.

**Biorhythm snapshots** are calculated locally using the user's birthdate and the current date. The client computes values on-device using the shared biorhythm library, stores them locally, and pushes them to the server as a cache. The server does not modify snapshot data.

**Achievements and streaks** sync server-to-client only. The server is the authoritative source for achievement unlocks and streak calculations because these involve validation logic that must not be bypassed by client manipulation.

Network state detection uses `@react-native-community/netinfo` to monitor connectivity changes. The engine distinguishes between online, offline, and degraded states. In degraded mode (slow or unreliable connection), the engine reduces batch sizes and extends retry intervals to avoid overwhelming the network.

---

## 10. Environment and Configuration

The mobile application uses `app.config.ts` for dynamic environment configuration, replacing the static `app.json` approach. Environment variables are injected through EAS build profiles, ensuring that development, preview, and production builds connect to the correct backends.

```typescript
// app.config.ts
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Somatic Canticles",
  slug: "somatic-canticles",
  scheme: "somatic-canticles",
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    enableSentry: process.env.EXPO_PUBLIC_ENABLE_SENTRY === "true",
  },
});
```

EAS defines three build profiles in `eas.json`:

**Development** connects to a local or staging Supabase instance and the development Hono API. It enables debug logging, relaxed rate limits, and the Expo development client for hot reloading with native module support.

**Preview** targets the staging Supabase project and staging Hono API. It produces installable builds distributed through EAS internal distribution for QA testing before release. Push notification certificates are configured for the sandbox APNs environment.

**Production** connects to the production Supabase project and production Hono API on Cloudflare Workers. Sentry error reporting is enabled, debug logging is disabled, and builds are signed for App Store and Play Store submission.

Feature flags control gradual rollout of mobile-specific capabilities. The flags are fetched from the Hono API on app launch and cached locally. Initial flags include `enableOfflineMode` (controls whether the sync engine activates), `enableAudioDownload` (controls canticle download availability), and `enableBiometricAuth` (controls whether the biometric unlock prompt appears). These flags allow shipping the app with features gated behind server-side toggles, enabling incremental activation as each subsystem is validated in production.
