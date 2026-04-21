# GSD Project Memory

*This file tracks long-term architectural decisions, pivots, and core principles across all project phases.*

## Date: 2026-04-15
**Phase 1 — Foundation & Auth Initialization**

### Key Principles & Decisions:
- **Simplicity over Complexity for End Users:** Field staff will login using simple Usernames instead of Emails, minimizing friction in operational environments.
- **Decoupled Public Dashboards:** The public TV routing (`/tv`) is fundamentally isolated from the main authentication middleware, allowing TV screens to run independently and endlessly via auto-pagination without requiring an authenticated session.
- **Immutable Logistical State:** The status flow explicitly moves straight from Pending -> Bongkar/Cancel -> Completed. This preserves all logistical bottleneck data forever for reporting purposes without deleting records.
- **On-Premise Resilience:** Next.js UI is coupled with a local Docker-hosted PostgreSQL image running natively on Windows infrastructure, designed around local internal network reliability priorities. 
- **Tooling Standards:** Adopting `Shadcn UI` for unified design components, `Prisma ORM` for secure query abstractions, and `NextAuth.js` with `bcryptjs` representing the industry-standard stateless authentication path for enterprise platforms.

## Date: 2026-04-15
**Phases 2-5 — Milestone 1 MVP Completion**

### Key Principles & Decisions:
- **Tab-Based Operational Context**: Implemented material-specific tabs (CPO, PK, Cangkang) within the shared Dashboard group to provide zero-latency context switching for operators.
- **Zero-Touch TV Strategy**: Implemented "Auto-Pagination timers" on public screens, ensuring that static displays rotate through all pending trucks without human oversight—crucial for warehouse visibility.
- **Pure Timestamp Analytics**: Calculated operational efficiencies (Waiting, Unloading, Total Cycle) on-the-fly from transition timestamps, ensuring a "single source of truth" for audit logs rather than relying on calculated status counters.
- **Role-Aware Portal Navigation**: Replaced the landing page with an adaptive "Task Portal" that filters visible tools by user role (QC, Ops, Admin), reducing noise for field workers.
- **Lightweight Audit Exports**: Used browser-side data-URI generation for CSV reporting, removing the need for server-side file management or ephemeral storage on the host machine.
- **Shared Navigation Componentry**: Centralized role-based links into a single `Navbar` component, decoupled from page content to maintain global consistency.

## Date: 2026-04-15
**Milestone 1 Final Refinements & Bug Squashing**

### Key Principles & Decisions:
- **Consistent URL Guarding:** Learned that for role-gated middleware, explicit folder names (`admin/`) are superior to Route Groups (`(admin)/`) whenever the URL path segments are used for security filtering. Parentheses hide segments from the URL and should only be used for layout grouping, not path-based logic.
- **Next.js Serialization Guard:** Discovered that passing formatting functions from Server to Client components breaks the serialization contract. Resolved by implementing a `dataType` descriptor pattern where Client components handle the formatting logic internally based on simple strings.
- **Aggressive Legacy Clean-up:** Encountered "Parallel Page" build errors caused by leftover boilerplate (`/login` vs `/(auth)/login`). Resolution confirmed that Next.js App Router is brittle to redundant route definitions; legacy folders must be purged immediately during architectural shifts.
- **Cinematic Branding for Adoption:** High-resolution factory imagery and official branding (KPN CORP) were prioritized to increase user "buy-in"—a crucial factor for internal enterprise tools to feel like "Official Tools of Record" rather than side projects.

## Date: 2026-04-18
**Executive Summary & Real-Time Macro Observability**

### Key Principles & Decisions:
- **Macro vs. Micro Decoupling:** Separated the monolithic operational dashboard into two distinct streams. The *Executive Summary* acts as a high-level, macro diagnostic tool for leadership (10,000-ft view of bottlenecks and trends), while *Monitoring* tabs remain micro-focused for immediate state actions by floor supervisors.
- **Asymmetric Grid Proportions:** Restructured dashboard analytics using asymmetric CSS grids to visually prioritize horizontal space (2/3 width) for historical trend lines, while condensing compositional pie charts into minimal vertical segments (1/3 width).
- **SLA Breach Visual Alarming:** Implemented strict 3-hour bottleneck threshold warning cards with CSS animations, shifting the dashboard paradigm from passive viewing to active anomaly alerting.
- **Unified Daily Time Framing (Gotcha):** Filter parameters based merely on "registration date" (`pendingAt`) inherently corrupt daily completion tallies if processing spans multiple days. Resolved by unifying queries with `OR: [{ pendingAt }, { completedAt }, { status }]` parameters to ensure daily accuracy across all multi-stage vehicle lifecycles.

## Date: 2026-04-20
**Phase 5 — Analytics Extension & Security Hardening**

### Key Principles & Decisions:
- **Granular Button-Level RBAC**: Transitioned from coarse page-level access to granular action gating within shared components. Operational staff can monitor all vehicles but only trigger the `Selesai` (Unloading Complete) action, while QC staff are restricted to starting (`Bongkar`) or canceling transactions. This eliminates role overlap during critical physical state transitions.
- **Democratized Analytics Access**: Moved advanced reporting from the protected `/admin` namespace to a shared `/reports` route accessible by QC and Operational roles. This promotes transparency and allows supervisors to analyze their own team's productivity (Operator Performance) and quality trends without requiring full administrative system access.
- **LAN Authentication Resilience (Gotcha)**: Standard NextAuth/Auth.js configurations failure-modes are silent when accessed via IP over a LAN on HTTP. Resolved by explicitly setting `trustHost: true` in the core config, adding the server IP to `allowedDevOrigins` in `next.config.ts`, and forcing `cookies: { secure: false }` to prevent session-token rejection by browser security policies.
- **Next.js 16 Breaking Conventions (Gotcha)**: The `middleware.ts` naming convention is deprecated in favor of `proxy.ts` in Next.js 16. Detection of both files simultaneously causes an immediate "Unhandled Rejection" crash. Future-proofing requires immediate migration and absolute deletion of the legacy middleware file to maintain environment stability.

## Date: 2026-04-21
**Phase 5 — SLA Refinement & UX Polish**

### Key Principles & Decisions:
- **Calibrated Operational Benchmarks**: Adjusted the SLA breach threshold from 3 to 5 hours. This shift reflects a move from "theoretical" targets to "empirical" benchmarks based on actual field performance data gathered during initial use, reducing "alarm fatigue" for supervisors.
- **KPI Streamlining & Layout Consolidation**: Removed the "Outspec / Reject Rate" card and consolidated the top-level KPIs into a 5-column grid. This prioritization focuses leadership on core turnaround times and active bottlenecks.
- **Time Metric Scaling (Minutes to Hours)**: Transitioned "Avg Resolution" and "Avg Unloading" units from minutes to hours. On a macro-level executive dashboard, sub-hour granularity was found to be noise; hour-based decimals (e.g., 1.5h) provide better contextual clarity for management.
- **Minimalist Analytical UI**: Purged all remaining descriptive subtext across the dashboard. The interface now follows a "Data-Only" philosophy, assuming user proficiency and maximizing vertical scanning speed.
- **Dynamic Host Detection Persistence (Lesson)**: Confirmed that removing hardcoded `AUTH_URL` and relying on `AUTH_TRUST_HOST=true` allows seamless switching between `localhost` and LAN IP access, which is crucial for hybrid dev/test environments.

