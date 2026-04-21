@echo off
echo Checking for alternative package managers...
where pnpm
if %ERRORLEVEL% EQU 0 (pnpm --version) else (echo pnpm not found)

where yarn
if %ERRORLEVEL% EQU 0 (yarn --version) else (echo yarn not found)

where corepack
if %ERRORLEVEL% EQU 0 (corepack --version) else (echo corepack not found)

echo.
echo Testing local node.exe filesystem access...
node -e "const fs = require('fs'); try { fs.mkdirSync('node-test-dir'); console.log('Node mkdir success'); fs.rmdirSync('node-test-dir'); } catch (e) { console.error('Node mkdir failed:', e.message); }"
