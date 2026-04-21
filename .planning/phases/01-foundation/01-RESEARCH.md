# Phase 1: Foundation & Auth — Research

## Implementation Approach
Fase ini berfokus pada penyusunan kerangka kerja yang *robust* dengan setup **Docker Compose** untuk database PostgreSQL lokal di arsitektur Windows. Untuk Frontend dan Backend terpadu, kita menggunakan **Next.js (App Router)** yang dibalut **Tailwind CSS v4** dan **Shadcn UI**. Sistem Autentikasi menggunakan **Auth.js / NextAuth (v5)** dalam mode state-less / JWT.

## Libraries & Tools
| Library | Purpose | Why | Confidence | Source |
|---------|---------|-----|-----------|--------|
| Next.js 15 | Meta-framework | Recommended react stack | HIGH | Official Docs |
| Prisma ORM | DB Access | Tipe aman dan mudah dikelola untuk Postgres | HIGH | Official Docs |
| Auth.js (NextAuth Beta) | Authentication | Support murni App Router Next 15 | HIGH | Official Docs |
| bcryptjs | Password Hashing | Enkripsi mandiri tanpa server luar | HIGH | npmjs |
| Shadcn UI | UI Components | Fleksibel & mendukung Dark Menu natively | HIGH | Official Docs |
| lucide-react | Icons | Clean & Minimalist, standar Shadcn | HIGH | npmjs |

## Patterns to Follow
- **Prisma Singleton Pattern**: Pada `src/lib/prisma.ts` agar *hot-reloading* Next.js tidak membuka koneksi DB berlebihan.
- **NextAuth JWT Strategy**: Menyimpan `role` ("ADMIN", "QC", "OPS", "PUBLIC") di dalam object JWT `session` agar akses rute di *Middleware* bisa divalidasi langsung tanpa query database untuk setiap navigasi halaman.
- **Docker Compose Setup**: Memisahkan service database sementara waktu di luar `create-next-app` untuk lingkungan pengembangan (local dev DB) namun siap di-*bundle* penuh di produksi.

## Pitfalls to Avoid
- **Middleware Overhead**: Jangan panggil Prisma *query* dari Next.js middleware, gunakan murni pembacaan token. *Prevention strategy: Gunakan Auth.js middleware config / export.*
- **Docker Windows Volume Speed**: Isu performa I/O di Docker Desktop Windows untuk Next.js watcher. *Prevention strategy: Hanya jalankan Postgres di Docker, jalankan node lokal via `npm run dev` pada tahap development awal.*

## Key References
- Next.js Auth.js Guide: https://authjs.dev/getting-started/installation
- Prisma Next Setup: https://www.prisma.io/nextjs

## Unverified Claims
None

---
*Researched: 2026-04-15*
