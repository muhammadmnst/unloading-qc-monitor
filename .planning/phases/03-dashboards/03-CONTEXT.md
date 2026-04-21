# Phase 3: Operational Dashboards - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

## Phase Boundary
This phase introduces the primary operational viewing dashboards for tracking currently pending and unloading vehicles, separated by material. It includes mechanisms for field staff to advance vehicle statuses from Pending, to Bongkar, to Cancel or Completed.

## Implementation Decisions

### Layout Architecture
- **DECIDED:** Separate dashboard pages per material.
  *Rationale:* Maintains consistency with the phase 2 registration split; users deal with explicit URLs (e.g. `/dashboard/cpo`).

### Action Mechanisms
- **DECIDED:** Dedicated action buttons.
  *Rationale:* One-click "Mulai Bongkar", "Cancel", and "Completed" buttons on the rows are faster and more field-friendly than dropdowns or restrictive modals.

### Data Refreshing
- **DECIDED:** Auto-polling.
  *Rationale:* Dashboards will use simple client-side auto-polling (e.g., pulling data every 5 seconds) to maintain a near real-time state until actual WebSockets are introduced in V2.

### Completed Logs View
- **DECIDED:** Hide by default with a "Show History/Completed" toggle button.
- **DECIDED (UAT Change):** Limit to 20 items initially with "Show More" pagination.
  *Rationale:* Prevents the page from becoming too long in active environments while still allowing access to older logs.

## Specific Ideas
None gathered yet.

## Deferred Ideas
None.

---
*Phase: 03-dashboards*
*Context gathered: 2026-04-15*
