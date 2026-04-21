# Architecture Research: Unloading Monitoring System

## Data Flow & State Management
1. **Event-Driven UI**: 
   - When a QC officer inputs data via a Next.js Server Action, the database row is updated.
   - The database emits a trigger (e.g. Supabase Realtime).
   - The TV Dashboard component listens to this channel and automatically re-fetches or mutates the local state, avoiding hard reloads.

## TV Dashboard Specifics
- **"Lean-Back" Experience**: No complex interaction logic. Just a `setInterval` component that scrolls or pages through standard 20-30 row chunks.
- **Hardware Profile**: Ensure DOM size remains small. Use standard pagination instead of infinite scroll mounting to prevent memory leaks on low-powered Smart TVs.

## Confidence
- **HIGH** (verified via standard React TV and Yard Management System architectural patterns).
