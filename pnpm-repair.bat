@echo off
SETLOCAL EnableDelayedExpansion
echo ==========================================
echo    UNLOADING QC MONITOR - PNPM REPAIR V2
echo ==========================================

:: FORCE override of the corrupted global cache via environment variable
set "NPM_CONFIG_CACHE=%CD%\.pnpm-cache"
if not exist ".pnpm-cache" mkdir ".pnpm-cache"

echo [1/6] Terminating all Node/NPM/PNPM processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM npm.exe /T 2>nul
taskkill /F /IM pnpm.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Purging all previous caches and junk...
set "JUNK_LIST=.npm-local-cache .pnpm-cache .pnpm-store node_modules .next"
for %%j in (!JUNK_LIST!) do (
    if exist "%%j" (
        echo Deleting %%j...
        rmdir /s /q "%%j" 2>nul
    )
)
if exist "package-lock.json" del /f /q "package-lock.json" 2>nul

echo [3/6] Initializing PNPM via Corepack...
:: Corepack is built into Node and often avoids the npm cache fetch issues
call corepack enable pnpm 2>nul
call pnpm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Corepack failed. Attempting PNPM download with FORCED CACHE...
    :: We use the environment variable set above to shield this call
    call npm install -g pnpm --cache "%NPM_CONFIG_CACHE%"
)

echo [4/6] Performing clean PNPM installation...
:: Use the local store to avoid any other global pollution
call pnpm install --no-frozen-lockfile --store-dir .pnpm-store

if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] PNPM installation failed.
    echo Check for network/permission blocks on .pnpm-store or .pnpm-cache.
    pause
    exit /b %ERRORLEVEL%
)

echo [5/6] Syncing database schema...
if exist "node_modules\.bin\prisma.cmd" (
    call node_modules\.bin\prisma generate
) else (
    call npx prisma generate
)

echo [6/6] Launching Development Server...
echo Server will be available at http://localhost:3000
call pnpm run dev

pause
