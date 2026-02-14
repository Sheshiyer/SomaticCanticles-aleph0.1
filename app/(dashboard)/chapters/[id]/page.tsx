import { ChapterDetailPageClient } from "./ChapterDetailPageClient";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getAllManuscriptInfo } from "@/lib/chapters/manuscripts";

// Generate static params from manuscript source of truth (supports 3-book trilogy growth)
export function generateStaticParams() {
  const manuscriptParams = getAllManuscriptInfo().map((entry) => ({
    id: String(entry.chapter),
  }));

  if (manuscriptParams.length > 0) {
    return manuscriptParams;
  }

  return [{ id: "1" }];
}

export default async function ChapterDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return (
    <ErrorBoundary>
      <ChapterDetailPageClient chapterId={parseInt(id, 10)} />
    </ErrorBoundary>
  );
}
