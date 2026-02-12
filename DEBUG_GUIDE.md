# Debug Guide - UI & Routes

## Current Status

### ✅ Build Successful
All routes are being generated correctly:
- `/` - Landing page (with Warcraft UI)
- `/chapters` - Chapters list
- `/chapters/[1-12]` - Individual chapters
- `/dashboard` - Dashboard
- `/dashboard/*` - Settings, progress, achievements
- `/admin` - Admin panel
- `/auth/*` - Login, register, forgot-password

### ✅ Landing Page Has Warcraft UI
Components being used:
- `TechFrame` (4 instances)
- `HudPanel` (6 instances - 4 cycles + 2 CTA panels)
- `DataDisplay` (4 instances - cycle periods)
- `CornerOrnament` (16 instances - corners on frames)
- `SectionDivider` (footer)

## Fix Steps

### 1. Clear Cache & Restart Dev Server
```bash
# Stop your current dev server (Ctrl+C)

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Restart dev server
npm run dev
# or
bun dev
```

### 2. Verify Landing Page (http://localhost:3000)
You should see:
- **Hero section** wrapped in TechFrame with corner ornaments
- **4 Cycle cards** as HudPanels with DataDisplay showing periods (23d, 28d, 33d, 21d)
- **Features section** in TechFrame with gold variant
- **CTA section** with 2 HudPanels (System Requirements, Expected Timeline)
- **HUD-style footer** with system status

### 3. Test Routes (when logged in)
After logging in with `test@example.com` / `TestUser13!`:
- http://localhost:3000/dashboard - Should work
- http://localhost:3000/chapters - Should work
- http://localhost:3000/chapters/1 - Should work
- http://localhost:3000/admin - Will redirect (test user is not admin)

### 4. Login as Admin
to access `/admin`, use:
- Email: `admin@somatic-canticles.local`
- Password: `SomaticDev44!`

## If Routes Still 404

Check if you're using the correct URL format:
- ❌ `http://localhost:3000/app/chapters`
- ✅ `http://localhost:3000/chapters`

## If UI Still Looks Generic

1. Open browser DevTools
2. Check Console for errors
3. Check Network tab - are CSS/JS files loading?
4. Try hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

## File Locations

- Landing page: `/app/page.tsx`
- Warcraft UI components: `/src/components/ui/frame.tsx`
- Dashboard layout: `/app/dashboard/layout.tsx`
- Chapters: `/app/(dashboard)/chapters/page.tsx`
- Admin: `/app/admin/page.tsx`
