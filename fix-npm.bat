@echo off
echo === SURGICAL INSTALLATION ===
echo Disabling npm workers to prevent race conditions...
set "TEMP_CACHE=%CD%\npm-surgical-cache"
if exist "%TEMP_CACHE%" rmdir /s /q "%TEMP_CACHE%"
mkdir "%TEMP_CACHE%"

echo.
echo === STEP 1: CORE DEPENDENCIES ===
echo Installing react and next only (max-workers 1)...
call npm install react next --cache "%TEMP_CACHE%" --max-workers 1 --no-audit --no-fund --no-bin-links

echo.
echo === STEP 2: FULL INSTALL (IF STEP 1 PASSED) ===
if %ERRORLEVEL% EQU 0 (
    echo Core installed! Attempting full install...
    call npm install --cache "%TEMP_CACHE%" --max-workers 1 --no-audit --no-fund --no-bin-links
) else (
    echo Core install failed. The issue is deeper than one package.
)
