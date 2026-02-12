import { notFound } from "next/navigation";
import { getChapterDetail } from "@/lib/chapters/api";
import { getManuscriptContent } from "@/lib/chapters/manuscripts";
import { ChapterReader } from "@/components/chapters/ChapterReader";

interface ReadPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReadPage({ params }: ReadPageProps) {
    const { id } = await params;
    const chapterId = parseInt(id, 10);

    if (isNaN(chapterId)) {
        notFound();
    }

    // Fetch chapter details for title and cycle theme
    const chapterResponse = await getChapterDetail(chapterId);
    if (!chapterResponse.success || !chapterResponse.data) {
        notFound();
    }

    // Fetch manuscript content
    const content = await getManuscriptContent(chapterId);
    if (!content) {
        // If manuscript file not found but chapter exists, show a placeholder or 404
        notFound();
    }

    const chapter = chapterResponse.data;

    return (
        <div className="bg-background min-h-screen">
            <ChapterReader
                chapterId={chapterId}
                title={chapter.title}
                content={content}
                cycle={chapter.cycle}
            />
        </div>
    );
}
