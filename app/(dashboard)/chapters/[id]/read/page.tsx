import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getManuscriptContent } from "@/lib/chapters/manuscripts";
import { ChapterReader } from "@/components/chapters/ChapterReader";

interface ReadPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params;
  const requestedId = parseInt(id, 10);

  if (isNaN(requestedId)) {
    notFound();
  }

  // Server-safe chapter lookup: accept route by DB id or legacy order number.
  const supabase = await createClient();
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("id, order, title, cycle, content")
    .or(`id.eq.${requestedId},order.eq.${requestedId}`)
    .order("order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (chapterError || !chapter) {
    notFound();
  }

  // Manuscript mapping is canonical by chapter order.
  const contentFromFile = await getManuscriptContent(chapter.order);
  const contentFromDb =
    chapter.content &&
    typeof chapter.content === "object" &&
    "markdown" in chapter.content &&
    typeof chapter.content.markdown === "string"
      ? chapter.content.markdown
      : null;
  const content = contentFromFile ?? contentFromDb;
  if (!content) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <ChapterReader
        chapterId={chapter.id}
        title={chapter.title}
        content={content}
        cycle={chapter.cycle}
      />
    </div>
  );
}
