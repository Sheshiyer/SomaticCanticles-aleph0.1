/**
 * Chapter API client functions
 * 
 * Handles all API communication for chapters
 */

import { getAccessToken } from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("auth_token");
    window.location.href = "/auth/login";
    throw new ChapterApiError("Authentication required", "AUTH_REQUIRED", 401);
  }

  return response;
}

/**
 * Get all chapters with unlock status
 */
export async function getChaptersList(): Promise<ChaptersListResponse> {
  try {
    const response = await fetchWithAuth("/chapters/list");
    const data = await response.json();
    return data as ChaptersListResponse;
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
  try {
    const response = await fetchWithAuth(`/chapters/${chapterId}`);
    const data = await response.json();
    return data as ChapterDetailResponse;
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
  try {
    const response = await fetchWithAuth("/chapters/progress");
    const data = await response.json();
    return data as ProgressResponse;
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
    const response = await fetchWithAuth("/chapters/progress", {
      method: "POST",
      body: JSON.stringify({
        chapter_id: chapterId,
        ...updates,
      }),
    });
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
  try {
    const response = await fetchWithAuth("/chapters/check-unlock", {
      method: "POST",
    });
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
  return updateChapterProgress(chapterId, { notes });
}
