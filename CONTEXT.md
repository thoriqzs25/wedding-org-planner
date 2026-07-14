# WeddingKit (Wedding Organizer Planner)

A shared planning workspace for an engaged couple to organise their wedding — tracking elements, vendors, budget, tasks, schedule, inspiration, and payments before the wedding day.

## Language

### Wedding Elements

**Elemen Pernikahan** (Wedding Element):
A distinct category of goods or services required for the wedding. Examples: Venue, Catering, Dekorasi, Dokumentasi.
_Avoid_: Kebutuhan, Necessity, Category

**Core Element**:
A wedding element that is pre-selected for every couple by default (e.g., Venue, Catering, Dokumentasi, Musik, Dekorasi, Wedding Organizer). Couples may opt out during registration.
_Avoid_: Default element, isDefault

**Optional Element**:
A wedding element the couple can choose to add during registration (e.g., Prewedding, Photo Booth, Souvenir, MC, Live Streaming). Not pre-selected.

### The Couple

**Couple** (Pasangan):
The two people getting married, represented collectively. The unit that owns the wedding plan.
_Avoid_: User, Account (when referring to the couple), Bride & Groom (when referring collectively)

**Bride** and **Groom**:
The two individuals within a Couple. Tasks can be assigned to either person (via `pic`). The app greets both by name.

### Vendors

**Vendor**:
A service provider or merchant being considered for or contracted by a Wedding Element. A Vendor belongs to exactly one Wedding Element.

**Vendor Draft**:
A Vendor that the couple has added but not yet confirmed. The couple may have multiple Drafts per Wedding Element.

**Finalized Vendor**:
A Vendor that the couple has confirmed and selected for a Wedding Element. Only one Vendor per Wedding Element can be Finalized. Finalization is tracked by `selectedVendorId` on the Wedding Element — the Vendor entity itself does not carry lifecycle state.
_Avoid_: Selected Vendor, Picked Vendor, Final Vendor

**Vendor Recommendation**:
A system-suggested Vendor (not added by the couple) scored by `fitScore` based on budget ratio and guest count. Recommendations appear in the dashboard and per-element detail page.
_Avoid_: Recommended Vendor (when referring to the `isRecommended` field — that field specifically means "system-suggested" vs "user-added")

**Vendor Task**:
An action item assigned to a Finalized Vendor (e.g., "Kirim DP 50%", "Finalisasi konsep warna"). Not to be confused with a Todo, which is a general planning task.
_Avoid_: Task (when ambiguous with Todo)

**Vendor Activity**:
An audit-log entry recording a state change on a Finalized Vendor (e.g., "Dipilih sebagai vendor final", "Invoice DP ditambahkan").

### Budget & Payments

**Total Budget**:
The overall budget the couple enters during registration. A single number covering all Wedding Elements. Not yet allocatable per element.

**Budget Tier**:
A rough budget-range classification collected during registration for informational display and initial vendor recommendation scoring. Not used to enforce or adjust behavior after onboarding.
_Avoid_: Budget class, budget level

**Invoice**:
A record of a payment made to a vendor. Tracks amount, vendor, date, and notes. Currently a flat one-time amount — does not support installment schedules, DP, or pelunasan tracking.

### Planning

**Todo**:
A general planning task belonging to a Wedding Element. Has a status (`pending`, `in_progress`, `done`), a person-in-charge (`pic`), a due date, an optional description and link.
_Avoid_: Task, checklist item (when the distinction from Vendor Task matters)

**Calendar Event**:
A scheduled date-and-time entry on the planning calendar. Optionally linked to a Todo. Belongs to a Wedding Element.

**Activity** (RecentActivity):
A timestamped, typed log entry recording an action the couple took (e.g., creating a todo, completing a todo, adding a vendor, selecting a vendor). Displayed on the dashboard as an activity feed.
_Avoid_: History, log, audit trail

### Inspiration

**Gallery Item**:
An inspiration reference (image, YouTube, TikTok, or other link) attached to a Wedding Element for the mood board.
_Avoid_: Mood board item, inspiration

### Not Yet Modeled

The following concepts are referenced in the UI but have no corresponding domain entity:

**Guest**:
A person invited to the wedding. Guest count is tracked but no guest list, RSVP, dietary preference, or seating assignment exists.

**Wedding Day Timeline**:
The sequence of events on the wedding day itself (akad, resepsi, etc.). Referenced indirectly by the "rundown" concept but not modeled.

**Budget Allocation**:
A per-element budget target. The current model has only a single Total Budget — no way to allocate "Venue max Rp150jt, Catering max Rp100jt" and compare against per-element spend.

**Document** (Contract / MOU):
Vendor contracts, KUA registration documents, and other paperwork. Referenced in the "Before You Marry" widget but not storable or trackable.

## Unresolved Domain Questions

- **Max 3 Finalized limit**: The UI enforces a hardcoded `maxFinalizes = 3` per couple. No domain rationale exists — is this a free-tier restriction, a recommendation, or a real constraint? Unresolved.
- **Vendor Lifecycle**: A Vendor transitions from Draft → Finalized → (possibly) replaced, but the domain model has no explicit state machine. `selectedVendorId` on WeddingElement is a proxy for finalization; there's no `status` on Vendor itself.
- **Budget Tier usage**: Collected but never consumed by any domain logic beyond initial recommendation scores. If unused long-term, consider removing.
