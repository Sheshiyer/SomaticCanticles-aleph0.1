/**
 * Chapter API client functions
 * Chapter API - Client-side chapter operations
 */

import { createClient } from '@/lib/supabase/client';


const CONFIGURED_API_BASE = process.env.NEXT_PUBLIC_API_URL?.trim();
// Always use app-local API routes. These are Supabase-auth aware and avoid
// legacy worker JWT mismatches when NEXT_PUBLIC_API_URL points elsewhere.
const API_BASE_URL = "/api";
const INTERNAL_API_BASE = "/internal-api";

// Cache removed


// Retry config
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Flag to enable mocking (for development)
// Force mock mode if API is localhost:8787 (dev server not running)
const isLocalDev = typeof window !== 'undefined' &&
  (CONFIGURED_API_BASE?.includes('localhost:8787') ||
    CONFIGURED_API_BASE === 'http://localhost:8787');
// USER: Disable mocks to read from real DB
const USE_MOCKS = (typeof window !== 'undefined' && (window as any).__FORCE_API_NETWORK__)
  ? false
  : process.env.NEXT_PUBLIC_USE_MOCK_CHAPTERS === 'true';

// Mock chapters data
const MOCK_CHAPTERS: ChapterSummary[] = [
  {
    id: 1,
    order: 1,
    title: "The Choroid Plexus",
    subtitle: "Gateway to the Inner Sanctum",
    cycle: "physical",
    duration_minutes: 16,
    description: "Begin your journey by establishing connection with your physical foundation.",
    icon_url: null,
    color_theme: "ember",
    unlock_status: "unlocked",
    progress: 0,
    unlocked_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: 2,
    order: 2,
    title: "The Blood-Brain Barrier",
    subtitle: "Guardian of the Sacred",
    cycle: "physical",
    duration_minutes: 14,
    description: "Learn to protect and nurture your inner sanctum.",
    icon_url: null,
    color_theme: "ember",
    unlock_status: "unlocked",
    progress: 0,
    unlocked_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: 3,
    order: 3,
    title: "Cerebrospinal Fluid",
    subtitle: "The River of Life",
    cycle: "emotional",
    duration_minutes: 18,
    description: "Flow with the rhythms of your emotional landscape.",
    icon_url: null,
    color_theme: "ocean",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 4,
    order: 4,
    title: "Neural Pathways",
    subtitle: "Circuits of Consciousness",
    cycle: "intellectual",
    duration_minutes: 15,
    description: "Strengthen the connections of your mental faculties.",
    icon_url: null,
    color_theme: "solar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 5,
    order: 5,
    title: "The Pineal Gland",
    subtitle: "Seat of Intuition",
    cycle: "spiritual",
    duration_minutes: 20,
    description: "Awaken your inner vision and spiritual awareness.",
    icon_url: null,
    color_theme: "lunar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 6,
    order: 6,
    title: "Neuroplasticity",
    subtitle: "The Mutable Self",
    cycle: "physical",
    duration_minutes: 17,
    description: "Embrace the power of transformation and growth.",
    icon_url: null,
    color_theme: "ember",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 7,
    order: 7,
    title: "Synaptic Transmission",
    subtitle: "The Dance of Communication",
    cycle: "emotional",
    duration_minutes: 16,
    description: "Harmonize your internal and external exchanges.",
    icon_url: null,
    color_theme: "ocean",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 8,
    order: 8,
    title: "The Limbic System",
    subtitle: "Garden of Feeling",
    cycle: "emotional",
    duration_minutes: 19,
    description: "Cultivate emotional intelligence and balance.",
    icon_url: null,
    color_theme: "ocean",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 9,
    order: 9,
    title: "Cortical Columns",
    subtitle: "Structures of Thought",
    cycle: "intellectual",
    duration_minutes: 14,
    description: "Build strong foundations for mental clarity.",
    icon_url: null,
    color_theme: "solar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 10,
    order: 10,
    title: "Neurotransmitters",
    subtitle: "Messengers of the Mind",
    cycle: "intellectual",
    duration_minutes: 15,
    description: "Understand the chemistry of consciousness.",
    icon_url: null,
    color_theme: "solar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 11,
    order: 11,
    title: "The Default Mode Network",
    subtitle: "The Self in Repose",
    cycle: "spiritual",
    duration_minutes: 21,
    description: "Discover the power of stillness and reflection.",
    icon_url: null,
    color_theme: "lunar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
  {
    id: 12,
    order: 12,
    title: "Integration",
    subtitle: "The Unified Field",
    cycle: "spiritual",
    duration_minutes: 24,
    description: "Unite all aspects of your being in harmony.",
    icon_url: null,
    color_theme: "lunar",
    unlock_status: "locked",
    progress: 0,
    unlocked_at: null,
    completed_at: null,
  },
];

// Types
export interface ChapterSummary {
  id: number;
  order: number;
  title: string;
  subtitle: string | null;
  cycle: "physical" | "emotional" | "intellectual" | "spiritual" | null;
  duration_minutes: number | null;
  description: string | null;
  icon_url: string | null;
  color_theme: string | null;
  unlock_status: "locked" | "unlocked" | "in-progress" | "completed";
  progress: number;
  unlocked_at: string | null;
  completed_at: string | null;
}

export interface ChapterContent {
  intro: {
    title: string;
    text: string;
    duration_minutes: number;
  };
  practice: {
    title: string;
    focus: string;
    instructions: string[];
    duration_minutes: number;
  };
  reflection: {
    title: string;
    questions: string[];
    duration_minutes: number;
  };
}

export interface ChapterDetail extends ChapterSummary {
  content: ChapterContent | null;
  audio_url: string | null;
  lore_metadata: Record<string, unknown> | null;
  unlock_conditions: Record<string, unknown> | null;
}

export interface ChapterProgress {
  chapter_id: number;
  chapter_title: string | null;
  chapter_order: number | null;
  completion_percentage: number | null;
  time_spent_seconds: number | null;
  notes: string | null;
  unlocked_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
}

export interface Highlight {
  id: string;
  text: string;
  sceneId: number;
  timestamp: number;
  color?: string;
}

export interface Bookmark {
  id: string;
  chapterId: number;
  sceneId: number;
  createdAt: string;
}

export interface HighlightInput {
  chapter_id: number;
  scene_index: number;
  text: string;
  color?: string;
}

export interface HighlightsResponse {
  success: boolean;
  data?: Highlight[];
  error?: {
    code: string;
    message: string;
  };
}

export interface ChaptersListResponse {
  success: boolean;
  data?: {
    chapters: ChapterSummary[];
    total: number;
    unlocked: number;
    completed: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ChapterDetailResponse {
  success: boolean;
  data?: ChapterDetail;
  error?: {
    code: string;
    message: string;
  };
}

export interface ProgressResponse {
  success: boolean;
  data?: {
    progress: ChapterProgress[];
    total_chapters: number;
    completed: number;
    in_progress: number;
    total_time_spent: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface UpdateProgressResponse {
  success: boolean;
  data?: {
    chapter_id: number;
    completion_percentage: number;
    completed: boolean;
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CheckUnlockResponse {
  success: boolean;
  data?: {
    newly_unlocked: Array<{
      chapter_id: number;
      title: string | null;
      cycle: string | null;
    }>;
    total_unlocked: number;
    biorhythm_checked: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Error handling
class ChapterApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = "ChapterApiError";
  }
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  forceInternal = false
): Promise<Response> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  let token = session?.access_token;
  if (!token) {
    // Refresh auth state from persisted browser session when available.
    await supabase.auth.getUser();
    const { data: { session: refreshedSession } } = await supabase.auth.getSession();
    token = refreshedSession?.access_token;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const base = forceInternal ? INTERNAL_API_BASE : API_BASE_URL;
  const response = await fetch(`${base}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    // Token expired or invalid
    // window.location.href = "/auth/login"; // NextAuth handles this via middleware mostly, or we can use signIn
    throw new ChapterApiError("Authentication required", "AUTH_REQUIRED", 401);
  }

  return response;
}

/**
 * Helper for retrying async operations with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ChapterApiError && error.status === 401) {
      throw error;
    }
    if (retries <= 0) throw error;
    const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
    console.warn(`API call failed, retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
    await wait(delay);
    return withRetry(fn, retries - 1);
  }
}

/**
 * Get all chapters with unlock status
 */
export async function getChaptersList(): Promise<ChaptersListResponse> {
  // Cache check removed


  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const unlocked = MOCK_CHAPTERS.filter(c => c.unlock_status === "unlocked").length;
    const completed = MOCK_CHAPTERS.filter(c => c.unlock_status === "completed").length;
    const result: ChaptersListResponse = {
      success: true,
      data: {
        chapters: MOCK_CHAPTERS,
        total: MOCK_CHAPTERS.length,
        unlocked,
        completed,
      },
    };

    // Cache set removed


    return result;
  }

  try {
    const fn = async () => {
      const response = await apiRequest("/chapters/list", {}, true);
      const data = await response.json();
      return data as ChaptersListResponse;
    };

    const data = await withRetry(fn);

    // Cache update removed


    return data;
  } catch (error) {
    if (error instanceof ChapterApiError) throw error;
    throw new ChapterApiError(
      "Failed to fetch chapters",
      "FETCH_ERROR"
    );
  }
}

/**
 * Get chapter detail with content
 */
export async function getChapterDetail(
  chapterId: number
): Promise<ChapterDetailResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const chapter = MOCK_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Chapter not found" },
      };
    }

    // Mock content for each chapter
    const mockContent: ChapterContent = {
      intro: {
        title: `Introduction to ${chapter.title}`,
        text: `Welcome to ${chapter.title}. This chapter explores ${chapter.subtitle?.toLowerCase() || 'key concepts'} through somatic practice and meditation.`,
        duration_minutes: Math.floor((chapter.duration_minutes || 15) * 0.3),
      },
      practice: {
        title: "Somatic Practice",
        focus: chapter.cycle ? `Activate your ${chapter.cycle} cycle` : "Grounding and presence",
        instructions: [
          "Find a comfortable seated position",
          "Close your eyes and take three deep breaths",
          "Bring awareness to your body",
          "Follow the guidance in the audio",
        ],
        duration_minutes: Math.floor((chapter.duration_minutes || 15) * 0.5),
      },
      reflection: {
        title: "Integration",
        questions: [
          "What sensations did you notice during the practice?",
          "How does this relate to your current cycle?",
          "What insight emerged?",
        ],
        duration_minutes: Math.floor((chapter.duration_minutes || 15) * 0.2),
      },
    };

    return {
      success: true,
      data: {
        ...chapter,
        content: mockContent,
        audio_url: null,
        lore_metadata: { element: chapter.cycle, stage: chapter.order },
        unlock_conditions: chapter.order <= 2 ? null : {
          requires_cycle_peak: chapter.cycle,
          min_peak_value: 0.8,
        },
      },
    };
  }

  try {
    const fn = async () => {
      const response = await apiRequest(`/chapters/${chapterId}`, {}, true);
      const data = await response.json();
      return data as ChapterDetailResponse;
    };
    return await withRetry(fn);
  } catch (error) {
    if (error instanceof ChapterApiError) throw error;
    throw new ChapterApiError(
      "Failed to fetch chapter details",
      "FETCH_ERROR"
    );
  }
}

/**
 * Get all chapter progress for user
 */
export async function getChapterProgress(): Promise<ProgressResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const progress: ChapterProgress[] = MOCK_CHAPTERS.map(c => ({
      chapter_id: c.id,
      chapter_title: c.title,
      chapter_order: c.order,
      completion_percentage: c.progress,
      time_spent_seconds: c.progress > 0 ? c.progress * 60 : 0,
      notes: null,
      unlocked_at: c.unlocked_at,
      completed_at: c.completed_at,
      updated_at: c.unlocked_at || new Date().toISOString(),
    }));

    return {
      success: true,
      data: {
        progress,
        total_chapters: MOCK_CHAPTERS.length,
        completed: 0,
        in_progress: 0,
        total_time_spent: 0,
      },
    };
  }

  try {
    const fn = async () => {
      const response = await apiRequest("/chapters/progress", {}, true);
      const data = await response.json();
      return data as ProgressResponse;
    };
    return await withRetry(fn);
  } catch (error) {
    if (error instanceof ChapterApiError) throw error;
    throw new ChapterApiError(
      "Failed to fetch progress",
      "FETCH_ERROR"
    );
  }
}

/**
 * Update chapter progress
 */
export async function updateChapterProgress(
  chapterId: number,
  updates: {
    completion_percentage?: number;
    time_spent_seconds?: number;
    notes?: string;
    mark_complete?: boolean;
  }
): Promise<UpdateProgressResponse> {
  try {
    const response = await apiRequest("/chapters/progress", {
      method: "POST",
      body: JSON.stringify({
        chapter_id: chapterId,
        ...updates,
      }),
    }, true);
    const data = await response.json();
    return data as UpdateProgressResponse;
  } catch (error) {
    if (error instanceof ChapterApiError) throw error;
    throw new ChapterApiError(
      "Failed to update progress",
      "UPDATE_ERROR"
    );
  }
}

/**
 * Check for chapter unlocks
 */
export async function checkChapterUnlocks(): Promise<CheckUnlockResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Simulate no new unlocks (chapters 1 & 2 already unlocked)
    return {
      success: true,
      data: {
        newly_unlocked: [],
        total_unlocked: 2,
        biorhythm_checked: true,
      },
    };
  }

  try {
    const response = await apiRequest("/chapters/check-unlock", {
      method: "POST",
    }, true);
    const data = await response.json();
    return data as CheckUnlockResponse;
  } catch (error) {
    if (error instanceof ChapterApiError) throw error;
    throw new ChapterApiError(
      "Failed to check unlocks",
      "CHECK_ERROR"
    );
  }
}

/**
 * Mark chapter as complete
 */
export async function completeChapter(
  chapterId: number
): Promise<UpdateProgressResponse> {
  return updateChapterProgress(chapterId, { mark_complete: true });
}

/**
 * Add time spent to chapter
 */
export async function addChapterTime(
  chapterId: number,
  seconds: number
): Promise<UpdateProgressResponse> {
  return updateChapterProgress(chapterId, { time_spent_seconds: seconds });
}

/**
 * Save chapter notes
 */
export async function saveChapterNotes(
  chapterId: number,
  notes: string
): Promise<UpdateProgressResponse> {
  const result = await updateChapterProgress(chapterId, { notes });
  if (result.success) invalidateChapterCache();
  return result;
}

/**
 * Invalidate the chapter list cache - Deprecated (no-op)
 */
export function invalidateChapterCache() {
  // No-op
}

/**
 * Save a highlight
 */
export async function saveHighlight(
  chapterId: number,
  highlight: Omit<Highlight, "id" | "timestamp">
): Promise<{ success: boolean; data?: Highlight; error?: any }> {
  if (USE_MOCKS) {
    const newHighlight: Highlight = {
      ...highlight,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    return { success: true, data: newHighlight };
  }

  try {
    const fn = async () => {
      const response = await apiRequest("/highlights", {
        method: "POST",
        body: JSON.stringify({
          chapter_id: chapterId,
          scene_index: highlight.sceneId,
          text: highlight.text,
          color: highlight.color || 'primary'
        }),
      });
      const data = await response.json();
      return data as { success: boolean; data: any };
    };

    const result = await withRetry(fn);
    return {
      success: result.success,
      data: result.data ? {
        id: result.data.id,
        text: result.data.text,
        sceneId: result.data.scene_index,
        timestamp: new Date(result.data.created_at).getTime(),
        color: result.data.color,
      } : undefined
    };
  } catch (error) {
    console.error("Failed to save highlight:", error);
    return { success: false, error };
  }
}

/**
 * Get all highlights for a chapter
 */
export async function getChapterHighlights(
  chapterId: number
): Promise<HighlightsResponse> {
  if (USE_MOCKS) {
    return { success: true, data: [] };
  }

  try {
    const fn = async () => {
      const response = await apiRequest(`/highlights/chapter/${chapterId}`);
      const data = await response.json();
      return data as HighlightsResponse;
    };

    const result = await withRetry(fn);

    return {
      success: result.success,
      data: result.data?.map((h: any) => ({
        id: h.id,
        text: h.text,
        sceneId: h.scene_index,
        timestamp: new Date(h.created_at).getTime(),
        color: h.color,
      })) || []
    };
  } catch (error) {
    console.error("Failed to fetch highlights:", error);
    return { success: false, error: { code: "FETCH_ERROR", message: "Failed to load highlights" } };
  }
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(
  highlightId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const response = await apiRequest(`/highlights/${highlightId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete highlight:", error);
    return { success: false, error };
  }
}

/**
 * Save a bookmark
 */
export async function saveBookmark(
  chapterId: number,
  sceneIndex: number
): Promise<{ success: boolean; data?: Bookmark; error?: any }> {
  try {
    const fn = async () => {
      const response = await apiRequest("/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          chapter_id: chapterId,
          scene_index: sceneIndex
        }),
      });
      const data = await response.json();
      return data as { success: boolean; data: any };
    };

    const result = await withRetry(fn);
    return {
      success: result.success,
      data: result.data ? {
        id: result.data.id,
        chapterId: result.data.chapter_id,
        sceneId: result.data.scene_index,
        createdAt: result.data.created_at,
      } : undefined
    };
  } catch (error) {
    console.error("Failed to save bookmark:", error);
    return { success: false, error };
  }
}

/**
 * Get bookmarks for a chapter
 */
export async function getChapterBookmarks(
  chapterId: number
): Promise<{ success: boolean; data: Bookmark[]; error?: any }> {
  try {
    const fn = async () => {
      const response = await apiRequest(`/bookmarks/chapter/${chapterId}`);
      const data = await response.json();
      return data;
    };

    const result = await withRetry(fn);
    return {
      success: result.success,
      data: result.data?.map((b: any) => ({
        id: b.id,
        chapterId: b.chapter_id,
        sceneId: b.scene_index,
        createdAt: b.created_at,
      })) || []
    };
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return { success: false, data: [], error };
  }
}

/**
 * Delete a bookmark
 */
export async function deleteBookmark(
  bookmarkId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const response = await apiRequest(`/bookmarks/${bookmarkId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    return { success: false, error };
  }
}
