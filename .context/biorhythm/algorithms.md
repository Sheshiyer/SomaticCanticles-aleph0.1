# Biorhythm Calculation Algorithms

## Overview

Biorhythms are theoretical cycles that attempt to track various aspects of human well-being and capability. Each cycle follows a sinusoidal pattern with a specific period length.

## Cycle Definitions

### Physical Cycle
- **Period**: 23 days
- **Pattern**: Sinusoidal
- **Description**: Represents physical strength, endurance, coordination, and overall vitality
- **Formula**: `sin(2π × days_since_birth / 23)`

### Emotional Cycle
- **Period**: 28 days (matches lunar cycle)
- **Pattern**: Sinusoidal
- **Description**: Represents emotional stability, sensitivity, creativity, and mood
- **Formula**: `sin(2π × days_since_birth / 28)`

### Intellectual Cycle
- **Period**: 33 days
- **Pattern**: Sinusoidal
- **Description**: Represents mental alertness, analytical ability, logic, and memory
- **Formula**: `sin(2π × days_since_birth / 33)`

### Spiritual Cycle (Custom)
- **Period**: 21 days
- **Pattern**: Sinusoidal
- **Description**: Represents intuition, spiritual awareness, and connection to higher consciousness
- **Formula**: `sin(2π × days_since_birth / 21)`

## Core Formula

```
cycle_value = sin(2π × days_since_birth / cycle_length)
```

Where:
- `days_since_birth`: Number of days between birthdate and target date
- `cycle_length`: The period of the specific cycle (23, 28, 33, or 21)
- Result is in range [-1, 1]

## Implementation Details

### Days Calculation

```typescript
// Calculate days between two dates, accounting for timezone
function getDaysBetween(birthdate: Date, targetDate: Date, timezone: string): number {
  // Convert both dates to the target timezone
  const birthInTZ = toZonedTime(birthdate, timezone);
  const targetInTZ = toZonedTime(targetDate, timezone);
  
  // Calculate difference in milliseconds and convert to days
  const diffMs = targetInTZ.getTime() - birthInTZ.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return Math.floor(diffDays);
}
```

### Single Cycle Calculation

```typescript
function calculateCycle(daysSinceBirth: number, cycleLength: number): number {
  const radians = (2 * Math.PI * daysSinceBirth) / cycleLength;
  return Math.sin(radians);
}
```

### All Cycles Calculation

```typescript
interface BiorhythmValues {
  physical: number;      // 23-day cycle
  emotional: number;     // 28-day cycle
  intellectual: number;  // 33-day cycle
  spiritual: number;     // 21-day cycle
}

function calculateAllCycles(daysSinceBirth: number): BiorhythmValues {
  return {
    physical: Math.sin((2 * Math.PI * daysSinceBirth) / 23),
    emotional: Math.sin((2 * Math.PI * daysSinceBirth) / 28),
    intellectual: Math.sin((2 * Math.PI * daysSinceBirth) / 33),
    spiritual: Math.sin((2 * Math.PI * daysSinceBirth) / 21),
  };
}
```

## Cycle Phases

### Positive Phase (> 0)
- Cycle is in "high" period
- Associated qualities are enhanced

### Negative Phase (< 0)
- Cycle is in "low" period
- Associated qualities are diminished
- Rest and recovery recommended

### Critical Days (≈ 0)
- Days when cycle crosses zero
- Value between -0.1 and +0.1 considered critical
- Transition period - caution advised

### Peak Days (> 0.8)
- Days when cycle reaches near maximum
- Optimal time for cycle-related activities

### Low Days (< -0.8)
- Days when cycle reaches near minimum
- Avoid demanding activities in this domain

## Peak Detection

A peak is detected when:
```
cycle_value > 0.8
```

This indicates the cycle is near its maximum positive value.

## Critical Day Detection

A critical day is detected when:
```
abs(cycle_value) < 0.1
```

This indicates the cycle is crossing from positive to negative or vice versa.

## Example Calculations

### Example 1: Birthdate 1990-01-01, Target 2024-01-01

```
Days since birth: 12,418 days

Physical:     sin(2π × 12418 / 23)     = sin(3393.74)  = -0.382
Emotional:    sin(2π × 12418 / 28)     = sin(2786.86)  = 0.974
Intellectual: sin(2π × 12418 / 33)     = sin(2364.73)  = -0.208
Spiritual:    sin(2π × 12418 / 21)     = sin(3714.10)  = 0.588
```

### Example 2: Birthdate 1985-06-15, Target 2024-03-20

```
Days since birth: 14,127 days

Physical:     sin(2π × 14127 / 23)     = sin(3860.87)  = 0.891 (PEAK)
Emotional:    sin(2π × 14127 / 28)     = sin(3170.79)  = -0.104 (CRITICAL)
Intellectual: sin(2π × 14127 / 33)     = sin(2690.73)  = 0.707
Spiritual:    sin(2π × 14127 / 21)     = sin(4227.14)  = -0.623
```

## 30-Day Prediction Algorithm

```typescript
function predictBiorhythm(
  birthdate: Date,
  startDate: Date,
  days: number = 30,
  timezone: string = 'UTC'
): Array<{
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
  peaks: string[];
  criticalDays: string[];
}> {
  const results = [];
  
  for (let i = 0; i < days; i++) {
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + i);
    
    const daysSinceBirth = getDaysBetween(birthdate, targetDate, timezone);
    const cycles = calculateAllCycles(daysSinceBirth);
    
    const peaks = [];
    const criticalDays = [];
    
    // Check for peaks
    if (cycles.physical > 0.8) peaks.push('physical');
    if (cycles.emotional > 0.8) peaks.push('emotional');
    if (cycles.intellectual > 0.8) peaks.push('intellectual');
    if (cycles.spiritual > 0.8) peaks.push('spiritual');
    
    // Check for critical days
    if (Math.abs(cycles.physical) < 0.1) criticalDays.push('physical');
    if (Math.abs(cycles.emotional) < 0.1) criticalDays.push('emotional');
    if (Math.abs(cycles.intellectual) < 0.1) criticalDays.push('intellectual');
    if (Math.abs(cycles.spiritual) < 0.1) criticalDays.push('spiritual');
    
    results.push({
      date: targetDate.toISOString().split('T')[0],
      ...cycles,
      peaks,
      criticalDays,
    });
  }
  
  return results;
}
```

## Timezone Handling

Biorhythm calculations are date-based, not time-based. However, timezone matters when:
1. Determining which calendar day a timestamp falls on
2. Handling users across different timezones
3. Storing and retrieving historical data

### Best Practices
1. Store birthdates as dates (YYYY-MM-DD) without time components
2. Convert all calculations to the user's local timezone
3. Use IANA timezone identifiers (e.g., "America/New_York", "Asia/Tokyo")
4. Default to "UTC" if timezone not specified

## Validation

### Input Validation
- Birthdate must be a valid date in the past
- Target date should be a valid date
- Timezone must be a valid IANA timezone identifier

### Sanity Checks
- Days since birth should not be negative
- Cycle values should be in range [-1, 1]
- Very old birthdates (> 150 years) should be rejected

## References

1. Original biorhythm theory by Wilhelm Fliess (physical, emotional cycles)
2. Addition of intellectual cycle by Hermann Swoboda
3. Extended cycles in various spiritual traditions
