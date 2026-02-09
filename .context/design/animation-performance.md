# Animation Performance Optimization Guide

## Target Performance Metrics

- **Frame Rate**: 60fps minimum during all animations
- **Time to First Frame**: < 100ms
- **Memory Usage**: < 100MB for animation sequence
- **CPU Usage**: < 30% on mid-range devices

## GPU Acceleration

### Properties That Trigger GPU Acceleration

```css
/* Use transform instead of position */
transform: translateX(100px);  /* GPU */
left: 100px;                   /* CPU */

/* Use scale instead of width/height */
transform: scale(1.5);         /* GPU */
width: 150%;                   /* CPU */

/* Use opacity for fades */
opacity: 0.5;                  /* GPU */
filter: brightness(0.5);       /* CPU (sometimes GPU) */
```

### Applied Optimizations

1. **will-change Property**
   ```css
   .light-pillar {
     will-change: transform, opacity, filter;
   }
   
   .particle {
     will-change: transform, opacity;
   }
   ```

2. **transform: translateZ(0)**
   ```css
   .gpu-accelerated {
     transform: translateZ(0);
     backface-visibility: hidden;
   }
   ```

3. **Contain Property**
   ```css
   .animation-container {
     contain: layout style paint;
     content-visibility: auto;
   }
   ```

## Animation Techniques

### 1. RequestAnimationFrame

```typescript
// Good: Sync with display refresh
function animate(timestamp: number) {
  updateAnimation(timestamp);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Bad: Unsynced updates
setInterval(() => updateAnimation(), 16);
```

### 2. CSS Animations for Simple Effects

```css
/* Good: CSS for simple, continuous animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animated {
  animation: pulse 2s ease-in-out infinite;
}
```

### 3. Framer Motion for Complex Sequences

```typescript
// Good: Orchestrated animations
<motion.div
  animate={{
    scale: [1, 1.5, 1],
    rotate: [0, 360],
    opacity: [0, 1]
  }}
  transition={{
    duration: 3,
    ease: "easeInOut"
  }}
/>
```

## Memory Optimization

### 1. Lazy Load Heavy Elements

```typescript
// Load particle system only during wave phase
const ParticleSystem = lazy(() => import('./ParticleSystem'));

{phase === 'wave' && (
  <Suspense fallback={null}>
    <ParticleSystem />
  </Suspense>
)}
```

### 2. Cleanup After Animation

```typescript
useEffect(() => {
  return () => {
    // Cancel any pending animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    // Remove will-change after animation
    element.style.willChange = 'auto';
  };
}, []);
```

### 3. Object Pooling for Particles

```typescript
// Reuse particle objects instead of creating new ones
const particlePool = useRef<Particle[]>([]);

function getParticle() {
  return particlePool.current.pop() || createParticle();
}

function releaseParticle(particle: Particle) {
  particlePool.current.push(particle);
}
```

## Rendering Optimization

### 1. Avoid Layout Thrashing

```typescript
// Bad: Interleaving reads and writes
const height = element.clientHeight; // Read
element.style.height = height + 10 + 'px'; // Write
const width = element.clientWidth; // Read (forces recalc)
element.style.width = width + 10 + 'px'; // Write

// Good: Batch reads then writes
const height = element.clientHeight;
const width = element.clientWidth;
element.style.height = height + 10 + 'px';
element.style.width = width + 10 + 'px';
```

### 2. Use CSS Custom Properties for Dynamic Values

```typescript
// Good: Update CSS variable instead of inline styles
element.style.setProperty('--progress', `${progress}%`);

// CSS handles the update efficiently
.progress-bar {
  width: var(--progress);
  will-change: width;
}
```

### 3. Virtualize Long Lists

```typescript
// Only render visible items
function VirtualList({ items, itemHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleItems = Math.ceil(window.innerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  
  return (
    <div style={{ height: items.length * itemHeight }}>
      <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
        {items.slice(startIndex, startIndex + visibleItems).map(renderItem)}
      </div>
    </div>
  );
}
```

## Device-Specific Optimizations

### 1. Detect Device Capability

```typescript
const isLowPowerDevice = 
  navigator.hardwareConcurrency <= 4 ||
  /Android [1-6]/.test(navigator.userAgent);

if (isLowPowerDevice) {
  // Reduce particle count
  // Simplify animations
  // Lower frame rate target
}
```

### 2. Battery Status

```typescript
if ('getBattery' in navigator) {
  const battery = await navigator.getBattery();
  if (battery.level < 0.2 && !battery.charging) {
    // Reduce animation complexity
  }
}
```

### 3. Intersection Observer for Lazy Start

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
      } else {
        pauseAnimation();
      }
    });
  },
  { threshold: 0.5 }
);
```

## Framer Motion Specific Optimizations

### 1. Use layoutId for Shared Layout Animations

```typescript
// Smooth transitions between components
<motion.div layoutId="card" />
```

### 2. AnimatePresence Mode

```typescript
// Control exit animations
<AnimatePresence mode="wait"> {/* Wait for exit before enter */}
<AnimatePresence mode="popLayout"> {/* Immediate layout shift */}
```

### 3. Reduce Motion Variants

```typescript
const variants = {
  default: {
    scale: [1, 1.5, 1],
    transition: { duration: 2 }
  },
  reducedMotion: {
    scale: 1,
    transition: { duration: 0 }
  }
};

<motion.div
  variants={variants}
  initial="default"
  animate={prefersReducedMotion ? "reducedMotion" : "default"}
/>
```

## Testing Performance

### 1. Chrome DevTools

```
Performance Tab:
1. Record during animation
2. Check for:
   - Long frames (> 16.67ms)
   - Layout thrashing (purple bars)
   - Style recalculations
   - Memory leaks
```

### 2. JavaScript Profiling

```typescript
// Measure specific operations
console.time('animation');
runAnimation();
console.timeEnd('animation');

// FPS Counter
let frameCount = 0;
let lastTime = performance.now();

function countFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log('FPS:', frameCount);
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(countFPS);
}
```

### 3. Lighthouse Audit

Run Lighthouse performance audit and check:
- Total Blocking Time
- Cumulative Layout Shift
- Speed Index

## Implementation Checklist

- [ ] Use `will-change` sparingly (add before, remove after)
- [ ] Prefer `transform` and `opacity` for animations
- [ ] Use CSS animations for simple, continuous effects
- [ ] Implement `prefers-reduced-motion` media query
- [ ] Lazy load heavy animation components
- [ ] Clean up animations on unmount
- [ ] Test on low-end devices
- [ ] Monitor memory usage
- [ ] Implement FPS counter for debugging
- [ ] Use Intersection Observer to pause off-screen animations

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| will-change | 36+ | 36+ | 9.1+ | 79+ |
| contain | 52+ | 69+ | 15.4+ | 79+ |
| content-visibility | 85+ | 103+ | 18+ | 85+ |
| transform | All | All | All | All |

## Known Issues and Workarounds

### Safari will-change Bug
Safari sometimes ignores `will-change`. Workaround:
```css
.safari-fix {
  transform: translateZ(0);
  perspective: 1000px;
}
```

### iOS Scroll Performance
Disable animations during scroll on iOS:
```typescript
document.addEventListener('touchmove', () => {
  document.body.classList.add('disable-animations');
});
```
