@echo off
echo === DIAGNOSTICS ===
echo Node version:
node -v
echo NPM version:
npm -v
echo Listing processes (node/next/turbo):
tasklist /FI "IMAGENAME eq node.exe"
tasklist /FI "IMAGENAME eq next-dev.exe"
echo Checking for .next folder size:
dir .next
echo Checking for node_modules/.bin/next:
if exist node_modules\.bin\next.cmd (echo next.cmd exists) else (echo next.cmd MISSING)
