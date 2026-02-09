# Chapter Unlock Logic Documentation

## Overview

The Somatic Canticles chapter system uses a biorhythm-based unlocking mechanism. Each of the 12 chapters is associated with one of four cycles (physical, emotional, intellectual, spiritual) and requires specific biorhythm conditions to unlock.

## Chapter-Cycle Mapping

| Chapter | Title | Cycle | Unlock Type |
|---------|-------|-------|-------------|
| 1 | The Awakening | Physical | Automatic (on registration) |
| 2 | The Breath of Life | Physical | High physical sustained |
| 3 | Waves of Feeling | Emotional | Emotional peak |
| 4 | The Heart's Rhythm | Emotional | Flow state (balanced) |
| 5 | Mindful Motion | Physical | Flow state (balanced) |
| 6 | The Thinking Body | Intellectual | Intellectual peak |
| 7 | Patterns of Thought | Intellectual | Flow state (balanced) |
| 8 | The Inner Eye | Intellectual | Sustained flow state |
| 9 | Sacred Ground | Spiritual | Spiritual peak |
| 10 | Celestial Harmony | Spiritual | All cycles high |
| 11 | The Integration | Spiritual | All cycles balanced |
| 12 | The Eternal Dance | Spiritual | Spiritual peak sustained |

## Unlock Conditions by Chapter

### Chapter 1: The Awakening
- **Condition**: `automatic`
- **Trigger**: User completes registration
- **Logic**: Always unlocked for all users
- **Rationale**: Entry point into the system

### Chapter 2: The Breath of Life
- **Condition**: `high_physical_sustained`
- **Trigger**: Physical cycle ≥ 50% for 1+ day
- **Logic**: `physical >= 0.5`
- **Rationale**: Introduces breath work when body energy is elevated

### Chapter 3: Waves of Feeling
- **Condition**: `emotional_peak`
- **Trigger**: Emotional cycle at peak (≥ 80%)
- **Logic**: `emotional_peak = true`
- **Rationale**: Explore emotions when emotional energy is at its highest

### Chapter 4: The Heart's Rhythm
- **Condition**: `emotional_flow_state`
- **Trigger**: Emotional cycle in balanced range (30-70%)
- **Logic**: `emotional >= 0.3 AND emotional <= 0.7`
- **Rationale**: Heart-centered work requires emotional stability, not extremes

### Chapter 5: Mindful Motion
- **Condition**: `physical_flow_state`
- **Trigger**: Physical cycle in balanced range (30-70%)
- **Logic**: `physical >= 0.3 AND physical <= 0.7`
- **Rationale**: Mindful movement requires physical presence without excess energy

### Chapter 6: The Thinking Body
- **Condition**: `intellectual_peak`
- **Trigger**: Intellectual cycle at peak (≥ 80%)
- **Logic**: `intellectual_peak = true`
- **Rationale**: Explore body intelligence when mental clarity is highest

### Chapter 7: Patterns of Thought
- **Condition**: `intellectual_flow_state`
- **Trigger**: Intellectual cycle in balanced range (30-70%)
- **Logic**: `intellectual >= 0.3 AND intellectual <= 0.7`
- **Rationale**: Observing thoughts requires mental calm, not hyperactivity

### Chapter 8: The Inner Eye
- **Condition**: `intellectual_flow_sustained`
- **Trigger**: Intellectual cycle in balanced range for 2+ consecutive days
- **Logic**: `intellectual >= 0.3 AND intellectual <= 0.7` sustained
- **Rationale**: Inner vision requires sustained mental stability

### Chapter 9: Sacred Ground
- **Condition**: `spiritual_peak`
- **Trigger**: Spiritual cycle at peak (≥ 80%)
- **Logic**: `spiritual_peak = true`
- **Rationale**: Earth connection when spiritual energy is highest

### Chapter 10: Celestial Harmony
- **Condition**: `all_cycles_high`
- **Trigger**: All four cycles ≥ 50% simultaneously
- **Logic**: `physical >= 0.5 AND emotional >= 0.5 AND intellectual >= 0.5 AND spiritual >= 0.5`
- **Rationale**: Cosmic connection requires alignment across all dimensions

### Chapter 11: The Integration
- **Condition**: `all_cycles_balanced`
- **Trigger**: All four cycles in balanced range (30-70%) simultaneously
- **Logic**: All cycles between 0.3 and 0.7
- **Rationale**: Integration requires harmony across all cycles without extremes

### Chapter 12: The Eternal Dance
- **Condition**: `spiritual_peak_sustained`
- **Trigger**: Spiritual cycle at peak for 3+ consecutive days
- **Logic**: `spiritual >= 0.8` sustained for 3 days
- **Rationale**: Final chapter requires sustained transcendent state

## Biorhythm Cycle Thresholds

```typescript
const THRESHOLDS = {
  peak: 0.8,        // Peak: ≥ 80%
  high: 0.5,        // High: ≥ 50%
  balanced: {       // Flow state range
    min: 0.3,       // Lower bound
    max: 0.7        // Upper bound
  },
  low: -0.5,        // Low: ≤ -50%
  critical: 0.1     // Critical: within ±10% of zero
};
```

## Evaluation Algorithm

### Single Evaluation
1. Get current biorhythm snapshot for user
2. For each locked chapter:
   - Parse unlock_conditions JSON
   - Check if conditions are met
   - If met, unlock chapter (create user_progress entry)

### Historical Evaluation (for sustained conditions)
1. Query biorhythm snapshots for last N days
2. Check if condition holds across consecutive days
3. Unlock if sustained threshold met

## Implementation Notes

### Database Schema

```sql
-- Unlock conditions stored as JSON in chapters table
{
  "type": "biorhythm",
  "physical": { "min": 0.5 },           // Physical >= 50%
  "emotional": { "peak": true },        // Emotional at peak
  "intellectual": { "min": 0.3, "max": 0.7 }, // Intellectual in range
  "spiritual": { "peak": true, "sustained_days": 3 }, // Spiritual peak for 3 days
  "description": "Human-readable description"
}
```

### Evaluation Flow

```
User requests chapter list
  ↓
For each chapter, check user_progress
  ↓
If no progress entry and chapter != 1:
  Check unlock_conditions against current biorhythm
  If conditions met:
    Create user_progress with unlocked_at
  ↓
Return chapters with unlock_status
```

### Caching Strategy

- Biorhythm snapshots are cached daily per user
- Unlock evaluations run:
  1. When user explicitly requests `/chapters/check-unlock`
  2. When loading chapter list (background check)
  3. On app open (if last check > 1 hour ago)

## Power Number Associations

Each chapter is associated with a power number (1-12) that influences its lore and visual theming:

| Chapter | Power Number | Element | Tarot Card |
|---------|--------------|---------|------------|
| 1 | 1 | Earth | The Magician |
| 2 | 2 | Air | The High Priestess |
| 3 | 3 | Water | The Empress |
| 4 | 4 | Water | The Emperor |
| 5 | 5 | Earth | The Hierophant |
| 6 | 6 | Air | The Lovers |
| 7 | 7 | Air | The Chariot |
| 8 | 8 | Air | Strength |
| 9 | 9 | Earth | The Hermit |
| 10 | 10 | Aether | Wheel of Fortune |
| 11 | 11 | Aether | Justice |
| 12 | 12 | Aether | The Hanged Man |

## Unlock Notifications

When a chapter unlocks:
1. Create notification entry
2. Send toast notification on next app open
3. Update chapter grid with animation
4. Log unlock event for analytics

## Edge Cases

1. **No biorhythm data**: Skip unlock check, keep chapters locked
2. **Multiple chapters eligible**: Unlock all eligible chapters at once
3. **Retroactive unlocks**: If checking historical data reveals eligibility, unlock
4. **Birthdate changes**: Re-evaluate all unlocks with new birthdate
5. **Timezone changes**: Re-evaluate using new timezone for "today"
