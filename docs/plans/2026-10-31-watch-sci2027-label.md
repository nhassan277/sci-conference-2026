# Watch SCI 2027 Label Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Present the public SCI 2027 video experience consistently as “Watch SCI 2027” while retaining the existing `/videos` route, video assets, YouTube channel, and player behaviour.

**Architecture:** Update only display labels that currently identify the public video destination. Keep `/videos` as the canonical route to preserve existing links. Do not rename technical component, data, or asset identifiers where “video” describes implementation or media content rather than public navigation.

**Tech Stack:** React, TypeScript, Wouter, Tailwind CSS, Vitest.

---

### Task 1: Define the public-label contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write a failing test**

Add a regression test requiring:
- `Sci2027Header.tsx` to label the `/videos` navigation item as `Watch SCI 2027`;
- `Sci2027Videos.tsx` to present `Watch SCI 2027` as its public heading; and
- `/videos` to remain the registered route in `client/src/App.tsx`.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the header and/or video page still use the old public Videos label.

### Task 2: Apply the consistent public label

**Files:**
- Modify: `client/src/components/Sci2027Header.tsx`
- Modify: `client/src/pages/Sci2027Videos.tsx`

**Step 1: Update public labels**

Replace the primary-navigation `Videos` label with `Watch SCI 2027`. Update the public video-page heading to the same wording.

**Step 2: Preserve routing and media**

Do not change the `/videos` route in `client/src/App.tsx`, video array, embeds, controls, YouTube link, or footer entry already labelled `Watch SCI 2027`.

**Step 3: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review in browser**

Confirm the desktop header and mobile menu show `Watch SCI 2027`, opening the existing `/videos` page. Confirm its heading is consistent and playback remains manual.

**Step 3: Checkpoint**

Mark the tracked tasks complete and save a WebDev checkpoint.
