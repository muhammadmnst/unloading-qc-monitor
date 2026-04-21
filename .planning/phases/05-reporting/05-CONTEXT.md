# Phase 5: Reporting & Analytics - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

## Phase Boundary
Providing management-level insights into operational performance, specifically focusing on vehicle throughput and timing efficiency across different material types.

## Implementation Decisions

### Dwell Time Logic
- **DECIDED:** Separated timing metrics.
  *   **Waiting Time:** `bongkarAt` - `pendingAt`.
  *   **Unloading Time:** `completedAt` - `bongkarAt`.
  *   **Total Time:** `completedAt` - `pendingAt`.
  *Rationale:* Better granularity helps identify where bottlenecks are (e.g., waiting in queue vs. slow unloading).

### Visualization
- **DECIDED:** Summary table only.
  *Columns:* Material Type, Total Vehicles, Avg Waiting Time, Avg Unloading Time, Avg Total Time.
  *Rationale:* Keeps the interface clean and focuses on raw performance data as requested.

### Data Range
- **DECIDED:** Pilihan rentang tanggal (Date Range Picker).
  *Rationale:* Allows managers to analyze specific days, weeks, or months of operational history.

### Exporting
- **DECIDED:** Download CSV/Excel support.
  *Rationale:* Essential for offline analysis and corporate audit trail.

## Specific Ideas
- Route: `/admin/reports` (Access likely Admin only).
- Formula: Timestamps are already captured in Phase 2/3. Use them consistently.

## Deferred Ideas
- Graphics/Charts (User explicitly chose table only for now).

---
*Phase: 05-reporting*
*Context gathered: 2026-04-15*
