# Milestone Plans

## M0 — Frontend Mock (Static UI)
**Goal:** Build all pages with mock data to lock in design before wiring backend.
- Init Next.js + TypeScript + Tailwind CSS
- Create routes/pages:
  - Auth (login + questionnaire/signup)
  - Home / Dashboard
  - Necessity Detail
  - Vendor List (all vendors)
  - Inspiration Gallery
  - Invoice / Payment Tracker
  - Calendar
- Vendor Detail: modal (not a page)
- Core layout components (navbar, sidebar, shared styles)
- Fully static mock data — no database, no auth
- Navigation/routing working between all pages

## M1 — Project Setup & Database
**Goal:** Foundation for real data layer.
- Set up Prisma (or Drizzle) with SQLite
- Define schema:
  - `User` (id, password)
  - `Questionnaire` (bride_name, groom_name, wedding_date, location, budget, budget_tier, selected_necessities)
  - `Necessity` (name, default true/optional)
  - `Todo` (necessity_id, title, pic, due_date, status, description, link)
  - `Vendor` (user_added vs recommended, name, social_links, priority, budget, pros, cons, necessity_id, notes)
  - `GalleryItem` (link, description, necessity_id)
  - `Invoice` (vendor_id, photo_path, amount, notes)
  - `CalendarEvent` (title, date, necessity_id, description)
  - `RecentActivity` (necessity_id, action, created_at)
- Install required packages

## M2 — Auth & Questionnaire
**Goal:** Users can sign up via questionnaire and log in.
- ID/password auth (no email, no OAuth)
- Questionnaire page (standalone, also on first visit)
- Login page
- Session/cookie-based auth (NextAuth or simple cookie)
- Redirect unauthenticated users to login
- After signup, redirect to questionnaire if not filled

## M3 — Home / Dashboard
**Goal:** Central overview of wedding progress.
- Budget progress bar (total budget vs spent)
- Timeline progress bar (completed todos / total todos)
- Warning indicator (overdue timeline items)
- List of necessities that still need vendors
- Recent activity feed (last 5-10 actions)

## M4 — Necessity Detail
**Goal:** Manage each necessity in depth.
- To-do list with PIC, due date, status, description, important links
- User-added vendors list (with pros/cons, priority sorting)
- Recommended vendors list (from seed data)
- Vendor detail modal (full info, contact, notes, attached proposals)
- Add/edit/delete todos and vendors

## M5 — Vendor Pages
**Goal:** See all vendors across all necessities.
- All-vendors list page
- Filters: by necessity, priority, budget range
- Quick actions from list view

## M6 — Inspiration Gallery
**Goal:** Collect and view inspiration links.
- Grid of gallery items (link, description, thumbnail if possible)
- YouTube embed (playable inline)
- TikTok embed (nice-to-have)
- Organized by necessity category

## M7 — Invoice & Calendar
**Goal:** Track payments and schedule.
- Invoice upload page per vendor (photo upload)
- Total spent vs budget per necessity
- In-app calendar view
- Add meetings/deadlines linked to necessities

## M8 — Seed Data, Polish & Testing
**Goal:** Production-ready finish.
- Hardcoded recommended vendor seed data
- Refine warning system (overdue, budget nearing limit)
- Responsive design pass
- Write tests for each milestone feature
- Bug fixes and UI polish
