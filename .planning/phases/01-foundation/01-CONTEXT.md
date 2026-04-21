# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

## Phase Boundary
Menyiapkan infrastruktur dasar (Next.js), integrasi Database (PostgreSQL Server di Docker Windows), sistem registrasi/login menggunakan Username (Autentikasi), Role-Based Access Control (RBAC), serta antarmuka (UI) khusus Admin untuk manajemen akun staff.

## Implementation Decisions

### Tema Visual & Desain UI
- **DECIDED:** Aplikasi harus mendukung pilihan tata letak *Dark Mode* dan *Light Mode*.
- **SUGGESTED:** Karena Anda menyerahkan pemilihan *library* komponen terbaik, AI sangat menyarankan **Shadcn UI** dipadukan dengan **Tailwind CSS**. Ini standar emas saat ini untuk web SaaS *Enterprise*.

### Layout Manajemen User
- **DECIDED:** Menggunakan tampilan *Table List Standar* (baris dan kolom tabel biasa) untuk kelola akun oleh Admin (bukan layout *Cards*).

### AI Discretion (Area Diserahkan kepada AI)
- **Tech Stack & ORM:** Anda memilih "pilihkan yang terbaik". Pendekatan optimal adalah menggunakan **Prisma ORM** yang sangat aman bertukar data langsung dengan *Image PostgreSQL* *Local* di platform Windows Docker Anda.
- **Login & Security:** Anda memilih "pilihkan yang terbaik". Sistem akan mengadopsi **NextAuth.js (v5)** dengan strategi *JWT credentials* murni untuk Username dan Password tanpa konfigurasi *email-provider*.

## Specific Ideas
- Fokus terhadap kegunaan praktisi operasional: Harus "Simplified Power".

## Deferred Ideas
None

---
*Phase: 01-foundation*
*Context gathered: 2026-04-15*
