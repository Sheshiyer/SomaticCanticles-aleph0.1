export interface ManuscriptScene {
    id: number;
    title: string;
    content: string;
    readingTime: string;
}

export function estimateReadingTime(text: string): string {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes <= 1 ? "1 min read" : `${minutes} min read`;
}

export function parseManuscriptIntoScenes(content: string): ManuscriptScene[] {
    // Normalize newlines and split by ## headers
    // Using a regex that handles both \n and \r\n, and doesn't strictly require a leading newline for the first split
    const normalizedContent = content.replace(/\r\n/g, "\n");

    // Find all "## " headers and their positions
    const headerRegex = /^##\s+(.+)$/gm;
    let match;
    const headerIndices: { index: number; title: string }[] = [];

    while ((match = headerRegex.exec(normalizedContent)) !== null) {
        headerIndices.push({ index: match.index, title: match[1] });
    }

    if (headerIndices.length === 0) {
        // Fallback: If no ## headers, everything is one scene
        const lines = normalizedContent.trim().split("\n");
        let title = "The Beginning";
        let body = normalizedContent;
        if (lines[0].startsWith("# ")) {
            title = lines[0].replace("# ", "").trim();
            body = lines.slice(1).join("\n").trim();
        }
        return [{ id: 1, title, content: body, readingTime: estimateReadingTime(body) }];
    }

    const scenes: ManuscriptScene[] = [];

    // Add everything before the first ## if it's significant
    const firstHeader = headerIndices[0];
    if (firstHeader.index > 5) { // Small threshold to avoid empty intro
        const introContent = normalizedContent.substring(0, firstHeader.index).trim();
        const lines = introContent.split("\n");
        let title = "Introduction";
        let body = introContent;
        if (lines[0].startsWith("# ")) {
            title = lines[0].replace("# ", "").trim();
            body = lines.slice(1).join("\n").trim();
        }
        scenes.push({ id: 1, title, content: body, readingTime: estimateReadingTime(body) });
    }

    // Add chapters based on ## headers
    headerIndices.forEach((header, i) => {
        const start = header.index + header.title.length + 3; // +3 for "## " and newline
        const end = headerIndices[i + 1] ? headerIndices[i + 1].index : normalizedContent.length;
        const body = normalizedContent.substring(start, end).trim();

        scenes.push({
            id: scenes.length + 1,
            title: header.title.trim(),
            content: body,
            readingTime: estimateReadingTime(body)
        });
    });

    return scenes;
}
