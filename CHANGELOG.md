# Changelog

All notable changes will be documented in this file.

## [Unreleased]

### Changed
- "Todo Terlewat" section: changed accent color from pink to red, added due date detail below each todo item
- Mood Board detail page item description label increased from text-[10px] to text-xs with semibold weight
- Guest count moved from progress card grid to dashboard header, inline with wedding date and location
- Added `.env.local` with `NEXT_DEVTOOLS_ENABLED=false` to prevent RSC manifest errors during HMR
- Added `cursor-pointer` to edit buttons (tanggal, budget) and modal backdrop overlay

### Added
- Initial project requirements (requirements.md)
- Milestone plans (milestone-plans.md)
- Changelog file (CHANGELOG.md)
- M0: Frontend mock with Next.js + TypeScript + Tailwind
- M0: All pages (Dashboard, Necessity, Vendor, Gallery, Invoice, Calendar, Login, Questionnaire)
- M0: Material Symbols icons replacing emojis
- M0: Add/Edit modals for Vendor, Gallery, Invoice, Calendar, Necessity
- M0: Static mock data with session-level state management
- M0: New default necessities (Photo Booth, Undangan Fisik/Online, Mobil Pengantin, dll)
- M0: TodoFormModal — add/edit/delete todos with inline confirmation
- M0: ConfirmDialog — reusable delete confirmation component
- M0: EmptyState — reusable empty state component with CTA
- M0: Vendor text search on /vendors page
- M0: Gallery text search on /gallery page
- M0: Delete buttons on vendors, gallery items, invoices, events, necessities
- M0: Overdue indicator badge on necessity list cards
- M0: Vendor delete button in vendor detail modal
- M0: Budget per necessity — mini bar on necessity detail page
- M0: Better empty states with add buttons across all pages
- Admin page (/admin) — superadmin account management with user list, edit/delete accounts, status toggle
- Login page easter egg — tap "v1.0.0" 10× to reveal admin login
- Live activity log on dashboard — tracks actual todo status changes instead of static mock data
- "Semua To-Do" tab on kebutuhan page — unified flat list of all todos across all necessities
- Budget editor on invoices page — edit overall wedding budget with modal
- Countdown banner redesign — full-width hero with progress ring, journey bar, responsive layout
- Mood Board page — gallery redesigned into collection cards grouped by necessity with WhatsApp-style preview grid and YouTube thumbnails

### Changed
- Sidebar renamed "Inspirasi" → "Mood Board" with collections icon
- Gallery necessity field now required with placeholder option
- Wallet info modal removed, wedding info modal added to dashboard header
- Invoice summary grid stacked for mobile (grid-cols-1 sm:grid-cols-3)
- Hover-only edit/delete buttons made always visible with 44px touch targets
- All interactive elements increased to min 44px touch targets (Apple HIG)
- Questionnaire form grids stacked on mobile (grid-cols-1 sm:grid-cols-2)
- Admin table converted to card list on mobile with responsive breakpoints
- Calendar grid made horizontally scrollable on mobile (min-w-[490px])
- Necessity detail header stacks vertically on mobile
- Card padding reduced on mobile across all pages (p-5 → p-4 sm:p-5)

### Changed (requirement4 follow-up)
- Removed "Nama Vendor" field from InvoiceFormModal (auto-uses vendor final name)
- Added filter bar on invoices page — filter by kategori, amount range (min/max), and date range (dari/sampai)
- Sidebar "Vendor" renamed to "Vendor Tracker"

### Added (requirement4)
- FAQ page (/faq) — educational Q&A about Indonesian weddings (persyaratan, rukun nikah, tradisi, kursus pranikah, tips)
- "Before You Marry" floating widget on dashboard — fun gradient card with essential pre-wedding knowledge (KUA, administrasi, rukun nikah)
- Guest count field in questionnaire Step 1 ("Jumlah Tamu") with controlled form state
- Guest count field in WeddingInfoModal edit form
- Vendor recommendation engine (src/utils/recommendations.ts) — scores vendors by fit score based on guest count + perPerson cost vs total budget
- "Rekomendasi Vendor Terbaik" card on dashboard showing top-matched vendors with fit score bars
- Guest count (guestCount) and per-person pricing (perPerson) added to TypeScript types
- Mock data updated with guestCount and perPerson values on venue/catering vendors
- Form state converted from uncontrolled to controlled in questionnaire page

### Added (schema & data)
- DB schema plan (PostgreSQL + sqlx) — 12 tables covering accounts, necessities, todos, vendors, invoices, gallery, calendar, activities, gift registry
- `todoId` field on `CalendarEvent` type — links calendar events back to source todos
- `actionType` enum on `RecentActivity` type — 9 action categories (todo_created, vendor_added, vendor_selected, invoice_added, etc.)

### Changed (dashboard)
- "Aktivitas Terakhir" section: replaced todo-derived activity list with full action-type activity log using `mockRecentActivities`
- "Todo Terlewat" section: completely redesigned — compact card with red left-border accent, inline items with minimal padding
- "Rekomendasi Vendor Terbaik": made collapsible with hide/show toggle; cards now clickable to open quick-add modal
- Quick-add vendor modal: clicking a recommendation card opens a confirmation modal to add the vendor as a draft to the necessity
- "Before You Marry" section: replaced emoji icons with Material Symbols (diamond, description, account_balance, payments, menu_book, church, note_add)

### Fixed
- "Masih perlu dicari" and "Aktivitas Terakhir" now share matching `max-h-[420px]` with scrollable content (flex-1 overflow-y-auto)
- Added `--color-red: #DC2626` to custom theme so `bg-red`/`text-red`/`border-red` render properly
- Collapsed section buttons (Before You Marry, Todo Terlewat, Vendor Recommendations) now use solid subtle backgrounds instead of near-transparent gradients
- Vendor recommendation cards: fixed `bg-cream/50` (nearly white) → `bg-cream`; added missing `group` class so hover-reveal text works
- Timeline connector: per-item inline connectors instead of absolute positioning — no more z-index conflict

### Changed
- Warning/overdue/danger colors unified across the app: all warning indicators now use `red` (#DC2626) instead of `pink` (#FC95B4) for consistency
- Affected files: dashboard page, necessity list page, CascadeWarning modal, ConfirmDialog, TodoFormModal, ProgressBar, invoices page, admin page, login error, calendar page, vendors page

### Added (mobile)
- Mobile-responsive sidebar drawer with hamburger toggle, overlay backdrop, and close button
- Sticky mobile header bar in AppShell with hamburger menu
- All modals updated with 44px close buttons and active scale feedback
- Touch feedback (active:scale-90/95) on all interactive elements
- YouTube thumbnail extraction for Mood Board card previews

### Changed (requirement4)
- Gallery page redesigned to Mood Board — collection cards grouped by necessity, WhatsApp-style multi-image preview with "+N" overlay
- Sidebar label changed to "Mood Board" with collections icon
- Preview grid layout fixed — no empty filler cells, consistent bottom-aligned info section across all cards
- /gallery route now redirects to /mood-board
- GalleryFormModal necessity field required with disabled placeholder option
- Logout button added to sidebar (red, with "Keluar" label) and mobile header (logout icon)
- "Where to Start" guide added to sidebar — collapsible 6-step workflow overview
- Privacy policy (Kebijakan Privasi) added to login page — collapsible disclaimer about data storage with provider
- M0: Selected vendor (vendor final) system — user picks one draft vendor as final per necessity
- M0: CascadeWarning modal — explains cascade effects when selecting/deselecting final vendor
- M0: Vendor Draft renamed from "Vendor Saya" with select-to-final action
- M0: Vendor Tracker page — shows only selected vendors with task checklists + activity history
- M0: Invoice re-linked to category (necessityId) instead of vendorId
- M0: InvoiceFormModal — dropdown of categories with selected vendors
- M0: Sidebar reordered to: Dashboard, Kalender, Inspirasi, Kebutuhan, Vendor, Invoice
- M0: VendorTask/VendorActivity types and inline task toggle per necessity
- M0: WeddingInfoModal — edit bride/groom names, date, location, budget from dashboard
- M0: Finalize vendor limit system — max 3 finalizations with warning banner in CascadeWarning
- M0: Finalize button disabled state when quota exhausted
- M0: Remaining finalize quota badge in Vendor Draft header
- M0: Add vendor task UI — inline input in necessity detail and Vendor Tracker
