"use client";

import {
  ChapterTreeNode,
  ChapterTreeNodeSkeleton,
  defaultChapters,
} from "./ChapterTreeNode";

/**
 * ChapterTreeNode Component Usage Examples
 * 
 * This component displays 12 chapters in a visual tree/grid layout with:
 * - Chapter numbers, titles, and lock status
 * - Biorhythm cycle indicators (Physical, Emotional, Intellectual, Spiritual)
 * - Visual connection lines showing progression
 * - Tooltips for locked chapters showing requirements
 * 
 * REQUIRED PROPS:
 * - chapters: Array of chapter objects with id, title, unlocked, unlockCycle, and optional requirement
 * 
 * OPTIONAL PROPS:
 * - className: Additional CSS classes
 */

// Example 1: Basic Usage with Default Data
export function ChapterTreeNodeBasicExample() {
  return <ChapterTreeNode chapters={defaultChapters} />;
}

// Example 2: Custom Chapter Data
export function ChapterTreeNodeCustomExample() {
  const customChapters = [
    {
      id: 1,
      title: "Introduction to Somatic Practice",
      unlocked: true,
      unlockCycle: "physical" as const,
      requirement: "Starting chapter",
    },
    {
      id: 2,
      title: "Body Awareness Fundamentals",
      unlocked: true,
      unlockCycle: "physical" as const,
      requirement: "Complete Chapter 1",
    },
    {
      id: 3,
      title: "Emotional Release Techniques",
      unlocked: false,
      unlockCycle: "emotional" as const,
      requirement: "Complete Physical Cycle",
    },
    // ... add more chapters as needed
  ];

  return <ChapterTreeNode chapters={customChapters} />;
}

// Example 3: With Custom Styling
export function ChapterTreeNodeStyledExample() {
  return (
    <div className="py-8 bg-metal-950/50 rounded-2xl">
      <ChapterTreeNode 
        chapters={defaultChapters} 
        className="px-4"
      />
    </div>
  );
}

// Example 4: Loading State
export function ChapterTreeNodeLoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ChapterTreeNodeSkeleton />;
  }

  return <ChapterTreeNode chapters={defaultChapters} />;
}

// Example 5: Dynamic Unlock State
export function ChapterTreeNodeDynamicExample() {
  const [unlockedIds, setUnlockedIds] = useState<number[]>([1, 2, 3]);

  const chapters = defaultChapters.map((chapter) => ({
    ...chapter,
    unlocked: unlockedIds.includes(chapter.id),
  }));

  const handleUnlock = (id: number) => {
    setUnlockedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-4">
      <ChapterTreeNode chapters={chapters} />
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleUnlock(unlockedIds.length + 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Unlock Next Chapter
        </button>
      </div>
    </div>
  );
}

// Example 6: Minimal Chapter Set
export function ChapterTreeNodeMinimalExample() {
  const minimalChapters = defaultChapters.slice(0, 6);

  return <ChapterTreeNode chapters={minimalChapters} />;
}

// Example 7: All Unlocked
export function ChapterTreeNodeAllUnlockedExample() {
  const allUnlocked = defaultChapters.map((chapter) => ({
    ...chapter,
    unlocked: true,
  }));

  return <ChapterTreeNode chapters={allUnlocked} />;
}

// Example 8: All Locked (Preview Mode)
export function ChapterTreeNodePreviewExample() {
  const allLocked = defaultChapters.map((chapter) => ({
    ...chapter,
    unlocked: false,
  }));

  return <ChapterTreeNode chapters={allLocked} />;
}

// Import needed for dynamic example
import { useState, useEffect } from "react";

// Default export showing the most common usage
export default function ChapterTreeNodeExample() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold text-metallic mb-6">
        ChapterTreeNode Examples
      </h1>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          1. Default View (Chapters 1-2 Unlocked)
        </h2>
        <ChapterTreeNodeBasicExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          2. Loading State
        </h2>
        <ChapterTreeNodeSkeleton />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          3. With Background
        </h2>
        <ChapterTreeNodeStyledExample />
      </section>
    </div>
  );
}
