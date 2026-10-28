# Unit Director Card Size Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Prof. Walid Rahouma card occupy the same single grid column as all other Unit-member cards, while retaining its dark navy, white and gold director treatment.

**Architecture:** The existing Unit roster card grid is responsive: two columns at the medium breakpoint and three at the extra-large breakpoint. Remove only the first-card `col-span-2` utilities. Keep all visual identity conditions based on `index === 0`, so typography, dark background, light body text and gold accents remain unchanged.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Add a failing layout regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Read `Sci2027Home.tsx` and assert that the Unit member grid has its existing responsive column classes, the first-card dark styling remains, and no `md:col-span-2` or `xl:col-span-2` class exists.

**Step 2: Verify RED**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the current first card uses two-column spans.

### Task 2: Apply the minimal layout change

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Remove only the span utilities**

Change the first-card class branch from `md:col-span-2 xl:col-span-2 border-[#063760] bg-[#063760] text-white` to `border-[#063760] bg-[#063760] text-white`.

**Step 2: Verify GREEN**

Run the focused Vitest command. Expected: PASS.

### Task 3: Release verification and checkpoint

**Files:**
- Modify: `todo.md`

1. Run `pnpm test`, `pnpm check`, `pnpm build`, and `git diff --check`.
2. Capture desktop and mobile screenshots of the homepage Unit section.
3. Confirm the director card remains dark navy with gold accents but occupies one column at both responsive breakpoints.
4. Mark the checklist item complete and save a WebDev checkpoint.
