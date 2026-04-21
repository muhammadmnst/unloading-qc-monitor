# Roadmap

## Milestone 1: MVP Release (Unloading QC Monitor V1)

### Progress

| Phase | Name | Status | Plans | Date |
|-------|------|--------|-------|------|
| 1 | Foundation & Auth | Complete | `[01-01 ... 01-04]` | 2026-04-15 |
| 2 | Data Layer & Input Forms | Complete | `[02-01 ... 02-02]` | 2026-04-15 |
| 3 | Operational Dashboards | Complete | `[03-01 ... 03-03]` | 2026-04-15 |
| 4 | Public TV Dashboards | Complete | `[04-01 ... 04-03]` | 2026-04-15 |
| 5 | Reporting & Analytics | Complete | `[05-01 ... 05-03]` | 2026-04-15 |

### Phases

#### Phase 1: Foundation & Auth
**Goal:** Menyiapkan infrastruktur dasar, autentikasi, dan pengaturan akses keamanan.
**Requirements:** [R1, R2, R3]
- [x] Inisialisasi Project (Next.js, Tailwind, Database/Supabase)
- [x] Setup Autentikasi (Fitur Login Username & Password)
- [x] Implementasi Role-Based Access Control (RBAC) untuk rute Admin, QC, dan Ops
- [x] Membuat Layar Tampilan (UI) User Management khusus untuk Admin

#### Phase 2: Data Layer & Input Forms
**Goal:** Membangun *schema* database logistik dan form entri kendaraan untuk QC.
**Requirements:** [R4, R8, R10]
- [x] Desain skema tabel database utama untuk (CPO, PK, Cangkang)
- [x] Implementasi fungsi untuk tangkapan *Timestamp Aktual* secara otomatis
- [x] UI Form Input Kendaraan Baru dengan dropdown untuk CPO/PK/Cangkang (Akses QC)
- [x] Logika backend untuk memproses status "Pending" atau "Cancel" di awal form masuk.

#### Phase 3: Operational Dashboards
**Goal:** Membangun dashboard tabel operasional dengan metrik masing-masing bahan beserta transisi statusnya mutlak.
**Requirements:** [R5, R6, R7, R8, R9]
- [x] Membuat Tabel UI Dashboard CPO (Persen FFA, Persen Moisture)
- [x] Membuat Tabel UI Dashboard PK (Persen KA, Persen KK, Persen Stone)
- [x] Membuat Tabel UI Dashboard Cangkang (Persen KA, Persen KK, Persen Stone)
- [x] Membuat logika penyusunan (Sort/Filter) tabel di mana "Pending" ditaruh paling bawah
- [x] Logika aksi perpindahan status: Pending -> Bongkar (Akses QC) -> Completed (Akses Ops)
- [x] Fungsi Auto-Hide untuk kendaraan dengan status "Completed".

#### Phase 4: Public TV Dashboards
**Goal:** Membuat tampilan khusus "Lean-back" yang optimal untuk Smart TV tanpa memerlukan login.
**Requirements:** [R12, R13]
- [x] Mendesain layout tampilan publik yang berukuran besar untuk kemudahan visibilitas dari jarak jauh.
- [x] Mengimplementasikan *Auto-Pagination Timer* (`setInterval`)
- [x] Menyiapkan 3 rute API terpisah untuk masing-masing Dashboard Material (CPO, PK, Cangkang).

#### Phase 5: Reporting & Analytics
**Goal:** Menyediakan *birds-eye-view* tentang efisiensi operasional harian.
**Requirements:** [R11]
- [x] Membuat *Queries* kalkulasi untuk menghitung *Dwell Time* per kendaraan.
- [x] Membuat Tabel / Grafik total kalkulasi kendaraan per hari
- [x] Mengkalkulasi nilai rata-rata keseluruhan waktu bongkar untuk pelaporan Admin.

---
*Last updated: 2026-04-15*
