import fs from "fs";
import path from "path";

import { ManuscriptScene, parseManuscriptIntoScenes } from "./manuscript-utils";

const CHAPTERS_DIR = path.join(process.cwd(), "chapters");
const CHAPTER_FILE_PATTERN = /^Chapter-(\d+)-(.+)\.md$/i;

export { type ManuscriptScene, parseManuscriptIntoScenes };

export interface ManuscriptInfo {
  chapter: number;
  book: string;
  file: string;
  title: string;
  path: string;
}

let manuscriptIndexCache: Map<number, ManuscriptInfo> | null = null;

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildManuscriptIndex(): Map<number, ManuscriptInfo> {
  if (manuscriptIndexCache) {
    return manuscriptIndexCache;
  }

  const index = new Map<number, ManuscriptInfo>();
  if (!fs.existsSync(CHAPTERS_DIR)) {
    manuscriptIndexCache = index;
    return index;
  }

  const bookDirs = fs
    .readdirSync(CHAPTERS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("BOOK_"))
    .map((entry) => entry.name)
    .sort();

  for (const book of bookDirs) {
    const bookPath = path.join(CHAPTERS_DIR, book);
    const files = fs
      .readdirSync(bookPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && CHAPTER_FILE_PATTERN.test(entry.name))
      .map((entry) => entry.name)
      .sort();

    for (const file of files) {
      const match = file.match(CHAPTER_FILE_PATTERN);
      if (!match || !match[1] || !match[2]) {
        continue;
      }

      const chapter = Number(match[1]);
      if (!Number.isFinite(chapter)) {
        continue;
      }

      const title = humanizeSlug(match[2]);
      const relativePath = path.join(book, file);

      index.set(chapter, {
        chapter,
        book,
        file,
        title,
        path: relativePath,
      });
    }
  }

  manuscriptIndexCache = index;
  return index;
}

export function getManuscriptInfo(chapterId: number): ManuscriptInfo | null {
  const index = buildManuscriptIndex();
  return index.get(chapterId) ?? null;
}

export function getAllManuscriptInfo(): ManuscriptInfo[] {
  return Array.from(buildManuscriptIndex().values()).sort(
    (a, b) => a.chapter - b.chapter
  );
}

export async function getManuscriptContent(chapterId: number): Promise<string | null> {
  const mapping = getManuscriptInfo(chapterId);
  if (!mapping) return null;

  const filePath = path.join(CHAPTERS_DIR, mapping.path);
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Manuscript file not found: ${filePath}`);
      return null;
    }
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading manuscript ${chapterId}:`, error);
    return null;
  }
}
