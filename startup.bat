@echo off
SETLOCAL EnableDelayedExpansion
echo ==========================================
echo    UNLOADING QC MONITOR - STARTUP REPAIR V6
echo ==========================================
echo Environment Shield Active: NPM_CONFIG_CACHE override
echo.

:: Globally shield this session from the corrupted AppData folder
set "NPM_CONFIG_CACHE=%CD%\.pnpm-cache"
if not exist ".pnpm-cache" mkdir ".pnpm-cache"

echo [1/5] Terminating dangling processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM next-dev.exe /T 2>nul
wmic process where "commandline like '%%turbo%%'" delete 2>nul 2>nul
timeout /t 1 /nobreak >nul

echo [2/5] Cleaning build artifacts...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    if exist ".next" move /y ".next" ".next_old_%RANDOM%" 2>nul
)

echo [3/5] Verifying Dependencies...
if not exist "node_modules" (
    echo node_modules missing. Running PNPM install...
    call pnpm install
) else (
    echo node_modules folder is present.
)

if %ERRORLEVEL% NEQ 0 (
    echo [!] Install failed. Please run pnpm-repair.bat
    pause
    exit /b %ERRORLEVEL%
)

echo [4/5] Syncing database schema...
if exist "node_modules\.bin\prisma.cmd" (
    call node_modules\.bin\prisma generate
) else (
    call npx prisma generate
)

echo [5/5] Launching Development Server...
echo Server will be available at http://localhost:3000
call pnpm run dev

echo ==========================================
echo If the server fails to start, run
echo pnpm-repair.bat as Administrator.
echo ==========================================
pause
