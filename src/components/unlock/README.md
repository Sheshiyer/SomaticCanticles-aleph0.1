# Unlock Animation System

## Components

### UnlockAnimation

The core 13-second unlock animation component with 5 phases.

```tsx
import { UnlockAnimation } from "@/components/unlock";

<UnlockAnimation
  chapterTitle="The Breath of Life"
  chapterColor="#3b82f6"
  onComplete={() => console.log("Animation complete")}
  onSkip={() => console.log("Skipped")}
  reducedMotion={false}
/>
```

### UnlockModal

Full-screen modal that contains the unlock animation and chapter preview.

```tsx
import { UnlockModal, useUnlockModal } from "@/components/unlock";

function MyComponent() {
  const { isOpen, chapter, openUnlockModal, closeUnlockModal } = useUnlockModal();

  return (
    <>
      <UnlockModal
        isOpen={isOpen}
        onClose={closeUnlockModal}
        chapter={chapter}
        onStartChapter={(id) => router.push(`/chapters/${id}`)}
      />
    </>
  );
}
```

## Animation Phases

| Phase | Duration | Visual Elements |
|-------|----------|-----------------|
| Awakening | 0-3s | 3 light pillars emerge |
| Transformation | 3-6s | 13-color transition |
| Expansion | 6-9s | 19-point mandala |
| Resonance | 9-12s | Sound wave rings |
| Revelation | 12-13s | Chapter title reveal |

## Accessibility

- Respects `prefers-reduced-motion` media query
- Skip button always available
- Screen reader announcements
- Keyboard navigable controls

## Performance

- GPU-accelerated transforms
- `will-change` properties
- Lazy loaded particle effects
- 60fps target
