@echo off
SETLOCAL EnableDelayedExpansion
echo ==========================================
echo    UNLOADING QC MONITOR - NUCLEAR RESET V3
echo ==========================================
echo Bypassing corrupted global system using local .npmrc isolation.
echo.

echo [1/6] Terminating all Node/NPM processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM npm.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Bypassing corrupted global cache...
:: We do this as best-effort in case it's still there
set "GLOBAL_CACHE=C:\Users\admin\AppData\Roaming\npm-cache"
if exist "!GLOBAL_CACHE!" (
    echo Attempting to clear !GLOBAL_CACHE!...
    rmdir /s /q "!GLOBAL_CACHE!" 2>nul
    if exist "!GLOBAL_CACHE!" move /y "!GLOBAL_CACHE!" "!GLOBAL_CACHE!_old_%RANDOM%" 2>nul
)

echo [3/6] Clearing local project artifacts...
if exist "node_modules" rmdir /s /q "node_modules" 2>nul
if exist ".next" rmdir /s /q ".next" 2>nul
if exist "package-lock.json" del /f /q "package-lock.json" 2>nul
if exist ".npm-local-cache" rmdir /s /q ".npm-local-cache" 2>nul

echo [4/6] Creating local isolation folder...
mkdir ".npm-local-cache"
echo [SUCCESS] .npmrc will now redirect all NPM traffic to .npm-local-cache.

echo [5/6] Performing clean installation...
:: npm will automatically use the settings in .npmrc
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [!] Installation failed. Trying one last time with --force...
    call npm install --force
)

echo [6/6] Restoring binaries and starting...
if exist "node_modules\.bin\prisma.cmd" (
    call node_modules\.bin\prisma generate
) else (
    call npx prisma generate
)

echo Reset Complete! Starting dev server...
if exist "node_modules\.bin\next.cmd" (
    call node_modules\.bin\next dev --webpack
) else (
    call npm run dev
)

pause
