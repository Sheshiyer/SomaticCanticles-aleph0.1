import { ChapterDetailPageClient } from "./ChapterDetailPageClient";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Generate static params for all 12 chapters
export function generateStaticParams() {
  return [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" },
    { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" },
    { id: "9" }, { id: "10" }, { id: "11" }, { id: "12" },
  ];
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
