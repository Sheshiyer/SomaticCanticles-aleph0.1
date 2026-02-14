#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)."
  );
  process.exit(1);
}

const CHAPTERS_SOURCE =
  process.env.CHAPTERS_SOURCE_DIR ||
  path.join(process.cwd(), "chapters");
const CHAPTER_FILE_PATTERN = /^Chapter-(\d+)-(.+)\.md$/i;

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toBookName(bookCode) {
  const m = bookCode.match(/^BOOK_(\d+)_(.+)$/);
  if (!m || !m[1] || !m[2]) return bookCode;
  return `Book ${m[1]}: ${humanizeSlug(m[2])}`;
}

function extractSubtitle(markdown) {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line === "---") continue;
    if (line.startsWith("**")) continue;
    if (/^\*[^*].+\*$/.test(line)) {
      return line.replace(/^\*|\*$/g, "").trim();
    }
    break;
  }
  return null;
}

function extractDescription(markdown) {
  const lines = markdown.split(/\r?\n/).map((line) => line.trim());
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line === "---") continue;
    if (line.startsWith("**")) continue;
    if (line.startsWith("*") && line.endsWith("*")) continue;
    if (line.length < 24) continue;
    return line.slice(0, 280);
  }
  return null;
}

function readChaptersFromFilesystem() {
  if (!fs.existsSync(CHAPTERS_SOURCE)) {
    throw new Error(`Chapters directory not found: ${CHAPTERS_SOURCE}`);
  }

  const bookDirs = fs
    .readdirSync(CHAPTERS_SOURCE, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("BOOK_"))
    .map((entry) => entry.name)
    .sort();

  const chapters = [];
  for (const bookCode of bookDirs) {
    const bookPath = path.join(CHAPTERS_SOURCE, bookCode);
    const files = fs
      .readdirSync(bookPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && CHAPTER_FILE_PATTERN.test(entry.name))
      .map((entry) => entry.name)
      .sort();

    for (const file of files) {
      const match = file.match(CHAPTER_FILE_PATTERN);
      if (!match || !match[1] || !match[2]) continue;
      const chapterNumber = Number(match[1]);
      if (!Number.isFinite(chapterNumber)) continue;

      const filePath = path.join(bookPath, file);
      const markdown = fs.readFileSync(filePath, "utf-8");
      const title = humanizeSlug(match[2]);

      chapters.push({
        id: chapterNumber,
        order: chapterNumber,
        title,
        subtitle: extractSubtitle(markdown),
        description: extractDescription(markdown),
        markdown,
        bookCode,
        bookName: toBookName(bookCode),
        sourceFile: file,
      });
    }
  }

  chapters.sort((a, b) => a.order - b.order);
  return chapters;
}

async function main() {
  console.log(`Reading chapters from ${CHAPTERS_SOURCE}`);
  const chapterRecords = readChaptersFromFilesystem();
  if (chapterRecords.length === 0) {
    throw new Error("No chapter files found.");
  }
  console.log(`Found ${chapterRecords.length} chapter files`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingRows, error: existingError } = await supabase
    .from("chapters")
    .select("id, order, cycle, color_theme, duration_minutes, unlock_conditions, lore_metadata");
  if (existingError) {
    throw new Error(`Failed to load existing chapters: ${existingError.message}`);
  }
  const existingById = new Map((existingRows || []).map((row) => [row.id, row]));

  const upsertRows = chapterRecords.map((record) => {
    const existing = existingById.get(record.id);
    const loreMetadata = {
      ...(existing?.lore_metadata || {}),
      book_code: record.bookCode,
      book_name: record.bookName,
      chapter_number: record.order,
      source_file: record.sourceFile,
      source_path: `${record.bookCode}/${record.sourceFile}`,
      trilogy: "Somatic Canticles",
      updated_at: new Date().toISOString(),
    };

    return {
      id: record.id,
      order: record.order,
      title: record.title,
      subtitle: record.subtitle,
      description: record.description,
      cycle: existing?.cycle ?? null,
      color_theme: existing?.color_theme ?? null,
      duration_minutes: existing?.duration_minutes ?? null,
      unlock_conditions: existing?.unlock_conditions ?? null,
      lore_metadata: loreMetadata,
      content: {
        markdown: record.markdown,
        book_code: record.bookCode,
        book_name: record.bookName,
        chapter_number: record.order,
      },
    };
  });

  const { error: upsertError } = await supabase
    .from("chapters")
    .upsert(upsertRows, { onConflict: "id" });
  if (upsertError) {
    throw new Error(`Failed to upsert chapters: ${upsertError.message}`);
  }

  const { error: deleteError } = await supabase
    .from("chapters")
    .delete()
    .not(
      "id",
      "in",
      `(${chapterRecords.map((row) => row.id).join(",")})`
    );
  if (deleteError) {
    throw new Error(`Failed to delete extra chapters: ${deleteError.message}`);
  }

  console.log(
    `Synced ${chapterRecords.length} chapters to Supabase with updated titles/book metadata`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
