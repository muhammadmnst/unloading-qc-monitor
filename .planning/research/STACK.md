# Stack Research: Modern QC Field & TV Dashboard (2025/2026)

## 1. Frontend & Visualization
- **Framework Options**: Next.js (React) is the industry standard for scalable dashboards and TV displays. 
- **TV Considerations**: React with `framer-motion` or CSS transitions for smooth auto-pagination. Libraries like SwiperJS if swipe/gesture support is needed, or simple `setInterval` hooks for "lean-back" TV experiences.
- **Styling**: Tailwind CSS v4 for rapid, responsive UI creation.
- **Confidence**: **HIGH** (verified via current industry web architecture standards)

## 2. Backend & Data Layer
- **Core Database**: PostgreSQL is the gold standard for relational logistics data.
- **Real-time Sync**: Supabase (PostgreSQL + Realtime WebSockets) or Firebase. Crucial for updating the TV dashboard instantly without manual reloads when QC updates status.
- **API Architecture**: Next.js Server Actions or standard REST API endpoints for data mutation.
- **Confidence**: **HIGH** (verified via current industry web architecture standards)

## 3. Recommended Stack (The Verdict)
- **Framework**: Next.js (App Router)
- **Database & Auth**: Supabase (Offers built-in RBAC, Realtime subscriptions, and Postgres)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel or Self-hosted Node.js (if restricted to Intranet)
