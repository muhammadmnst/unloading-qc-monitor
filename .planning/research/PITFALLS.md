# Pitfalls Research: Field QC & TV Dashboards

## 1. TV Device Hardware Bottlenecks
- **The Pitfall**: Heavy animation or large DOM nodes (rendering 500 rows at once) will crash low-spec Smart TV browsers.
- **The Fix**: Strict pagination (e.g. 15 items per page) and clean cleanup of `intervals` in React `useEffect` to prevent memory leaks.

## 2. 'Abandoned' Vehicles in the System
- **The Pitfall**: QC enters a truck but the truck leaves without unloading, causing it to sit in "Pending" forever, messing up reports.
- **The Fix**: Implement a mechanism for Admin/QC to 'Cancel' or 'Delete' stale entries. (Already requested by User).

## 3. Disconnected Data Ownership (Dwell Time)
- **The Pitfall**: Failing to capture exact timestamps at every status change leads to "blame games" between Transporters and Warehouse.
- **The Fix**: Backend must strictly enforce auto-stamping `timestamp_pending`, `timestamp_bongkar`, and `timestamp_completed`.

## Confidence
- **HIGH** (verified via common yard management failure studies).
