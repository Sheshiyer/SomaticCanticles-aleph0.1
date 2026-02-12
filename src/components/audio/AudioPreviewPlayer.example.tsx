"use client";

import {
  AudioPreviewPlayer,
  AudioPreviewPlayerSkeleton,
  defaultAudioChapters,
} from "./AudioPreviewPlayer";

/**
 * AudioPreviewPlayer Component Usage Examples
 * 
 * This component provides an audio preview interface with:
 * - Animated waveform visualization
 * - Play/Pause controls
 * - Chapter selector dropdown
 * - Time display and progress bar
 * - Volume control with slider
 * - Stats display (total duration, available chapters)
 * 
 * REQUIRED PROPS:
 * - chapters: Array of chapter objects with id, title, duration, and previewAvailable
 * 
 * OPTIONAL PROPS:
 * - className: Additional CSS classes
 */

// Example 1: Basic Usage with Default Data
export function AudioPreviewPlayerBasicExample() {
  return <AudioPreviewPlayer chapters={defaultAudioChapters} />;
}

// Example 2: Custom Chapter Data
export function AudioPreviewPlayerCustomExample() {
  const customChapters = [
    { id: 1, title: "Morning Meditation", duration: "10:00", previewAvailable: true },
    { id: 2, title: "Breathing Exercise", duration: "8:30", previewAvailable: true },
    { id: 3, title: "Body Scan", duration: "15:00", previewAvailable: false },
    { id: 4, title: "Deep Relaxation", duration: "20:00", previewAvailable: false },
  ];

  return <AudioPreviewPlayer chapters={customChapters} />;
}

// Example 3: All Chapters Available (Premium User)
export function AudioPreviewPlayerPremiumExample() {
  const premiumChapters = defaultAudioChapters.map((chapter) => ({
    ...chapter,
    previewAvailable: true,
  }));

  return <AudioPreviewPlayer chapters={premiumChapters} />;
}

// Example 4: Free Preview - Only First Chapter
export function AudioPreviewPlayerFreeExample() {
  const freeChapters = defaultAudioChapters.map((chapter, index) => ({
    ...chapter,
    previewAvailable: index === 0, // Only first chapter available
  }));

  return <AudioPreviewPlayer chapters={freeChapters} />;
}

// Example 5: With Custom Styling
export function AudioPreviewPlayerStyledExample() {
  return (
    <div className="p-8 bg-gradient-to-b from-metal-900 to-metal-950 rounded-2xl">
      <h2 className="text-xl font-bold text-metallic text-center mb-6">
        Start Your Journey
      </h2>
      <AudioPreviewPlayer 
        chapters={defaultAudioChapters} 
        className="shadow-2xl"
      />
    </div>
  );
}

// Example 6: Loading State
export function AudioPreviewPlayerLoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AudioPreviewPlayerSkeleton />;
  }

  return <AudioPreviewPlayer chapters={defaultAudioChapters} />;
}

// Example 7: With Featured Chapter
export function AudioPreviewPlayerFeaturedExample() {
  const [featuredId, setFeaturedId] = useState(1);

  const featuredChapters = defaultAudioChapters.map((chapter) => ({
    ...chapter,
    previewAvailable: chapter.id === featuredId || chapter.id <= 2,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setFeaturedId(id)}
            className={`px-3 py-1 rounded-full text-sm ${
              featuredId === id
                ? "bg-primary text-primary-foreground"
                : "bg-metal-800 text-muted-foreground"
            }`}
          >
            Feature Ch. {id}
          </button>
        ))}
      </div>
      <AudioPreviewPlayer chapters={featuredChapters} />
    </div>
  );
}

// Example 8: Compact Version (Fewer Chapters)
export function AudioPreviewPlayerCompactExample() {
  const compactChapters = defaultAudioChapters.slice(0, 4).map((chapter) => ({
    ...chapter,
    previewAvailable: chapter.id <= 2,
  }));

  return <AudioPreviewPlayer chapters={compactChapters} />;
}

// Import needed for examples
import { useState, useEffect } from "react";

// Default export showing the most common usage
export default function AudioPreviewPlayerExample() {
  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-metallic mb-6">
        AudioPreviewPlayer Examples
      </h1>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          1. Default View (2/12 Chapters Available)
        </h2>
        <AudioPreviewPlayerBasicExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          2. Loading State
        </h2>
        <AudioPreviewPlayerSkeleton />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          3. Premium - All Chapters Available
        </h2>
        <AudioPreviewPlayerPremiumExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          4. Free Preview - First Chapter Only
        </h2>
        <AudioPreviewPlayerFreeExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          5. With Background Styling
        </h2>
        <AudioPreviewPlayerStyledExample />
      </section>
    </div>
  );
}
