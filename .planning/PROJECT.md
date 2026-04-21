# Unloading QC Monitor

## Vision
Membuat sistem web "Simplified Power" yang sangat mudah digunakan di lapangan (*field-friendly*) untuk proses unloading CPO, PK, dan Cangkang, namun tetap mengumpulkan data *compliance* yang kuat di baliknya.

## Core Value
Visibilitas *real-time* dan pelacakan status bongkar kendaraan untuk CPO, PK, dan Cangkang. Memastikan transisi alur kerja yang mulus dari kedatangan di post QC hingga selesai (*completed*) oleh tim Operasional lapangan.

## Target Users
1. **Admin**: Memiliki akses penuh ke semua fitur, termasuk membuat dan mengatur akun pengguna (User Management).
2. **QC (Quality Control)**: Fokus pada *entry data* awal. Dapat menambah kendaraan baru yang akan bongkar dan menghapusnya jika ada kesalahan.
3. **Operational**: Fokus pada penyelesaian tugas. Hanya dapat mengubah status menjadi "Completed".
4. **Viewer (TV Dashboard)**: Tampilan publik (tanpa login) dengan auto-pagination yang menampilkan status kendaraan secara *real-time* untuk tiap area bongkar.

## Technical Context
- **Stack Preferensi**: Modern dan *scalable* (mis. Next.js, React, Tailwind CSS).
- **Infrastruktur / Deployment**: Dirancang arsitektur Docker On-Premise untuk berjalan di atas OS Windows dengan Database Lokal (contoh: PostgreSQL Image).
- **Autentikasi**: Memakai kombinasi Username dan Password.
- **Role-Based Access Control (RBAC)**: Pembatasan rute dan aksi API sesuai dengan kategori pengguna (Admin, QC, Operational, dan Public).

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] Autentikasi Pengguna menggunakan Username dan Password.
- [ ] Manajemen Pengguna (CRUD akun) khusus untuk Admin.
- [ ] Dashboard Unloading CPO dengan metrik No Polisi, PMKS, Persen FFA (%), Persen Moisture (%).
- [ ] Dashboard Unloading PK dengan metrik No Polisi, PMKS, Persen KA (%), Persen KK (%), Persen Stone (%).
- [ ] Dashboard Unloading Cangkang dengan metrik No Polisi, PMKS, Persen KA (%), Persen KK (%), Persen Stone (%).
- [ ] Alur Status Kendaraan: *Pending* (bawah) -> *Bongkar*/*cancel* -> *Completed* (hilang dari list).
- [ ] Form Input (Menu Konfig) oleh staff QC untuk mendaftarkan kendaraan masuk ke salah satu dari 3 kategori (CPO/PK/Cangkang).
- [ ] Menu Report: Kalkulasi jumlah total kendaraan, *Lead Time* (waktu dari status Bongkar ke Completed) per kendaraan, dan rata-rata waktu bongkar semua kendaraan.
- [ ] Public TV Route: Endpoint terpisah dan memiliki url sendiri untuk CPO, PK, dan Cangkang, dapat diakses publik dengan sistem *auto-pagination* per halaman agar layar bergilir otomatis.

### Out of Scope
- [Mobile App Native] — Pengembangan difokuskan pada Web/Mobile web responsif terlebih dahulu agar lebih cepat didistribusikan.

## Key Decisions

| Decision | Source | Rationale | Outcome |
|----------|--------|-----------|---------|
| Login menggunakan Username | User | Memudahkan Field Staff dibanding email | Decided |
| Link TV dipisah per material (Public) | User | Memungkinkan tiap area bongkar memakai layar TV sendiri tanpa perlu login ribet | Decided |
| Default status flow: Pending -> Bongkar/Cancel -> Completed | User | Melacak *bottleneck* secara akurat dengan menyimpan data selamanya (untuk Report) | Decided |
| Hosting Docker API Windows & Database Lokal | User | Menyesuaikan *policy* limitasi jaringan atau operasional internal infrastruktur | Decided |

---
*Last updated: 2026-04-15 after initialization*
