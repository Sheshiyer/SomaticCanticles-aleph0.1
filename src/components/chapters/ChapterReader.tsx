"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
    saveChapterNotes,
    completeChapter,
    saveHighlight,
    getChapterHighlights,
    deleteHighlight,
    saveBookmark,
    getChapterBookmarks,
    deleteBookmark,
    updateChapterProgress,
    type Highlight,
    type Bookmark
} from "@/lib/chapters/api";
import { calculateBiorhythm, type BiorhythmData } from "@/lib/biorhythm/api";
import { createClient } from "@/lib/supabase/client";
import TerminalOverlay from "../terminal/TerminalOverlay";
import ChapterCelebration from "./ChapterCelebration";
import { toast } from "sonner";
import { Search, Filter, X, Trash2, Bookmark as BookmarkIcon, Download } from "lucide-react";
import remarkGfm from "remark-gfm";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    ArrowLeft,
    Maximize2,
    Minimize2,
    Settings,
    Type,
    Moon,
    Sun,
    Clock,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Layers,
    Sparkles,
    Play,
    Pause,
    Search as SearchIcon,
    History,
    MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TechFrame, HudPanel } from "@/components/ui/frame";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { parseManuscriptIntoScenes, type ManuscriptScene } from "@/lib/chapters/manuscript-utils";
import { OraclePopover } from "./OraclePopover";
import { findLoreDefinition, LORE_DEFINITIONS } from "@/lib/chapters/lore";

interface ChapterReaderProps {
    chapterId: number;
    title: string;
    content: string;
    cycle: string | null;
}


const cycleColors = {
    physical: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    emotional: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    intellectual: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    spiritual: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

export function ChapterReader({ chapterId, title, content, cycle }: ChapterReaderProps) {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedColor, setSelectedColor] = useState("bg-yellow-400/30 text-yellow-100");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [readingTime, setReadingTime] = useState(0);
    const [startTime] = useState(Date.now());
    const [scenes] = useState<ManuscriptScene[]>(() => {
        const parsed = parseManuscriptIntoScenes(content);
        console.log("DEBUG [ChapterReader]: Content length:", content.length);
        console.log("DEBUG [ChapterReader]: Parsed scenes count:", parsed.length);
        console.log("DEBUG [ChapterReader]: First scene title:", parsed[0]?.title);
        return parsed;
    });
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [selection, setSelection] = useState<{ text: string, x: number, y: number, rect: DOMRect } | null>(null);
    const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
    const [loreSearchQuery, setLoreSearchQuery] = useState("");
    const [loreCategoryFilter, setLoreCategoryFilter] = useState<string | null>(null);
    const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
    const [chapterBookmarks, setChapterBookmarks] = useState<Bookmark[]>([]);
    const [biorhythm, setBiorhythm] = useState<BiorhythmData | null>(null);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);


    const currentScene = scenes[currentSceneIndex];
    const hasChoices = currentScene.content.includes("```choice");

    const containerRef = useRef<HTMLDivElement>(null);

    const handleSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.toString().length > 0) {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelection({
                text: sel.toString(),
                x: rect.left + rect.width / 2,
                y: rect.top + window.scrollY - 10,
                rect: rect
            });
        } else {
            setSelection(null);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const [hRes, bRes] = await Promise.all([
                getChapterHighlights(chapterId),
                getChapterBookmarks(chapterId)
            ]);
            if (hRes.success) setHighlights(hRes.data || []);
            if (bRes.success) setChapterBookmarks(bRes.data || []);
        };
        loadData();
    }, [chapterId]);

    // Load biorhythm data
    useEffect(() => {
        const loadBiorhythm = async () => {
            if (user?.birthdate) {
                try {
                    const data = await calculateBiorhythm(user.birthdate);
                    setBiorhythm(data);
                } catch (error) {
                    console.error("Failed to load biorhythm for reader:", error);
                }
            }
        };
        loadBiorhythm();
    }, [user?.birthdate]);

    const handleHighlight = async (color: string) => {
        if (!selection) return;

        setIsSaving(true);
        const highlightData = {
            text: selection.text,
            sceneId: currentSceneIndex,
            color: color
        };

        try {
            const response = await saveHighlight(chapterId, highlightData);
            if (response.success && response.data) {
                setHighlights(prev => [...prev, response.data!]);
                toast.success("Resonance Captured", {
                    description: "This insight has been saved to your transmission log."
                });
            }
        } catch (error) {
            console.error("Highlight error:", error);
            toast.error("Network Error", {
                description: "Failed to capture resonance."
            });
        } finally {
            setSelection(null);
            setIsSaving(false);
        }
    };

    const handleToggleBookmark = async () => {
        const existing = chapterBookmarks.find(b => b.sceneId === currentSceneIndex);
        try {
            if (existing) {
                const res = await deleteBookmark(existing.id);
                if (res.success) {
                    setChapterBookmarks(prev => prev.filter(b => b.id !== existing.id));
                    toast.success("Bookmark Removed");
                }
            } else {
                const res = await saveBookmark(chapterId, currentSceneIndex);
                if (res.success && res.data) {
                    setChapterBookmarks(prev => [...prev, res.data!]);
                    toast.success("Scene Bookmarked");
                }
            }
        } catch (error) {
            toast.error("Failed to update bookmark");
        }
    };

    const handleDeleteHighlight = async (id: string) => {
        try {
            const res = await deleteHighlight(id);
            if (res.success) {
                setHighlights(prev => prev.filter(h => h.id !== id));
                toast.success("Resonance Deleted");
            }
        } catch (error) {
            toast.error("Failed to delete resonance");
        }
    };

    const handleExport = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const contentHtml = scenes.map((s, i) => `
            <div class="print-scene">
                <h2>Canticle ${i + 1}: ${s.title}</h2>
                <div class="content">${s.content.replace(/\n/g, '<br/>')}</div>
            </div>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title} - Manuscript</title>
                    <style>
                        body { font-family: sans-serif; line-height: 1.6; padding: 50px; color: #111; max-width: 800px; margin: 0 auto; }
                        h1 { text-align: center; margin-bottom: 50px; text-transform: uppercase; letter-spacing: 2px; }
                        h2 { margin-top: 40px; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 16px; color: #444; }
                        .content { margin-top: 20px; font-size: 14px; }
                        .print-scene { page-break-after: always; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${contentHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setReadingTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentSceneIndex]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Terminal triggers: Ctrl+` or Ctrl+~ or Alt+T
            if ((e.ctrlKey && (e.key === '`' || e.key === '~')) || (e.altKey && e.key === 't')) {
                e.preventDefault();
                setIsTerminalOpen(prev => !prev);
                return;
            }

            if (isTerminalOpen) return;
            if (isFocusMode && e.key === 'Escape') {
                setIsFocusMode(false);
                return;
            }
            if (isFocusMode || isSaving || isLogOpen) return;

            if (e.key.toLowerCase() === 'f') {
                setIsFocusMode(prev => !prev);
            }
            if (e.key === 'Enter') {
                if (currentSceneIndex < scenes.length - 1) {
                    setCurrentSceneIndex(prev => prev + 1);
                } else {
                    // Logic for "Finish Chapter" button
                    const finishBtn = document.getElementById('finish-chapter-btn');
                    finishBtn?.click();
                }
            }
            if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
                if (currentSceneIndex > 0) setCurrentSceneIndex(prev => prev - 1);
            }
            if (e.key === 'ArrowRight') {
                if (currentSceneIndex < scenes.length - 1) setCurrentSceneIndex(prev => prev + 1);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentSceneIndex, scenes.length]);

    // Auto-save progress
    useEffect(() => {
        const timer = setTimeout(async () => {
            const percentage = Math.round(((currentSceneIndex + 1) / scenes.length) * 100);
            try {
                await updateChapterProgress(chapterId, {
                    completion_percentage: percentage,
                    time_spent_seconds: Math.floor((Date.now() - startTime) / 1000)
                });
            } catch (error) {
                console.error("Auto-save failed:", error);
            }
        }, 10000); // 10 second debounce

        return () => clearTimeout(timer);
    }, [currentSceneIndex, chapterId, scenes.length, startTime]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const colors = cycle ? cycleColors[cycle as keyof typeof cycleColors] : cycleColors.physical;

    return (
        <div className={cn("min-h-screen bg-background relative transition-colors duration-700", isFocusMode && "bg-slate-950")} ref={containerRef}>
            {/* Sticky Top Progress & Actions */}
            <header className={cn(
                "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-500",
                isFocusMode && "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-bold text-metallic line-clamp-1">{title}</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Chapter {chapterId}</p>
                                <span className="text-[10px] text-muted-foreground/30">•</span>
                                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Scene {currentSceneIndex + 1}/{scenes.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleToggleBookmark}
                            className={cn(
                                "p-2 rounded-full transition-all hover:bg-white/5",
                                chapterBookmarks.some(b => b.sceneId === currentSceneIndex) ? "text-gold-400 scale-110" : "text-muted-foreground"
                            )}
                            title="Bookmark Scene"
                        >
                            <BookmarkIcon className="w-4 h-4" fill={chapterBookmarks.some(b => b.sceneId === currentSceneIndex) ? "currentColor" : "none"} />
                        </button>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-metal-900/50 border border-metal-800 text-[10px] font-mono tracking-tighter text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(readingTime)}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Type className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-metal-900 border-metal-800">
                                <DropdownMenuItem onClick={() => setFontSize("sm")} className={cn(fontSize === "sm" && "text-primary")}>Small</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFontSize("md")} className={cn(fontSize === "md" && "text-primary")}>Medium</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFontSize("lg")} className={cn(fontSize === "lg" && "text-primary")}>Large</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFontSize("xl")} className={cn(fontSize === "xl" && "text-primary")}>Extra Large</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsLogOpen(true)}
                            className="relative"
                        >
                            <Sparkles className="h-4 w-4" />
                            {highlights.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                                    {highlights.length}
                                </span>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={cn(isFocusMode && "text-primary")}
                        >
                            <Sparkles className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Overall Chapter Progress Bar */}
                <div className="h-0.5 w-full bg-metal-900">
                    <div
                        className={cn("h-full transition-all duration-500", colors.split(" ")[0].replace("text-", "bg-"))}
                        style={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Content Area with Transitions */}
            <main className={cn(
                "mx-auto max-w-3xl px-6 py-12 sm:py-20",
                fontSize === "sm" && "prose-sm",
                fontSize === "md" && "prose-base",
                fontSize === "lg" && "prose-lg",
                fontSize === "xl" && "prose-xl",
                "prose prose-invert prose-headings:text-metallic prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-blockquote:border-primary/50 prose-blockquote:bg-metal-900/40 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] prose-blockquote:not-italic prose-blockquote:font-mono prose-blockquote:text-sm prose-blockquote:text-primary/90"
            )}>
                {/* TechFrame wrapper for content */}
                <TechFrame variant="default" size="lg" className="scan-lines mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSceneIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="min-h-[60vh]"
                        >
                            <div className="mb-8 opacity-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    <h2 className="text-xs uppercase tracking-[0.2em] m-0">{currentScene.title}</h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Active Resonance
                                </div>
                            </div>

                            <div onMouseUp={handleSelection} className="relative">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom renderer for text to find lore terms
                                        text: ({ node, ...props }) => {
                                            const text = props.children as string;
                                            if (typeof text !== 'string') return <span>{text}</span>;

                                            // Simple regex-based splitting for known terms
                                            const terms = Object.keys(LORE_DEFINITIONS);
                                            const regex = new RegExp(`(${terms.join('|')})`, 'gi');
                                            const parts = text.split(regex);

                                            return (
                                                <span>
                                                    {parts.map((part, i) => {
                                                        const definition = findLoreDefinition(part);
                                                        if (definition) {
                                                            return <OraclePopover key={i} definition={definition}>{part}</OraclePopover>;
                                                        }
                                                        return <span key={i}>{part}</span>;
                                                    })}
                                                </span>
                                            );
                                        },
                                        // Custom renderer for reveal blocks
                                        code: ({ node, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || "");
                                            const lang = match ? match[1] : "";
                                            const isInline = !className;

                                            if (!isInline && lang === "reveal") {
                                                const content = String(children).replace(/\n$/, "");
                                                const [header, ...bodyParts] = content.split("---");
                                                const body = bodyParts.join("---").trim();

                                                const headerLines = header.split("\n");
                                                const data: any = {};
                                                headerLines.forEach(line => {
                                                    const [key, ...value] = line.split(":");
                                                    if (key && value.length) {
                                                        data[key.trim().toLowerCase()] = value.join(":").trim();
                                                    }
                                                });

                                                const track = data.track || "physical";
                                                const threshold = parseFloat(data.threshold || "0.6");

                                                const currentVal = biorhythm ? (biorhythm as any)[track]?.value : 0;
                                                const isRevealed = currentVal >= threshold;

                                                return (
                                                    <TechFrame
                                                        variant={isRevealed ? "tech" : "default"}
                                                        size="default"
                                                        className={cn(
                                                            "my-6 transition-all duration-1000 scan-lines",
                                                            isRevealed
                                                                ? "shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                                                                : "opacity-40 grayscale blur-[2px] pointer-events-none select-none"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Sparkles className={cn("w-3 h-3", isRevealed ? "text-primary animate-pulse" : "text-muted-foreground")} />
                                                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                                                {track} resonance {isRevealed ? "Active" : "Locked"}
                                                            </span>
                                                        </div>
                                                        {isRevealed ? (
                                                            <div className="text-sm italic leading-relaxed text-foreground/80">
                                                                <ReactMarkdown>{body}</ReactMarkdown>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-muted-foreground italic m-0">
                                                                [ Increase {track} resonance to unlock deep narrative layer ]
                                                            </p>
                                                        )}
                                                    </TechFrame>
                                                );
                                            }

                                            if (!isInline && lang === "choice") {
                                                const content = String(children).replace(/\n$/, "");
                                                const lines = content.split("\n");
                                                const data: any = {};
                                                lines.forEach(line => {
                                                    const [key, ...value] = line.split(":");
                                                    if (key && value.length) {
                                                        data[key.trim().toLowerCase()] = value.join(":").trim();
                                                    }
                                                });

                                                const label = data.label || "Continue Path";
                                                const target = data.target;
                                                const requirement = data.requirement;

                                                // Check requirement if any
                                                let isLocked = false;
                                                let lockReason = "";

                                                if (requirement && biorhythm) {
                                                    try {
                                                        // Simple requirement parser: "intellectual > 0.5"
                                                        const [track, op, valStr] = requirement.split(/\s+/);
                                                        const val = parseFloat(valStr);
                                                        const currentVal = (biorhythm as any)[track]?.value;

                                                        if (currentVal !== undefined) {
                                                            if (op === ">" && !(currentVal > val)) isLocked = true;
                                                            if (op === "<" && !(currentVal < val)) isLocked = true;
                                                            if (isLocked) lockReason = `Requires ${track} ${op} ${val} (Current: ${currentVal.toFixed(2)})`;
                                                        }
                                                    } catch (e) {
                                                        console.error("Choice requirement error:", e);
                                                    }
                                                }

                                                return (
                                                    <TechFrame variant="gold" size="default" className="my-8 transition-all group overflow-hidden relative scan-lines">
                                                        <div className="flex items-center justify-between gap-4 relative z-10">
                                                            <div className="flex-1">
                                                                <h3 className="text-sm font-bold text-metallic mb-1">{label}</h3>
                                                                {isLocked && (
                                                                    <p className="text-[10px] text-rose-400 font-mono italic">{lockReason}</p>
                                                                )}
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant={isLocked ? "ghost" : "glow"}
                                                                disabled={isLocked || isSaving}
                                                                onClick={() => {
                                                                    if (target) {
                                                                        const targetIndex = scenes.findIndex(s =>
                                                                            s.title.toLowerCase() === target.toLowerCase() ||
                                                                            String(s.id) === String(target)
                                                                        );
                                                                        if (targetIndex !== -1) {
                                                                            setCurrentSceneIndex(targetIndex);
                                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                                        } else {
                                                                            toast.error("Path Unstable", {
                                                                                description: `Could not relocate scene: ${target}`
                                                                            });
                                                                        }
                                                                    }
                                                                }}
                                                                className="rounded-full px-6"
                                                            >
                                                                {isLocked ? <Moon className="w-3.5 h-3.5 opacity-50" /> : "Initiate Jump"}
                                                            </Button>
                                                        </div>
                                                        {isLocked && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-none" />}
                                                    </TechFrame>
                                                );
                                            }

                                            return <code className={className} {...props}>{children}</code>;
                                        }
                                    }}
                                >
                                    {currentScene.content}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </TechFrame>

                {/* Pagination Navigation - wrapped in HudPanel */}
                <HudPanel variant="default" className="scan-lines mt-8">
                    <div className="flex flex-col items-center gap-10">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                disabled={currentSceneIndex === 0}
                                onClick={() => setCurrentSceneIndex(prev => prev - 1)}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous Scene
                            </Button>

                            <div className="flex items-center gap-1">
                                {scenes.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                            i === currentSceneIndex ? "bg-primary w-4" : "bg-metal-800"
                                        )}
                                    />
                                ))}
                            </div>

                            <Button
                                id="finish-chapter-btn"
                                variant="glow"
                                className={cn(
                                    "group relative overflow-hidden px-8 py-6 rounded-xl",
                                    hasChoices && "opacity-20 grayscale pointer-events-none"
                                )}
                                disabled={isSaving || (hasChoices && currentSceneIndex < scenes.length - 1)}
                                onClick={async () => {
                                    if (currentSceneIndex === scenes.length - 1) {
                                        try {
                                            setIsSaving(true);
                                            await completeChapter(chapterId);
                                            setIsCelebrationOpen(true);
                                        } catch (error) {
                                            console.error("Failed to complete chapter:", error);
                                            toast.error("Failed to save progress");
                                            setIsCelebrationOpen(true); // Still show celebration if progress fails locally
                                        } finally {
                                            setIsSaving(false);
                                        }
                                    } else {
                                        setCurrentSceneIndex(prev => prev + 1);
                                    }
                                }}
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                                        Synchronizing...
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 relative z-10">
                                            <span>{currentSceneIndex === scenes.length - 1 ? "Finish Chapter" : "Next Scene"}</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {currentSceneIndex === scenes.length - 1 && (
                            <p className="text-sm text-muted-foreground italic">You have reached the final segment of this canticle.</p>
                        )}
                    </div>
                </HudPanel>
            </main>

            {/* Text Selection Popover */}
            <AnimatePresence>
                {selection && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-[100] flex items-center gap-2 rounded-full border border-metal-800 bg-metal-900/95 p-1 shadow-2xl backdrop-blur-md"
                        style={{
                            top: `${selection.rect.top - 60}px`,
                            left: `${selection.rect.left + selection.rect.width / 2}px`,
                            transform: "translateX(-50%)",
                        }}
                    >
                        <div className="flex gap-1 px-2 border-r border-metal-800 mr-1">
                            {["bg-yellow-400/30", "bg-emerald-400/30", "bg-sky-400/30", "bg-rose-400/30"].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => handleHighlight(c)}
                                    className={cn("w-4 h-4 rounded-full border border-white/10 hover:scale-125 transition-transform", c)}
                                />
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHighlight("bg-yellow-400/30")}
                            className="h-8 rounded-full px-3 text-xs gap-1.5"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Capture Resonance
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resonance Log Sidebar */}
            <AnimatePresence>
                {isLogOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLogOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-[101] h-screen w-80 border-l border-metal-800 shadow-2xl"
                        >
                            <TechFrame variant="default" size="lg" className="h-full rounded-none border-0 scan-lines">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-metallic">Resonance Log</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setIsLogOpen(false)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-6">
                                    {/* Lore / Oracle Search Section */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">The Oracle</span>
                                        </div>
                                        <Input
                                            placeholder="Search lore..."
                                            value={loreSearchQuery}
                                            onChange={(e) => setLoreSearchQuery(e.target.value)}
                                            className="h-8 text-xs bg-metal-900/50 border-metal-800"
                                            leftIcon={<Search className="w-3 h-3 text-muted-foreground" />}
                                        />
                                        <div className="flex flex-wrap gap-1.5">
                                            {["technology", "spiritual", "biological", "protocol"].map(cat => (
                                                <Badge
                                                    key={cat}
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[9px] cursor-pointer hover:bg-metal-800 transition-colors uppercase tracking-tighter py-0 px-2 h-5",
                                                        loreCategoryFilter === cat ? "bg-primary/20 border-primary/50 text-primary" : "text-muted-foreground border-metal-800"
                                                    )}
                                                    onClick={() => setLoreCategoryFilter(loreCategoryFilter === cat ? null : cat)}
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            {Object.values(LORE_DEFINITIONS)
                                                .filter(def => {
                                                    const matchesSearch = def.term.toLowerCase().includes(loreSearchQuery.toLowerCase()) ||
                                                        def.definition.toLowerCase().includes(loreSearchQuery.toLowerCase());
                                                    const matchesCategory = !loreCategoryFilter || def.category === loreCategoryFilter;
                                                    return matchesSearch && matchesCategory;
                                                })
                                                .slice(0, 5) // Limit results
                                                .map(def => (
                                                    <OraclePopover key={def.term} definition={def}>
                                                        <div className="p-2 rounded border border-metal-800 bg-metal-900/30 hover:bg-metal-800/50 transition-colors cursor-help">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-[10px] font-bold text-metallic">{def.term}</span>
                                                                <span className="text-[8px] opacity-40 uppercase">{def.category}</span>
                                                            </div>
                                                        </div>
                                                    </OraclePopover>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="h-px bg-metal-800 my-4" />

                                    {/* Resonance Log Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">Captured Resonance</span>
                                        </div>
                                        <div className="space-y-4 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                                            {highlights.length === 0 ? (
                                                <div className="text-center py-8 opacity-30 italic text-xs">
                                                    No resonances captured yet.
                                                </div>
                                            ) : (
                                                highlights.map((h) => (
                                                    <div key={h.id} className="group relative p-3 rounded-lg border border-metal-800 bg-metal-900/50 hover:border-primary/30 transition-colors">
                                                        <button
                                                            onClick={() => handleDeleteHighlight(h.id)}
                                                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-metal-800 text-rose-400 hover:text-rose-300 transition-all border border-metal-700 shadow-xl"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                        <p className="text-[11px] leading-relaxed line-clamp-3 mb-2 italic opacity-80">
                                                            "{h.text}"
                                                        </p>
                                                        <div className="flex items-center justify-between opacity-50 text-[9px] uppercase tracking-tighter">
                                                            <span>Scene {h.sceneId + 1}</span>
                                                            <div className={cn("w-2 h-2 rounded-full", h.color || "bg-yellow-400/30")} />
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="mt-8 flex items-center justify-center gap-2 w-full p-2.5 rounded-lg border border-metal-800 bg-metal-900/30 hover:bg-metal-800/50 transition-all text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground group"
                                >
                                    <Download className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                    Export Manuscript
                                </button>
                            </TechFrame>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ChapterCelebration
                isOpen={isCelebrationOpen}
                chapterTitle={title}
                onContinue={() => router.push("/dashboard")}
            />

            {/* Side Ornaments and Meta */}
            <div className={cn("fixed top-20 left-4 bottom-20 w-px bg-gradient-to-b from-transparent via-metal-800 to-transparent hidden xl:block transition-opacity duration-1000", isFocusMode && "opacity-0")} />
            <div className={cn("fixed top-20 right-4 bottom-20 w-px bg-gradient-to-b from-transparent via-metal-800 to-transparent hidden xl:block transition-opacity duration-1000", isFocusMode && "opacity-0")} />

            {/* Highlights Counter (Floating Mini) */}
            {
                highlights.length > 0 && (
                    <div className="fixed bottom-6 right-6 z-40">
                        <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-md rounded-full border-metal-800 shadow-lg">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-mono">{highlights.length} Resonances</span>
                        </Button>
                    </div>
                )
            }

            {/* Terminal Interface */}
            <TerminalOverlay
                isOpen={isTerminalOpen}
                chapterId={chapterId}
                onClose={() => setIsTerminalOpen(false)}
                onCommand={(cmd, args) => {
                    if (cmd === "jump") {
                        const target = args[0];
                        if (!target) return;
                        const targetIndex = scenes.findIndex(s =>
                            s.title.toLowerCase().includes(target.toLowerCase()) ||
                            String(s.id) === String(target)
                        );
                        if (targetIndex !== -1) {
                            setCurrentSceneIndex(targetIndex);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setIsTerminalOpen(false);
                            toast.success("Jump Initiated", {
                                description: `Relocated to scene: ${scenes[targetIndex].title}`
                            });
                        }
                    }
                }}
            />
        </div >
    );
}
