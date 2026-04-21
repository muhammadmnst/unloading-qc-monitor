@echo off
SETLOCAL EnableDelayedExpansion
echo ==========================================
echo    UNLOADING QC MONITOR - SURGICAL REPAIR
echo ==========================================
echo Bypassing broken NPM/Corepack using standalone pnpm.cjs
echo.

echo [1/6] Terminating all Node processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Purging environment artifacts...
set "JUNK_LIST=.npm-local-cache .pnpm-cache .pnpm-store node_modules .next .pnpm-debug.log pnpm.cjs"
for %%j in (!JUNK_LIST!) do (
    if exist "%%j" (
        echo Deleting %%j...
        rmdir /s /q "%%j" 2>nul
        del /f /q "%%j" 2>nul
    )
)

echo [3/6] Downloading standalone pnpm.cjs...
:: Using curl (standard in Windows 10/11) to get the latest pnpm standalone script
curl -L https://unpkg.com/pnpm/dist/pnpm.cjs -o pnpm.cjs

if not exist "pnpm.cjs" (
    echo [FAILED] Could not download pnpm.cjs. Please check your internet connection.
    pause
    exit /b 1
)

echo [4/6] Performing naked PNPM installation...
:: We run the script directly with node, bypassing ALL global npm/corepack logic
:: We also force a local store directory to be absolute and within the project
node pnpm.cjs install --no-frozen-lockfile --store-dir "%CD%\.pnpm-store" --prefer-offline=false

if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Installation failed. 
    echo This suggests a serious filesystem or permission block on: %CD%
    pause
    exit /b %ERRORLEVEL%
)

echo [5/6] Syncing database schema...
if exist "node_modules\.bin\prisma.cmd" (
    call node_modules\.bin\prisma generate
) else (
    node pnpm.cjs exec prisma generate
)

echo [6/6] Launching Development Server...
echo Server will be available at http://localhost:3000
node pnpm.cjs run dev

pause
