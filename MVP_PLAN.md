# Somatic Canticles - MVP Plan

## Current Status

### ✅ Working
- [x] Landing page
- [x] Authentication (login/register)
- [x] JWT tokens
- [x] Database with users, chapters
- [x] API endpoints

### ⚠️ Issues to Fix
1. Dashboard doesn't show welcome message with user name
2. Chapters page needs to load data properly
3. Need admin dashboard

### 📋 MVP Features (Priority Order)

## Phase 1: User Experience (This Week)

### 1.1 Dashboard Welcome (2 hours)
- [ ] Add welcome message with user's name/email
- [ ] Show "Today's Biorhythm" summary card
- [ ] Show recent progress
- [ ] Quick links to chapters

### 1.2 Chapters Page (4 hours)
- [ ] Fix chapter loading
- [ ] Show unlock status properly
- [ ] Chapter detail page with content
- [ ] Mark chapters complete

### 1.3 Profile Page (2 hours)
- [ ] View profile info
- [ ] Update birthdate/timezone
- [ ] Change password

## Phase 2: Admin Dashboard (Next Week)

### 2.1 Admin Layout (2 hours)
- [ ] Admin sidebar navigation
- [ ] Admin-only access (role check)
- [ ] Admin header

### 2.2 User Management (4 hours)
- [ ] List all users
- [ ] View user details
- [ ] Edit user role
- [ ] Delete user
- [ ] Search/filter users

### 2.3 Analytics Overview (4 hours)
- [ ] Total users count
- [ ] Active users (last 7 days)
- [ ] Chapters completion stats
- [ ] Recent signups

### 2.4 Content Management (Optional)
- [ ] Edit chapter content
- [ ] View chapter stats

## Phase 3: Polish (Following Week)

### 3.1 Error Handling
- [ ] Better error messages
- [ ] Loading states
- [ ] Empty states

### 3.2 Mobile Responsive
- [ ] Test on mobile
- [ ] Fix layout issues

### 3.3 Performance
- [ ] API response caching
- [ ] Image optimization

---

## Implementation Checklist

### Dashboard Fixes
- [x] Fix API URL (remove /api/v1)
- [x] Add refresh_tokens table
- [x] Seed chapters
- [ ] Add welcome banner to dashboard
- [ ] Show user name in header

### Admin Dashboard
- [ ] Create admin layout
- [ ] Create admin pages
- [ ] Add admin API endpoints
- [ ] Role-based access control

### Testing
- [ ] Test login flow
- [ ] Test chapter access
- [ ] Test admin features

---

## Quick Wins (Do Today)

1. **Add Welcome Message** - Show "Welcome back, [email]" on dashboard
2. **Fix Chapters Loading** - Ensure chapters API is being called correctly
3. **Create Admin Page** - Simple user list for admin

---

## Notes

- Focus on functionality over design
- Use existing UI components
- Reuse patterns from existing pages
- Don't add new dependencies
