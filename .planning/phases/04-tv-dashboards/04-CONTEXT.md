# Phase 4: Public TV Dashboards - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

## Phase Boundary
Creating public-facing, "lean-back" dashboard views optimized for screen displays (Smart TVs). These views do not require authentication and focus on high-visibility operational status.

## Implementation Decisions

### Visual Aesthetic
- **DECIDED:** Support both Dark and Light modes.
  *Rationale:* User wants options; likely via a URL parameter (e.g., `?theme=dark`) for easy setup on TV browsers.

### Rotation Mechanism
- **DECIDED:** Manual per-material static views.
  *Rationale:* TVs will be dedicated to a single material or switched manually; no automatic material cycling.

### Data Density
- **DECIDED:** Standard density.
  *Rationale:* Prioritizes showing more data over absolute distance legibility, allowing for more comprehensive monitoring per screen.

### Public Access Security
- **DECIDED:** Completely open URLs.
  *Rationale:* Ease of setup for canteen/office/PMKS displays where authentication is a friction point.

## Specific Ideas
- URL structure likely `/tv/cpo`, `/tv/pk`, `/tv/cangkang`.

## Deferred Ideas
- Auto-pagination (R13) might still apply to multi-page lists within a single material, but material-level rotation is removed.

---
*Phase: 04-tv-dashboards*
*Context gathered: 2026-04-15*
