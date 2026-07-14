# Handoff: "kebutuhan" → "elemen pernikahan" Rename

## Summary

Completed a comprehensive rename of the "kebutuhan" (necessity) concept to "elemen pernikahan" (wedding element) across the entire WeddingKit codebase. The build passes cleanly (`npx next build`).

## What was done

### Type renames (`src/types/index.ts`)
- `Necessity` → `WeddingElement`
- `NecessityColor` → `WeddingElementColor`
- `necessityId` → `weddingElementId` (all interface properties)
- `necessityName` → `weddingElementName` (all interface properties)
- `selectedNecessities` → `selectedWeddingElements`

### File renames (via `git mv`)
- `src/components/NecessityCard.tsx` → `WeddingElementCard.tsx`
- `src/components/NecessityFormModal.tsx` → `WeddingElementFormModal.tsx`
- `src/data/necessityIcons.ts` → `weddingElementIcons.ts`
- `src/app/necessity/` → `src/app/wedding-elements/` (moved page.tsx + [id]/page.tsx)

### Function & variable renames
- `getNecessityIcon` → `getWeddingElementIcon`
- `getNecessityColor` → `getWeddingElementColor`
- `getNecessityById` → `getWeddingElementById`
- `mockNecessities` → `mockWeddingElements`
- `necessityColorPalette` → `weddingElementColorPalette`
- `necessityColors` → `weddingElementColors`
- `necessityIconMap` → `weddingElementIconMap`

### UI labels
- Page title, sidebar label, tab labels, tooltips, subtitles, confirm dialogs, add buttons: "Kebutuhan" → "Elemen Pernikahan" / "kebutuhan" → "elemen pernikahan"

### Route
- `/necessity` → `/wedding-elements` (all links updated in dashboard, detail pages, sidebar, etc.)

### Props
- `TodoFormModal`: prop `necessityId` → `weddingElementId`
- `VendorFormModal`: prop `necessityId` → `weddingElementId`

### Excluded from rename
- `requirement*.md`, `CHANGELOG.md` (historical docs)
- Generic Indonesian "barang-barang kebutuhan sehari-hari" in FAQ (not an app concept)

## Current state

- `git status` shows modified + renamed files staged (via `git mv`)
- Build outputs clean with no type errors or warnings
- Route `/wedding-elements` and `/wedding-elements/[id]` resolve correctly
- Old route `/necessity` folder removed

## Remaining cosmetic items (low priority, no functionality impact)

These still contain `necessity` / `nec` in local variable names or HTML `id` attributes — they don't affect the build or runtime:

- `src/app/wedding-elements/[id]/page.tsx`: local var `necessity` (the iterated WeddingElement), `necessityInvoices`, `necessityBudget`, `necessitySpent`, HTML id `necessity-detail-page`
- `src/app/wedding-elements/page.tsx`: HTML ids `necessity-page`, `necessity-header`, `necessity-header-text`, `necessity-page-title`, `necessity-page-subtitle`, `necessity-add-button`, `necessity-tabs`, `necessity-grid`
- `src/app/mood-board/page.tsx`: local var `necessity` (destructured object), `getNecessityColor` already renamed
- `src/app/vendors/page.tsx`: local var `necessity` (destructured object), `necId` params in helper fns
- `src/components/CalendarFormModal.tsx`: local state `necessityId` / `setNecessityId`, local var `necessityName`
- `src/components/GalleryFormModal.tsx`: local state `necessityId` / `setNecessityId`
- `src/app/page.tsx`: local var `necessityName` (bridging var from VendorFit result to quick-add), HTML ids `-necessity-` in activity/overdue spans
- `src/app/mood-board/[id].tsx`: local var `necessity`
- `Sidebar.tsx`: English guide text "each wedding element" (already updated)

## How to verify

```bash
npx next build
```

## Suggested skills

- `code-review` — Review the changes against this repo's coding standards before considering the rename fully closed
- `domain-modeling` — Update the project's domain glossary if one exists, to record the shift from "necessity/Kebutuhan" to "wedding element/elemen pernikahan"
- `implement` — If there are remaining tickets (e.g., clean up the cosmetic local-variable renames above), use this skill to execute them
