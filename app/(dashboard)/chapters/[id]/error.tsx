"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChapterDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error
        console.error("Chapter Detail Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-destructive flex items-center gap-2">
                        Chapter Unavailable
                    </CardTitle>
                    <CardDescription>
                        We couldn't load this chapter's details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        {error.message || "An unexpected error occurred while loading the chapter."}
                    </p>
                    {error.digest && (
                        <code className="block bg-black/10 p-2 rounded text-xs font-mono text-muted-foreground">
                            ID: {error.digest}
                        </code>
                    )}
                </CardContent>
                <CardFooter className="flex gap-4 justify-between">
                    <Button variant="outline" onClick={() => window.location.href = '/chapters'}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        All Chapters
                    </Button>
                    <Button onClick={reset} variant="default">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
