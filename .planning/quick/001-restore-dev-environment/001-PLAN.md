---
task: 001
name: Restore Dev Environment
description: Fix the corrupted node_modules environment where 'next' command is missing.
---

# Quick Task 001: Restore Dev Environment

## Objective
Restore the local development environment so that `npm run dev` works correctly.

## Tasks

<task type="auto">
  <name>Clean Environment</name>
  <files>node_modules, package-lock.json</files>
  <action>Remove node_modules and package-lock.json to ensure a clean state.</action>
  <verify>ls node_modules (should fail or be empty)</verify>
  <done>Files removed.</done>
</task>

<task type="auto">
  <name>Install Dependencies</name>
  <files>package.json</files>
  <action>Run npm install to restore the dependency tree.</action>
  <verify>npx next --version</verify>
  <done>Packages installed and next command available.</done>
</task>

---
*Created: 2026-04-16*
