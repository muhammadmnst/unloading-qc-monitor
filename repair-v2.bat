@echo off
echo === PNPM PIVOT REPAIR V2 ===

echo 1. Manually building corepack hierarchy...
if not exist "%LocalAppData%\node\corepack\v1" mkdir "%LocalAppData%\node\corepack\v1"

echo 2. Setting local corepack home...
set "COREPACK_HOME=%CD%\.corepack"
if not exist ".corepack" mkdir ".corepack"

echo 3. Enabling pnpm via corepack...
call corepack enable pnpm

echo 4. Attempting pnpm installation...
call pnpm install

echo 5. Verifying environment...
if exist node_modules\.bin\next (
    echo [SUCCESS] Environment restored.
) else (
    echo [FAILED] node_modules still missing.
)
