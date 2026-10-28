# SCI 2027 YouTube Channel Link Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the approved SCI 2027 YouTube channel as an external new-tab action in the shared footer and on the promotional-videos page.

**Architecture:** Store the canonical channel URL, action label, and short description in the central `contact` content record. Reuse this content in `Sci2027Footer.tsx` and `Sci2027Videos.tsx`, with `target="_blank"` and `rel="noreferrer"`. No embedded channel, automatic fetching, or social account data collection will be added.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, Vitest.

---

### Task 1: Red regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

1. Require the exact canonical channel URL, label `Follow SCI 2027 on YouTube`, and description `Conference updates, highlights and official videos`.
2. Require the footer and video page to reference the central channel URL and use safe new-tab attributes.
3. Run the focused Vitest test; confirm failure because the channel record and actions do not exist.

### Task 2: Content and presentation

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/components/Sci2027Footer.tsx`
- Modify: `client/src/pages/Sci2027Videos.tsx`

1. Add the canonical YouTube record to the source-of-truth contact content.
2. Add a small YouTube-icon action in the footer contact column, with the approved description.
3. Add a matching YouTube-icon action in the videos-page hero information card.
4. Keep the existing hosted videos, player behavior, and social links unchanged.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

1. Run focused Vitest coverage, all tests, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Verify the central URL, both safe external anchors, and exact English description.
3. Review desktop and mobile full-page screenshots.
4. Complete the checklist entries and save a WebDev checkpoint.
