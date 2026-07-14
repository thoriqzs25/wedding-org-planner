# Refactor: Re-layout todo list on wedding element pages

## Problem Statement

The todo list on the wedding element pages currently lacks visual polish:
- Todo items have inconsistent auto heights, making the list look messy
- Colors/contrast are too subtle — text, borders, and status badges blend into the background
- The status toggle button (cycling through states) is unintuitive; users have to click multiple times to reach the desired status
- Entire row is a link with no explicit navigation control, making it hard to distinguish between interaction targets

## Solution

Re-layout the todo list on both the wedding elements list page ("All Todos" tab) and the detail page (To-Do List section) with:
- Uniform fixed row height (h-18 / 72px) for a clean, consistent appearance
- Replace the status cycling button with a dropdown select for explicit status selection
- Replace the full-row link with an explicit "Lihat Detail" link
- Increase contrast across text, borders, and status colors for better readability
- Apply changes to both the list page and detail page todo lists

## Commits

### Commit 1: Extract shared status config constants
Move the duplicated `statusConfig` object from both page files into a shared constants file (`src/constants/todo.ts`). Also extract the `nextStatus` mapping and status order there. This removes duplication and makes future changes consistent.

### Commit 2: Extract shared todo utility helpers
Move `cycleStatus` helper and the status-ordering logic into the shared constants/utilities file. The list page and detail page both need to cycle statuses — they should use the same function signature.

### Commit 3: Create a shared TodoItem component for the list page
Extract the inline todo item rendering from the list page's `sortedTodos.map()` into a reusable `TodoItemRow` component. This component should accept props for the todo data, the parent wedding element info, and the onStatusChange callback.

### Commit 4: Replace status cycling button with dropdown on the list page
Within the new `TodoItemRow` component, replace the circular status-cycling button with a themed `<select>` dropdown that lists all three statuses (Pending, Diproses, Selesai). Changing the dropdown triggers the status update immediately.

### Commit 5: Set fixed row height and refine list page todos layout
Apply `h-18` fixed height to each todo row. Adjust the internal flex layout so content is vertically centered. Add overflow-hidden and text truncation (line-clamp) for long titles. Remove the `<Link>` wrapping the entire row; add a small "Lihat Detail" link/button.

### Commit 6: Apply contrast improvements on the list page
Increase text opacity for titles and meta text. Make borders thicker/more visible (e.g., `border-gold/40` instead of `/10`). Vividify the status badge colors and the overdue red treatment. Add a subtle shadow or border-left accent for visual separation.

### Commit 7: Replace status cycling button with dropdown on the detail page
On the wedding element detail page, replace the status icon button (that cycles status) with the same dropdown select pattern used on the list page. Use the shared `statusConfig`.

### Commit 8: Set fixed row height and refine detail page todos layout
Apply `h-18` fixed height to each todo item on the detail page. Center content vertically, truncate overflow. Ensure consistency with the list page layout.

### Commit 9: Apply contrast improvements on the detail page
Match the contrast upgrades from the list page: stronger borders, richer text colors, more vivid status badges, clearer overdue indicators.

## Decision Document

- **Modules modified:**
  - `src/app/wedding-elements/page.tsx` — list page todo tab
  - `src/app/wedding-elements/[id]/page.tsx` — detail page todo section
  - `src/constants/todo.ts` (new) — shared status config, mappings, helper functions
- **New components:**
  - A shared `TodoItemRow` component in `src/components/` for the list page todo items
- **Status interaction:** Dropdown select replaces the current cycling button on both pages. Changing the dropdown immediately updates the status.
- **Navigation:** Full-row link is removed. An explicit "Lihat Detail" button/link is added.
- **Row height:** Fixed at 72px (h-18) with vertical centering and overflow truncation.
- **Contrast palette:** Use existing theme colors (orange, gold, pink, green, red, cream) but at higher opacities (e.g., /40 instead of /10, /60 instead of /30) for borders and backgrounds. Text uses `text-amber-900` instead of `/60`.
- **Overdue treatment:** Red background tint kept, plus stronger red text and border.

## Testing Decisions

There are currently zero tests in this project and no test framework installed. This refactor is purely a UI/layout change. If testing is desired later, visual regression tests (e.g., Playwright snapshot tests) would be the most appropriate approach for verifying layout changes. Unit tests could be written for the extracted helper functions (status cycling, date calculations) if a test framework is added.

## Out of Scope

- Adding a test framework or writing tests
- Changing the todo data model or types
- Changing the TodoFormModal component
- Changes to vendor sections or other non-todo parts of the pages
- Adding new features like drag-and-drop reordering, batch actions, filtering, or search
- The wedding element grid/cards on the list page's first tab

## Further Notes

The detail page currently uses a different status icon approach (`radio_button_unchecked`, `progress_activity`, `check_circle`) compared to the list page's circular button. Both will be unified under the dropdown pattern.
