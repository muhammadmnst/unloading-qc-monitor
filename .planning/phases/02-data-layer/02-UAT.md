# Phase 2: Data Layer & Input Forms — User Acceptance Testing

**Started:** 2026-04-15
**Status:** complete
**Updated:** 2026-04-15

## Results

| # | Test | Result | Details |
|---|------|--------|---------|
| 1 | Conditional Form Display | ✗ Issue | buatkan 3 halaman register berbeda, CPO, PK dan cangkang |
| 2 | Raw Text Input | ✓ Pass | User confirmed |
| 3 | Form Submission Validation | ✗ Issue | tidak perlu ada kata It is now PENDING in the dashboard |

## Summary

- **Total:** 3
- **Passed:** 1
- **Issues:** 2
- **Skipped:** 0

## Gaps

- **Test 1: Conditional Form Display**
  - Expected: When opening the `/register` page (logged in as QC), the Material Type dropdown will default to `CPO`, changing it should correctly toggle the metrics.
  - Reported: buatkan 3 halaman register berbeda, CPO, PK dan cangkang
  - Severity: major

- **Test 3: Form Submission Validation**
  - Expected: Regardless of layout, after filling in the required fields and clicking "Register Vehicle", the application should successfully save the data to the database and display a green success message: "Vehicle registered successfully. It is now PENDING in the dashboard."
  - Reported: tidak perlu ada kata It is now PENDING in the dashboard
  - Severity: cosmetic

---
*Tested: 2026-04-15*
