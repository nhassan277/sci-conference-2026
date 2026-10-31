# Post-Conference Workshop Date Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the SCI 2027 post-conference workshop day from Friday, 9 April 2027 to Saturday, 10 April 2027 across all SCI 2027 public website and programme content, while preserving the main conference dates of 7–8 April and the pre-conference workshop day of 6 April.

**Architecture:** Keep `sci2027Content.ts` as the source of truth for programme dates and workshop facts. Update the explicit programme schedule key and compact homepage/programme date ranges to end on 10 April. Do not modify SCI 2026 routes, historical pages, or the externally hosted brochure.

**Tech Stack:** React, TypeScript, Vitest.

---

### Task 1: Define date-regression coverage

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Update the workshop-date test to require the programme sequence `6, 7, 8, 10 April 2027`, a `Saturday` post-conference day label, `10 April 2027` in the post-conference workshop data, the `6–10 April 2027` public programme range, and no `9 April 2027` in the SCI 2027 homepage, programme page or central content source.

**Step 2: Run the focused test to confirm RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because current public SCI 2027 content still refers to Friday, 9 April 2027 and `6–9 April 2027`.

### Task 2: Update central SCI 2027 date data and page schedule key

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Programme.tsx`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Change date source of truth**

In `sci2027Content.ts`, change:
- the post-conference programme day to `10 April 2027` and `Saturday`;
- `workshopProgramme.postConference.date` to `10 April 2027`; and
- the central workshop-date summary to list 6 and 10 April, including the optional cultural visit date.

Keep 6 April pre-conference workshops and 7–8 April main conference dates unchanged.

**Step 2: Change rendered programme keys and ranges**

In `Sci2027Programme.tsx`, use `10 April 2027` as the final schedule key and change the range to `6–10 April 2027`. In `Sci2027Home.tsx`, change the preliminary-programme overview range to `6–10 April 2027`.

**Step 3: Run the focused test to confirm GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review public pages**

Verify the homepage and Programme page display `6–10 April 2027`, with the separate main-conference date remaining `7–8 April`, and the post-conference workshop as Saturday, 10 April 2027.

**Step 3: Save checkpoint**

Mark the three date-update items complete and save a WebDev checkpoint.
