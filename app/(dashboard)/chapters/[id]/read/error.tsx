"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ChapterReadError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Chapter Reading Error:", error);
    }, [error]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <div className="max-w-md text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-foreground">
                        The Manuscript is Silent
                    </h2>
                    <p className="text-muted-foreground">
                        We encountered an issue while retrieving the ancient texts.
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
                    <p className="text-sm font-mono text-destructive">
                        {error.message || "Unknown error loading manuscript."}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <Link href="/chapters">
                        <Button variant="ghost">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Return to Library
                        </Button>
                    </Link>
                    <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Refresh Connection
                    </Button>
                </div>
            </div>
        </div>
    );
}
