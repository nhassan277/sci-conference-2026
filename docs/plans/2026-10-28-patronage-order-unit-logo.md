# Patronage Order and Unit Logo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Position Distinguished Patronage immediately after the SCI 2027 Hero while retaining both portrait cards, and enlarge the Conference Organization Unit mark by removing its white circular container.

**Architecture:** Reuse the existing Patronage JSX unchanged and move it above the `#about` introduction section. Keep the Unit logo in the same introductory row but render the official asset directly at a larger responsive size, without a wrapper background, border, or shadow.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Define the display-order and logo-treatment regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Read the page source in the test.
2. Assert that `Distinguished patronage` occurs after the hero and before `Science, partnership and impact`.
3. Assert that the Unit logo is rendered directly with `conferenceOrganizationUnit.logoUrl`, `object-contain`, and a larger responsive height, while the legacy white container classes are absent.
4. Run `pnpm exec vitest run client/src/data/sci2027Content.test.ts`; expect failure because the current section order and wrapper remain.

### Task 2: Implement the minimal page layout changes

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

1. Move the existing Distinguished Patronage section intact to immediately after the Hero section.
2. Do not change either patronage image URL, name, role, aspect ratio, or card colors.
3. Replace the Unit logo wrapper with a direct, larger responsive image at the existing left-of-title location.
4. Do not alter the official Unit logo asset or its data source.

### Task 3: Verify responsive quality and preserve state

**Files:**
- Modify: `todo.md`

1. Run the focused regression test, then `pnpm test`, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Capture desktop and mobile full-page views to inspect Hero → Patronage → Introduction ordering and the direct enlarged Unit logo.
3. Mark the tracking items complete and save a WebDev checkpoint.
