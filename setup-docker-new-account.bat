@echo off
SETLOCAL EnableDelayedExpansion
echo ==========================================
echo    DOCKER DATABASE SETUP - NEW ACCOUNT
echo ==========================================
echo.

:: 1. Check if Docker is in PATH
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] ERROR: Docker tidak ditemukan di PATH.
    echo Pastikan Docker Desktop sudah terinstal dan berjalan.
    echo Kemungkinan Docker Desktop belum diluncurkan di akun ini.
    pause
    exit /b 1
)

:: 2. Check if Docker is reachable
echo [1/3] Memeriksa koneksi ke Docker Engine...

:: Show current context for diagnostics
docker context ls

docker ps
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] ERROR: Tidak bisa terhubung ke Docker Engine via context saat ini.
    echo [!] Mencoba beralih ke context 'default'...
    docker context use default
    docker ps
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] ERROR: Tetap tidak bisa terhubung ke Docker Engine.
    echo HAL PENTING:
    echo 1. Apakah Docker Desktop sudah dibuka di akun baru ini?
    echo 2. Pastikan user Anda masuk ke grup 'docker-users'.
    echo    (Buka Komputer Management -> Local Users and Groups -> Groups)
    echo 3. Coba jalankan Docker Desktop aplikasi terlebih dahulu.
    echo 4. Jalankan perintah ini secara manual di terminal Anda:
    echo    docker context use default
    echo    ATAU
    echo    docker context use desktop-linux
    pause
    exit /b 1
)
echo [OK] Docker Engine aktif.

:: 3. Run Docker Compose
echo [2/3] Menjalankan Docker Compose...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo [!] Gagal menjalankan docker-compose.
    pause
    exit /b 1
)
echo [OK] Container database berhasil dinyalakan.

:: 4. Sync Prisma Schema
echo [3/3] Melakukan sinkronisasi schema Prisma...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [!] Gagal sinkronisasi schema Prisma.
    echo Pastikan .env sudah benar dan database sudah siap.
    pause
    exit /b 1
)
echo [OK] Schema database berhasil diperbarui.

echo.
echo ==========================================
echo Setup selesai! Database siap digunakan.
echo ==========================================
pause
