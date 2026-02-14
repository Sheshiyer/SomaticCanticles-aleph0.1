# Warcraft UI Implementation Roadmap
**Generated:** 2026-02-14  
**Project:** Somatic Canticles - Component Integration Plan  
**Target:** Transform from 12% to 85% Warcraft component adoption

---

## Overview

This document provides a **phased, prioritized action plan** to integrate Warcraft UI components across all pages. Each phase includes specific file locations, line numbers, before/after code examples, and estimated effort.

### Implementation Phases

| Phase | Focus | Pages | Est. LOC Changes | Timeline |
|-------|-------|-------|------------------|----------|
| **Phase 1** | Settings + Dashboard Home | 2 | ~600 lines | Week 1 |
| **Phase 2** | Progress + Achievements | 2 | ~400 lines | Week 2 |
| **Phase 3** | Chapters + Admin | 2 | ~300 lines | Week 3 |
| **Phase 4** | Auth Pages + Polish | 4 | ~200 lines | Week 4 |

**Total Effort:** ~1,500 LOC changes across 4 weeks

---

## Phase 1: Critical Pages (Settings + Dashboard Home)

**Priority:** 🔴 Critical  
**Timeline:** Week 1 (5 working days)  
**Files:** 2 pages  
**Impact:** Highest user traffic pages transformed

### Page 1.1: Settings Page (`app/dashboard/settings/page.tsx`)

**Current State:** 535 lines, 0% Warcraft adoption  
**Target State:** 85% adoption with HudPanel, DataDisplay, TechFrame

#### Import Changes

```tsx
// ADD TO TOP OF FILE (after existing imports)
import {
  TechFrame,
  HudPanel,
  DataDisplay,
  SectionDivider,
} from "@/components/ui/frame";
```

#### Change 1: Account Information Card → HudPanel

**Location:** Lines 237-279

**Before:**
```tsx
<Card variant="glass" noPadding className="border-metal-700/50">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-metallic">
      <Mail className="h-5 w-5 text-primary" />
      Account Information
    </CardTitle>
    <CardDescription>Your account details and membership information.</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* ... content ... */}
  </CardContent>
</Card>
```

**After:**
```tsx
<HudPanel
  title="Account Information"
  icon={<Mail className="h-5 w-5" />}
  variant="default"
  className="scan-lines"
>
  <p className="text-sm text-muted-foreground mb-4">
    Your account details and membership information.
  </p>
  <div className="space-y-4">
    {/* ... existing content ... */}
  </div>
</HudPanel>
```

**Changes:**
- Replace `Card` → `HudPanel`
- Add `.scan-lines` class for tech overlay
- Move description inside panel content
- Icon passed as prop for header integration

#### Change 2: Email & Account Type → DataDisplay Components

**Location:** Lines 246-263

**Before:**
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <div className="space-y-2.5">
    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email Address</Label>
    <div className="flex items-center gap-3 rounded-lg border border-metal-700 bg-metal-800/50 px-4 py-3">
      <Mail className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{user?.email || "Not available"}</span>
    </div>
  </div>
  <div className="space-y-2.5">
    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Account Type</Label>
    <div className="flex items-center gap-3 rounded-lg border border-metal-700 bg-metal-800/50 px-4 py-3">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm capitalize">{user?.role || "User"}</span>
      <Badge variant="outline" className="ml-auto text-xs">Active</Badge>
    </div>
  </div>
</div>
```

**After:**
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  <DataDisplay
    label="Email Address"
    value={user?.email || "Not available"}
    icon={<Mail className="h-4 w-4" />}
    variant="default"
  />
  <DataDisplay
    label="Account Type"
    value={user?.role || "User"}
    icon={<Shield className="h-4 w-4" />}
    variant="tech"
  />
</div>
```

**Changes:**
- Replace custom divs → `DataDisplay` components
- Remove manual styling (handled by component)
- Cleaner, more semantic code
- Automatic HUD styling applied

#### Change 3: Profile Information Card → HudPanel

**Location:** Lines 282-345

**Before:**
```tsx
<Card variant="glass" noPadding className="border-metal-700/50">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-metallic">
      <User className="h-5 w-5 text-primary" />
      Profile Information
    </CardTitle>
    <CardDescription>
      Update your profile information for personalized biorhythm calculations.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
      {/* ... form fields ... */}
    </form>
  </CardContent>
</Card>
```

**After:**
```tsx
<HudPanel
  title="Profile Information"
  icon={<User className="h-5 w-5" />}
  variant="default"
  className="scan-lines"
>
  <p className="text-sm text-muted-foreground mb-6">
    Update your profile information for personalized biorhythm calculations.
  </p>
  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
    {/* ... existing form fields ... */}
  </form>
</HudPanel>
```

#### Change 4: Password Change Card → HudPanel

**Location:** Lines 350-468

**Before:**
```tsx
<Card variant="glass" noPadding className="border-metal-700/50">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-metallic">
      <KeyRound className="h-5 w-5 text-primary" />
      Change Password
    </CardTitle>
    {/* ... */}
  </CardHeader>
  {/* ... */}
</Card>
```

**After:**
```tsx
<HudPanel
  title="Change Password"
  icon={<KeyRound className="h-5 w-5" />}
  variant="default"
  className="scan-lines"
>
  {/* ... existing content ... */}
</HudPanel>
```

#### Change 5: Danger Zone → TechFrame + HudPanel

**Location:** Lines 473-530

**Before:**
```tsx
<Card variant="glass" noPadding className="border-rose-500/30 bg-rose-950/10">
  <CardHeader className="pb-4">
    <CardTitle className="flex items-center gap-2 text-rose-400">
      <Trash2 className="h-5 w-5" />
      Danger Zone
    </CardTitle>
    {/* ... */}
  </CardHeader>
  {/* ... */}
</Card>
```

**After:**
```tsx
<TechFrame variant="alert" className="scan-lines">
  <HudPanel
    title="Danger Zone"
    icon={<Trash2 className="h-5 w-5" />}
    variant="alert"
  >
    {/* ... existing content ... */}
  </HudPanel>
</TechFrame>
```

**Changes:**
- Double-wrapped: TechFrame provides alert border, HudPanel provides structure
- `.scan-lines` on outer frame for effect layering
- `variant="alert"` on both for red tech styling

#### Change 6: Page Title → Add .text-metallic

**Location:** Line 214

**Before:**
```tsx
<h1 className="text-3xl font-bold tracking-tight text-metallic">Settings</h1>
```

**After:**
```tsx
<h1 className="text-3xl font-bold tracking-tight text-metallic">Settings</h1>
```

**Note:** Already has `.text-metallic` ✅ - No change needed

#### Change 7: TabsList → Wrap in TechFrame

**Location:** Lines 218-232

**Before:**
```tsx
<TabsList className="grid w-full grid-cols-3 lg:w-auto bg-metal-800/50 p-1">
  <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-metal-700">
    {/* ... */}
  </TabsTrigger>
  {/* ... */}
</TabsList>
```

**After:**
```tsx
<TechFrame variant="tech" size="sm">
  <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-transparent p-1">
    <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-metal-700">
      {/* ... */}
    </TabsTrigger>
    {/* ... */}
  </TabsList>
</TechFrame>
```

**Changes:**
- Wrapped in `TechFrame variant="tech"` for cyan tech border
- Remove `bg-metal-800/50` (handled by TechFrame)
- Adds corner accents automatically

#### Change 8: Add SectionDivider between tabs content

**Location:** After line 233 (before TabsContent)

**Add:**
```tsx
<SectionDivider className="my-6" />
```

### Settings Page Summary

**Total Changes:**
- 4 Card → HudPanel replacements
- 2 custom divs → DataDisplay replacements
- 1 TechFrame wrapper addition
- 1 SectionDivider addition
- **Total: 8 component upgrades**

**Lines Modified:** ~300 lines  
**Estimated Time:** 2-3 hours  
**Testing Required:** Form submission, password change, delete account flow

---

### Page 1.2: Dashboard Home (`app/dashboard/page.tsx`)

**Current State:** 511 lines, 10% adoption (only LightPillar)  
**Target State:** 80% adoption with DataDisplay, HudPanel, TechFrame

#### Import Changes

```tsx
// ADD TO EXISTING IMPORTS
import {
  TechFrame,
  HudPanel,
  DataDisplay,
  SectionDivider,
} from "@/components/ui/frame";
import { LightPillarGroup } from "@/components/effects/LightPillar";
```

#### Change 1: Welcome Banner → TechFrame

**Location:** Lines 224-259

**Before:**
```tsx
<Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
    {/* ... welcome content ... */}
  </CardContent>
</Card>
```

**After:**
```tsx
<TechFrame variant="gold" className="glass-strong">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    {/* Add LightPillarGroup background */}
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <LightPillarGroup count={3} height="100%" spacing={60} />
    </div>
    
    <div className="relative z-10">
      {/* ... existing welcome content ... */}
    </div>
  </div>
</TechFrame>
```

**Changes:**
- Card → TechFrame with gold variant (VIP treatment)
- Add `.glass-strong` for glassmorphism
- Add LightPillarGroup background effect
- Golden corner accents automatically added

#### Change 2: Stats Cards → DataDisplay Components

**Location:** Lines 289-386 (4 stat cards)

**Before (Peak Cycles Card):**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Peak Cycles</CardTitle>
    <Sparkles className="h-4 w-4 text-yellow-500" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      {summary.peaks.length}
    </div>
    <p className="text-xs text-muted-foreground">
      {summary.peaks.length > 0
        ? summary.peaks.map((p) => p.key).join(", ")
        : "No peaks today"}
    </p>
  </CardContent>
</Card>
```

**After (Peak Cycles):**
```tsx
<DataDisplay
  label="Peak Cycles"
  value={summary.peaks.length}
  icon={<Sparkles className="h-4 w-4" />}
  variant="success"
  trendValue={summary.peaks.length > 0 
    ? summary.peaks.map((p) => p.key).join(", ")
    : "No peaks today"}
/>
```

**Apply similar pattern to all 4 stat cards:**

| Card | Lines | Label | Value | Variant | Icon |
|------|-------|-------|-------|---------|------|
| Peak Cycles | 290-306 | "Peak Cycles" | `summary.peaks.length` | "success" | `<Sparkles>` |
| Critical Days | 309-324 | "Critical Days" | `summary.criticals.length` | "warning" | `<Activity>` |
| Strongest | 327-349 | "Strongest" | `best.key` | "tech" | `<TrendingUp>` |
| Next Peak | 352-386 | "Next Peak" | `nextPeak date` | "default" | `<Calendar>` |

**Changes:**
- All 4 Cards → DataDisplay
- Automatic HUD styling
- Monospace numbers with `.data-value`
- Color-coded variants for visual hierarchy

#### Change 3: Biorhythm Wheel Card → HudPanel

**Location:** Lines 392-413

**Before:**
```tsx
<Card className="h-full">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Activity className="h-5 w-5 text-primary" />
      Cycle Wheel
    </CardTitle>
    <CardDescription>
      Visual representation of your current biorhythm cycles
    </CardDescription>
  </CardHeader>
  <CardContent className="flex items-center justify-center pb-8">
    {biorhythmData && (
      <BiorhythmWheel data={biorhythmData} size={260} animated={!refreshing} />
    )}
  </CardContent>
</Card>
```

**After:**
```tsx
<HudPanel
  title="Cycle Wheel"
  icon={<Activity className="h-5 w-5" />}
  variant="default"
  className="scan-lines h-full"
>
  <p className="text-sm text-muted-foreground mb-4">
    Visual representation of your current biorhythm cycles
  </p>
  <div className="flex items-center justify-center pb-4">
    {biorhythmData && (
      <BiorhythmWheel data={biorhythmData} size={260} animated={!refreshing} />
    )}
  </div>
</HudPanel>
```

#### Change 4: Cycle Bars Card → HudPanel

**Location:** Lines 416-433

**Before:**
```tsx
<Card className="h-full">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <TrendingUp className="h-5 w-5 text-primary" />
      Current Levels
    </CardTitle>
    <CardDescription>
      Detailed breakdown of each cycle&apos;s current value
    </CardDescription>
  </CardHeader>
  <CardContent>
    {biorhythmData && (
      <CycleBars data={biorhythmData} animated={!refreshing} />
    )}
  </CardContent>
</Card>
```

**After:**
```tsx
<HudPanel
  title="Current Levels"
  icon={<TrendingUp className="h-5 w-5" />}
  variant="tech"
  className="scan-lines h-full"
>
  <p className="text-sm text-muted-foreground mb-4">
    Detailed breakdown of each cycle&apos;s current value
  </p>
  {biorhythmData && (
    <CycleBars data={biorhythmData} animated={!refreshing} />
  )}
</HudPanel>
```

#### Change 5: Forecast Cards → HudPanel (x2)

**Locations:** Lines 437-460 (7-day) and 463-485 (30-day)

**Apply same pattern:**
- Card → HudPanel with `.scan-lines`
- Icon in header
- Description moved to content
- `variant="default"` or `"tech"`

#### Change 6: Info Section → TechFrame

**Location:** Lines 488-507

**Before:**
```tsx
<div className="rounded-lg border bg-muted/50 p-6">
  <div className="flex items-start gap-4">
    <div className="mt-1">
      <LightPillar color="solar" height={40} width={3} intensity="low" />
    </div>
    <div>
      <h3 className="font-semibold">About Biorhythms</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {/* ... description ... */}
      </p>
    </div>
  </div>
</div>
```

**After:**
```tsx
<TechFrame variant="default" className="glass">
  <div className="flex items-start gap-4">
    <div className="mt-1">
      <LightPillar color="solar" height={40} width={3} intensity="low" />
    </div>
    <div>
      <h3 className="font-semibold text-metallic">About Biorhythms</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {/* ... existing description ... */}
      </p>
    </div>
  </div>
</TechFrame>
```

**Changes:**
- div → TechFrame with corner accents
- Add `.glass` effect
- Add `.text-metallic` to heading
- Automatic tech border styling

### Dashboard Home Summary

**Total Changes:**
- 7 Card → HudPanel/TechFrame replacements
- 4 stat Card → DataDisplay replacements
- 1 LightPillarGroup addition
- **Total: 12 component upgrades**

**Lines Modified:** ~300 lines  
**Estimated Time:** 3-4 hours  
**Testing Required:** Biorhythm data loading, refresh functionality

---

## Phase 1 Summary

### Files Changed
1. `app/dashboard/settings/page.tsx` - 8 upgrades
2. `app/dashboard/page.tsx` - 12 upgrades

### Total Impact
- **20 component upgrades**
- **~600 lines modified**
- **Warcraft adoption: 0% → 85%** on these pages
- **Estimated time:** 5-7 hours development + 2-3 hours testing

### Implementation Checklist

- [ ] Create feature branch: `feat/warcraft-ui-phase-1`
- [ ] Update Settings page (8 changes)
  - [ ] Import Warcraft components
  - [ ] Replace Cards with HudPanels
  - [ ] Add DataDisplay components
  - [ ] Add TechFrame wrappers
  - [ ] Add .scan-lines classes
  - [ ] Test all form submissions
- [ ] Update Dashboard home (12 changes)
  - [ ] Import Warcraft components
  - [ ] Replace stat Cards with DataDisplay
  - [ ] Replace Cards with HudPanels
  - [ ] Add TechFrame wrappers
  - [ ] Add LightPillarGroup
  - [ ] Test biorhythm loading
- [ ] Run type checks: `npm run type-check`
- [ ] Run linter: `npm run lint`
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Verify accessibility (screen reader, keyboard navigation)
- [ ] Create PR with before/after screenshots
- [ ] Deploy to staging for review

---

## Phase 2: Data-Heavy Pages (Progress + Achievements)

**Priority:** 🟠 High  
**Timeline:** Week 2  
**Files:** 2 pages  
**Impact:** User engagement & gamification pages

### Page 2.1: Progress Page (`app/dashboard/progress/page.tsx`)

**Changes Required:** 6 component replacements

#### Change 1: Stat Cards → DataDisplay (x4)

**Location:** Lines 131-159 (StatCard component calls)

**Before:**
```tsx
<StatCard
  title="Total Time"
  value={stats ? formatTime(stats.totalTimeSpent.hours, stats.totalTimeSpent.minutes) : '0m'}
  subtitle="Across all chapters"
  icon={<Clock className="h-4 w-4" />}
  delay={0.1}
/>
```

**After:**
```tsx
<DataDisplay
  label="Total Time"
  value={stats ? formatTime(stats.totalTimeSpent.hours, stats.totalTimeSpent.minutes) : '0m'}
  icon={<Clock className="h-4 w-4" />}
  variant="default"
  trendValue="Across all chapters"
/>
```

**Apply to all 4 stat cards:**
- Total Time
- Chapters Completed
- Current Streak (variant="warning")
- Achievements (variant="tech")

#### Change 2: Overall Progress Card → HudPanel

**Location:** Lines 168-233

**Before:**
```tsx
<Card variant="glass" noPadding className="border-metal-700/50">
  <CardHeader className="pb-4">
    <CardTitle className="text-metallic">Overall Progress</CardTitle>
    <CardDescription>Your journey through all 12 chapters</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* ... progress content ... */}
  </CardContent>
</Card>
```

**After:**
```tsx
<HudPanel
  title="Overall Progress"
  variant="tech"
  className="scan-lines"
>
  <p className="text-sm text-muted-foreground mb-6">
    Your journey through all 12 chapters
  </p>
  {/* ... existing progress content ... */}
</HudPanel>
```

#### Change 3: Recent Activity Card → HudPanel

**Location:** Lines 241-294

**Similar transformation:** Card → HudPanel with Calendar icon

#### Change 4: Chapter Grid → TechFrame Wrapper

**Location:** Lines 188-214

**Wrap the chapter grid:**
```tsx
<TechFrame variant="default" size="sm">
  <div className="grid grid-cols-12 gap-1.5">
    {/* ... existing grid ... */}
  </div>
</TechFrame>
```

### Page 2.2: Achievements Page (`app/dashboard/achievements/page.tsx`)

**Changes Required:** 4 component replacements

#### Change 1: Progress Overview → TechFrame + HudPanel

**Location:** Lines 97-147

**Wrap in TechFrame, convert Card to HudPanel**

#### Change 2: Rarity Stats → DataDisplay (x4)

**Location:** Lines 106-116

**Replace plain divs with DataDisplay for each rarity:**
```tsx
<DataDisplay
  label="Common"
  value={`${stats.unlocked} / ${stats.total}`}
  variant="default"
/>
```

#### Change 3: Filters Card → TechFrame

**Location:** Lines 165-177

**Wrap TabsList in TechFrame variant="tech"**

---

## Phase 3: Content Pages (Chapters + Admin)

**Priority:** 🟡 Medium  
**Timeline:** Week 3  
**Files:** 2 pages  
**Impact:** Core content navigation + admin monitoring

### Page 3.1: Chapters Page (`app/(dashboard)/chapters/page.tsx`)

**Changes Required:** 3 additions

1. Wrap header in TechFrame (lines 181-200)
2. Add HudPanel for stats section with DataDisplay trio
3. Wrap filter TabsList in TechFrame variant="tech"

### Page 3.2: Admin Page (`app/admin/page.tsx`)

**Changes Required:** Complete overhaul

1. Wrap entire admin area in TechFrame variant="alert"
2. Replace all stat Cards with DataDisplay
3. Add HudPanel for user management sections
4. Add .scan-lines for "system monitoring" aesthetic

---

## Phase 4: Authentication Pages + Polish

**Priority:** ⚪ Low  
**Timeline:** Week 4  
**Files:** 4 pages  
**Impact:** Onboarding experience + final touches

### Auth Pages Enhancement

**Changes for Login, Register, Forgot Password:**

1. Update to `Card variant="glass"`
2. Add `.glass-strong` effect
3. Ensure CardCorners are applied
4. Add gradient accent lines (already in forgot-password example)
5. Add .scan-lines subtly

### Global Polish Tasks

1. **CSS Utility Sweep**
   - Add `.text-metallic` to all major headings
   - Add `.data-value` to all numeric displays
   - Apply `.scan-lines` to all HudPanels

2. **Design Token Migration**
   - Replace hardcoded spacing with `var(--space-*)` 
   - Replace hardcoded colors with semantic variables
   - Use utility classes (.stack-md, .card-padding, etc.)

3. **Performance Optimization**
   - Add `.gpu-accelerated` to animated elements
   - Add `.animation-container` to animation wrappers
   - Verify GPU hints on all transitions

---

## Code Examples & Patterns

### Pattern 1: Basic Card → HudPanel

```tsx
// ❌ Before
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ✅ After
<HudPanel title="Title" variant="default" className="scan-lines">
  Content
</HudPanel>
```

### Pattern 2: Stat Card → DataDisplay

```tsx
// ❌ Before
<Card>
  <CardHeader>
    <CardTitle>Users</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,234</div>
    <p className="text-xs">+12% this week</p>
  </CardContent>
</Card>

// ✅ After
<DataDisplay
  label="Users"
  value={1234}
  icon={<Users className="h-4 w-4" />}
  trend="up"
  trendValue="+12% this week"
  variant="tech"
/>
```

### Pattern 3: Section → TechFrame Wrapper

```tsx
// ❌ Before
<div className="rounded-lg border p-6">
  <h2>Section Title</h2>
  {/* content */}
</div>

// ✅ After
<TechFrame variant="default">
  <h2 className="text-metallic mb-4">Section Title</h2>
  {/* content */}
</TechFrame>
```

### Pattern 4: Adding Scan Lines Overlay

```tsx
// ✅ Just add className
<HudPanel className="scan-lines">
  {/* The .scan-lines class in globals.css handles the overlay */}
</HudPanel>
```

### Pattern 5: Design Token Usage

```tsx
// ❌ Before
<div className="p-6 gap-4 mb-3">

// ✅ After (Tailwind v4)
<div style={{
  padding: 'var(--space-6)',
  gap: 'var(--space-4)',
  marginBottom: 'var(--space-3)'
}}>

// OR use utility classes
<div className="card-padding stack-md">
```

---

## Testing Checklist

### Per-Page Testing

For each modified page:

- [ ] **Visual Regression**
  - Compare before/after screenshots
  - Verify tech aesthetic applied
  - Check corner accents visible
  - Confirm scan lines overlay working

- [ ] **Functionality**
  - All buttons clickable
  - Forms submit correctly
  - Data displays accurately
  - Animations perform smoothly

- [ ] **Responsive**
  - Mobile (375px width)
  - Tablet (768px width)
  - Desktop (1440px width)
  - Verify HudPanel headers stack correctly

- [ ] **Accessibility**
  - Screen reader compatibility
  - Keyboard navigation works
  - Focus states visible
  - ARIA labels present

- [ ] **Performance**
  - No layout shift
  - Smooth animations (60fps)
  - Fast initial render
  - GPU acceleration working

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Dark Mode Verification

- [ ] All components render correctly in dark mode
- [ ] Glow effects visible but not overwhelming
- [ ] Text contrast meets WCAG AA standards

---

## Migration Scripts (Optional Automation)

### Quick Find & Replace Patterns

**For mass replacements (use with caution):**

```bash
# Replace basic Card with HudPanel imports
# (Manual verification required after)

# 1. Add imports at top of files
# Find: import { Card,
# Replace: import { HudPanel, TechFrame, DataDisplay } from "@/components/ui/frame";\nimport { Card,

# 2. Simple Card to HudPanel (requires manual prop adjustment)
# Find: <Card variant="glass"
# Replace: <HudPanel variant="default" className="scan-lines"
```

**Note:** Automated replacement NOT recommended - requires manual review for each instance.

---

## Success Metrics & Validation

### Adoption Targets (Post-Implementation)

| Metric | Pre-Phase 1 | Post-Phase 1 | Post-Phase 2 | Post-Phase 3 | Post-Phase 4 | Final Target |
|--------|-------------|--------------|--------------|--------------|--------------|--------------|
| TechFrame Usage | 2% | 40% | 55% | 65% | 70% | **60%+** |
| HudPanel Usage | 0% | 60% | 75% | 80% | 85% | **80%+** |
| DataDisplay Usage | 0% | 70% | 85% | 90% | 95% | **90%+** |
| CSS Utilities | 14% | 35% | 50% | 65% | 80% | **75%+** |
| Design Tokens | 25% | 45% | 60% | 80% | 100% | **100%** |
| **Overall Warcraft Adoption** | **12%** | **50%** | **65%** | **75%** | **85%** | **85%+** |

### Visual Consistency Checklist

After all phases complete:

- [ ] All dashboard pages have consistent HudPanel styling
- [ ] All metrics use DataDisplay component
- [ ] All major sections wrapped in TechFrame
- [ ] Scan lines overlay applied consistently
- [ ] Metallic text effect on all headings
- [ ] Corner accents visible on all panels
- [ ] Glassmorphism effects applied to overlays
- [ ] Circuit patterns in appropriate backgrounds
- [ ] Design tokens used throughout (zero hardcoded values)
- [ ] GPU acceleration on all animations

---

## Rollback Plan

### If Issues Arise

1. **Feature branch strategy:** Each phase in separate branch
2. **Git tags:** Tag before each phase deployment
3. **Quick rollback:** `git revert <commit>` if critical bug
4. **Component fallback:** Warcraft components designed to accept same props as shadcn components

### Backup Strategy

Before starting each phase:
```bash
git checkout -b backup/pre-phase-X
git tag phase-X-checkpoint
```

---

## Conclusion

This phased approach transforms the Somatic Canticles UI from **rudimentary generic** to **polished Warcraft tech aesthetic** in 4 weeks:

- **Week 1:** Settings + Dashboard (highest impact pages)
- **Week 2:** Progress + Achievements (engagement pages)
- **Week 3:** Chapters + Admin (content pages)
- **Week 4:** Auth + Polish (final touches)

**Final Result:**
- 85%+ Warcraft component adoption
- Zero functional regressions
- Consistent tech aesthetic across all pages
- Production-ready code with full test coverage

**Next Steps:**
1. Review this plan with team
2. Allocate developer resources
3. Start Phase 1 implementation
4. Track progress using checklist items

---

**Roadmap Created:** 2026-02-14  
**Maintainer:** Development Team  
**Last Updated:** 2026-02-14  
**Next Review:** End of Week 1 (Phase 1 completion)
