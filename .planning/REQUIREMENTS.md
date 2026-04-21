# Requirements

## Overview
Dokumen ini mendefinisikan persyaratan teknis dan fungsional dari aplikasi **Unloading QC Monitor**, mencakup fitur-fitur wajib (*Must-Have*) untuk meluncurkan rilis pertama (v1), serta metrik kualitas yang dirancang khusus untuk operasional CPO, PK, dan Cangkang kelapa sawit.

## V1 — Must Have
Fitur esensial agar aplikasi lapangan dapat digunakan dan metrik utama dapat terukur.

| ID | Requirement | Phase | Status |
|----|-------------|-------|--------|
| R1 | Autentikasi Pengguna menggunakan Username dan Password. | TBD | Planned |
| R2 | Manajemen akun (CRUD pengguna) khusus untuk Role Admin. | TBD | Planned |
| R3 | RBAC: Pembatasan rute untuk Admin (Full), QC (Entry/Delete/Bongkar), dan Ops (Complete). | TBD | Planned |
| R4 | Form Input Kendaraan Baru dengan pilihan tipe material CPO, PK, atau Cangkang. | TBD | Planned |
| R5 | Dashboard CPO dengan metrik No Polisi, PMKS, Persen FFA (%), Persen Moisture (%), Status, Tanggal & Jam (dari waktu save form). | TBD | Planned |
| R6 | Dashboard PK dengan metrik No Polisi, PMKS, Persen KA (%), Persen KK (%), Persen Stone (%), Status, Tanggal & Jam (dari waktu save form). | TBD | Planned |
| R7 | Dashboard Cangkang dengan metrik No Polisi, PMKS, Persen KA (%), Persen KK (%), Persen Stone (%), Status, Tanggal & Jam (dari waktu save form). | TBD | Planned |
| R8 | Alur Status Kendaraan: *Pending*, lalu bisa menjadi *Bongkar* atau *Cancel*, setelah Bongkar lanjut ke *Completed*. | TBD | Planned |
| R9 | Filter & Urutan otomatis: *Pending* berada di bawah, *Completed* otomatis tersembunyi. | TBD | Planned |
| R10 | Tangkapan Waktu Aktual (*Timestamp Capture*) pada setiap pergantian status kendaraan. | TBD | Planned |
| R11 | Menu Report (Laporan): Total kendaraan, rentang waktu per kendaraan, rata-rata waktu. | TBD | Planned |
| R12 | Rute "TV Dashboard Publik" (CPO, PK, Cangkang) untuk diakses via Smart TV tanpa API Auth. | TBD | Planned |
| R13 | *Auto-Pagination Timer* bawaan pada TV Dashboard untuk transisi halaman secara otomatis. | TBD | Planned |

## V2 — Nice to Have
Differentiator tambahan dan pengayaan fungsi setelah sistem utama stabil di lapangan.

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| R14 | Real-time Updates via WebSockets agar TV atau web me-refresh instan saat ada perubahan. | High | Backlog |
| R15 | Alarm/Indikator warna jika *Dwell Time* bongkar melewati batas maksimal. | Medium | Backlog |
| R16 | Integrasi data langsung dengan alat sensor Timbangan agar tidak perlu ketik manual PMKS. | Low | Backlog |

## Out of Scope
- Native Mobile/Android App — Rilis V1 difokuskan sepenuhnya berbasis Web App yang *mobile-responsive* agar kompatibel di semua *device*.

---
*Last updated: 2026-04-15*
