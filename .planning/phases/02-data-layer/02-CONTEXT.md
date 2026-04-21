# Phase 2: Data Layer & Input Forms - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

## Phase Boundary
This phase focuses on creating the database schema to store logistics and QC metrics for incoming materials, along with the user interface form used by the QC staff to register new vehicles and capture initial metrics.

## Implementation Decisions

### Database Schema Design
- **DECIDED (AI Discretion):** Single unified `VehicleLog` table.
  *Rationale:* Using one table with a `materialType` ENUM (CPO, PK, CANGKANG) and nullable specific fields (e.g., `ffa`, `moisture`) simplifies queries for the public dashboards and overall lead-time analytics.

### Form UI Layout
- **DECIDED (UAT Change):** 3 separate register pages.
  *Rationale:* User explicitly requested `buatkan 3 halaman register berbeda, CPO, PK dan cangkang`. This avoids one monolithic dropdown form.

### Cancellation Handling
- **DECIDED (AI Discretion):** Simple status toggle with optional remarks.
  *Rationale:* Avoids blocking the fast-paced field workflow with mandatory text fields, but provides an open `remarks` field if they choose to log why it was cancelled.

### License Plate (No Polisi) Input
- **DECIDED:** Raw text input.
  *Rationale:* Avoiding strict regex validation prevents unexpected errors in the field where license plate formats might slightly vary. 

## Specific Ideas
None gathered yet.

## Deferred Ideas
None.

---
*Phase: 02-data-layer*
*Context gathered: 2026-04-15*
