@echo off
echo === ULTIMATE RELOCATION (C:\Dev) ===
echo.

set "NEW_PATH=C:\Dev\Operational"

echo 1. Creating Developer Sandbox at %NEW_PATH%...
if not exist "C:\Dev" mkdir "C:\Dev"
if not exist "%NEW_PATH%" mkdir "%NEW_PATH%"

echo.
echo 2. Copying project files...
xcopy . "%NEW_PATH%" /E /I /Y /EXCLUDE:exclude.txt

echo.
echo 3. Attempting installation in the Sandbox...
cd /d "%NEW_PATH%"
call npm install

echo.
echo === SUMMARY ===
if exist node_modules\.bin\next (
    echo [SUCCESS] Project restored in %NEW_PATH%
    echo Please open this folder in your editor.
) else (
    echo [FAILED] Still blocked. 
    echo Please check 'Controlled Folder Access' in Windows Security.
)
pause
