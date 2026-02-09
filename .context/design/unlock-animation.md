# Unlock Animation Design Document

## Overview

The 13-second unlock animation is a sacred, immersive experience that celebrates the user's achievement in unlocking a new chapter. The animation uses power numbers (8, 13, 19) and follows a 5-phase progression designed to create anticipation, transformation, and revelation.

## Design Philosophy

- **Sacred Geometry**: Use of 19-point mandala (power number)
- **Color Alchemy**: Transformation through 13 colors (power number)
- **Rhythmic Pulsing**: 8-beat rhythm (power number) synchronized throughout
- **Progressive Revelation**: Each phase builds toward the final chapter reveal

## Animation Sequence (13 Seconds Total)

### Phase 1: Pulse/Awakening (0-3 seconds)
**Duration**: 3 seconds

**Visual Elements**:
- Center point begins pulsing with gentle glow
- Light pillars emerge from darkness (3 pillars)
- Pillar intensity: low → medium
- Background: Deep void with subtle particles
- Central glow expands and contracts rhythmically

**Color Palette**:
- Start: Deep indigo (#1a1a2e)
- Transition to: Violet (#9B59B6)

**Light Pillar Configuration**:
- Count: 3 pillars (unity number)
- Colors: transform → solar → transform
- Intensity progression: low → medium
- Height: 0% → 60% → 80%

**Motion**:
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Scale: 0.8 → 1.0 (subtle breathing)
- Opacity: 0 → 1

---

### Phase 2: Color Transformation (3-6 seconds)
**Duration**: 3 seconds

**Visual Elements**:
- 13-color transition cycle begins
- Each color lasts ~230ms (3s / 13 colors)
- Light pillars sync color transitions
- Background shifts through spectral range
- Text elements begin to materialize

**Color Sequence** (13 power-number colors):
1. `#FF6B6B` - Octave Red (energy)
2. `#9B59B6` - Transform Purple (change)
3. `#F1C40F` - Solar Gold (illumination)
4. `#3498DB` - Architect Blue (structure)
5. `#2ECC71` - World Green (growth)
6. `#E74C3C` - Life Red (vitality)
7. `#1ABC9C` - Unity Teal (harmony)
8. `#E67E22` - Sacred Orange (creativity)
9. `#95A5A6` - Balance Silver (equilibrium)
10. `#34495E` - Depth Slate (wisdom)
11. `#16A085` - Flow Green (movement)
12. `#D35400` - Ember Orange (passion)
13. `#8E44AD` - Mystery Violet (unknown)

**Light Pillar Configuration**:
- Count: 5 pillars
- Colors cycle through sequence
- Intensity: medium → high
- Height: 80% → 100%

**Motion**:
- Color interpolation: smooth HSL transitions
- Easing: `linear` for color, `ease-in-out` for position

---

### Phase 3: Geometric Expansion (6-9 seconds)
**Duration**: 3 seconds

**Visual Elements**:
- 19-point mandala emerges from center
- Sacred geometry pattern rotates slowly
- Light pillars form circular arrangement
- Particles emanate from center outward
- Geometric pattern expands from scale 0 → 1.5

**Mandala Design**:
- Points: 19 (power number)
- Pattern: Flower of Life inspired
- Stroke: Animated gradient line
- Fill: Semi-transparent with glow
- Rotation: 360° over 3 seconds

**Light Pillar Configuration**:
- Count: 7 pillars in circle formation
- Colors: Full spectrum
- Intensity: high
- Height: 100% with wave motion

**Motion**:
- Mandala scale: 0 → 1.5 → 1.0 (overshoot)
- Rotation: 0° → 360°
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)

---

### Phase 4: Sound Wave Visualization (9-12 seconds)
**Duration**: 3 seconds

**Visual Elements**:
- Concentric sound rings emanate from center
- 8-beat rhythm creates pulse waves
- Light pillars pulse with each beat
- Frequency bars visualize audio spectrum
- Ripples expand outward and fade

**Sound Wave Elements**:
- Ring count: 5 simultaneous rings
- Ring expansion: center to edges
- Beat markers: 8 pulses (every 375ms)
- Frequency visualization: 19 bars

**Light Pillar Configuration**:
- Count: 8 pillars (beat sync)
- Pulse on each beat
- Intensity: rhythmic oscillation
- Height: wave pattern synchronized

**Motion**:
- Ring expansion: scale 0 → 3, opacity 1 → 0
- Beat pulse: scale 1.0 → 1.1 → 1.0
- Easing: `ease-out` for expansion

---

### Phase 5: Chapter Reveal (12-13 seconds)
**Duration**: 1 second

**Visual Elements**:
- All effects converge to center
- Chapter title materializes with glow
- Confetti/particle burst
- Light pillars reach maximum intensity
- Transition to chapter preview card

**Reveal Elements**:
- Title: Fade in with scale 0.8 → 1.0
- Glow: Radial gradient expansion
- Particles: Burst from center
- Background: Settle to chapter color

**Light Pillar Configuration**:
- Count: 13 pillars (full power number)
- Final color: Chapter-specific
- Intensity: maximum
- Height: 120% (overflow effect)

**Motion**:
- Title: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo)
- Particles: Physics-based explosion
- Convergence: All elements to center

---

## 8-Beat Rhythm System

### Timing Breakdown
- Total sequence: 13 seconds
- Beat count: 8 beats
- Beat interval: 1.625 seconds (13s / 8)

### Beat Synchronization
```
Beat 1: 0.000s - Phase 1 start pulse
Beat 2: 1.625s - Phase 1-2 transition
Beat 3: 3.250s - Phase 2 color peak
Beat 4: 4.875s - Phase 2-3 transition
Beat 5: 6.500s - Phase 3 mandala full
Beat 6: 8.125s - Phase 3-4 transition
Beat 7: 9.750s - Phase 4 wave peak
Beat 8: 11.375s - Phase 4-5 transition
Final: 13.000s - Chapter revealed
```

### Pulse Effect Specification
- Ring expansion: 200ms
- Ring fade: 600ms
- Glow intensity spike: +50%
- Scale pulse: 1.0 → 1.05 → 1.0

---

## Accessibility Considerations

### Reduced Motion Variant
- Skip all animations
- Instant chapter reveal
- Static color background
- No pulsing or rotation
- Essential information only

### Progress Indicator
- Visual progress bar at bottom
- Current phase label
- Time remaining display
- Skip button (always accessible)

### Audio
- Optional ambient sound
- Mute toggle
- Volume control
- Screen reader announcements

---

## Performance Specifications

### Target Metrics
- Frame rate: 60fps minimum
- Animation smoothness: No jank
- Memory usage: < 100MB
- GPU acceleration: All transforms

### Optimization Techniques
- `will-change` on animated elements
- `transform` instead of `top/left`
- `opacity` for fade effects
- RequestAnimationFrame for JS animations
- Lazy load particle systems

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## State Machine

```
IDLE → AWAKENING → TRANSFORMING → EXPANDING → WAVE → REVEAL → COMPLETE
       (0-3s)      (3-6s)         (6-9s)      (9-12s) (12-13s)
```

### State Transitions
- Each state auto-advances after duration
- Skip button jumps to COMPLETE
- Pause on hover (optional)
- Restart from any state

### State Data
```typescript
interface AnimationState {
  phase: AnimationPhase;
  progress: number; // 0-1
  elapsedTime: number; // milliseconds
  remainingTime: number; // milliseconds
  colors: ColorState;
  pillars: PillarState[];
  mandala: MandalaState;
  waves: WaveState[];
}
```

---

## Component Architecture

### UnlockAnimation
- Orchestrates entire sequence
- Manages state machine
- Renders all visual layers
- Handles user interactions

### Animation Layers (z-index)
1. Background (z-0)
2. Light Pillars (z-10)
3. Mandala (z-20)
4. Sound Waves (z-30)
5. Particles (z-40)
6. Chapter Title (z-50)
7. UI Controls (z-60)

---

## Color Transition Formula

```typescript
// Smooth color interpolation
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
```

---

## Implementation Notes

### Dependencies
- Framer Motion for animations
- CSS animations for simple effects
- Canvas for particle systems (optional)

### Key Decisions
1. Use Framer Motion's `AnimatePresence` for phase transitions
2. CSS custom properties for dynamic colors
3. RequestAnimationFrame for precise timing
4. Intersection Observer for lazy start

### Testing Checklist
- [ ] Animation completes in exactly 13 seconds
- [ ] 8 beats occur at correct intervals
- [ ] All 13 colors display
- [ ] Mandala has 19 points
- [ ] Reduced motion variant works
- [ ] 60fps maintained throughout
- [ ] Skip button functional
- [ ] Progress indicator accurate
