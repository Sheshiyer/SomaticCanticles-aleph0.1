// Chapter library exports

export {
  // API functions
  getChaptersList,
  getChapterDetail,
  getChapterProgress,
  updateChapterProgress,
  completeChapter,
  addChapterTime,
  saveChapterNotes,
  checkChapterUnlocks,
  
  // Types
  type ChapterSummary,
  type ChapterDetail,
  type ChapterContent,
  type ChapterProgress,
  type ChaptersListResponse,
  type ChapterDetailResponse,
  type ProgressResponse,
  type UpdateProgressResponse,
  type CheckUnlockResponse,
} from './api';
