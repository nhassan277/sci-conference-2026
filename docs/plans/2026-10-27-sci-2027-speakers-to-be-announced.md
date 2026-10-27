# SCI 2027 Speaker Status Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add English-only, name-free Keynote Speakers and Invited Speakers sections to the SCI 2027 homepage and programme page, each clearly marked “To be announced”, while retaining Speaker Registration.

**Architecture:** Add a compact `speakers` record to `sci2027Content.ts` as the single public source of truth. Replace unconfirmed speaker counts and schedule claims with explicit to-be-announced speaker sessions. Render a restrained two-card speaker status section on both public pages with no names, portraits, affiliations, or speculative data.

**Tech Stack:** React 19, TypeScript, Wouter, Tailwind CSS, Vitest, Vite.

---

### Task 1: Define the expected behaviour in a failing regression test

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Add a test requiring:

```ts
expect(sci2027Content.speakers.status).toBe("Keynote and invited speakers will be announced soon.");
expect(sci2027Content.speakers.groups.map((group) => group.title)).toEqual([
  "Keynote Speakers",
  "Invited Speakers",
]);
expect(sci2027Content.speakers.groups.every((group) => group.status === "To be announced")).toBe(true);
```

Also require the homepage and programme page to reference `speakers`, and ensure public source files no longer contain the obsolete unconfirmed “15 international keynote speakers”, “two international keynote speakers”, or “Invited-speaker lectures in six parallel halls” wording.

**Step 2: Run the test and observe the expected failure**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because no `speakers` data record or public sections exist yet.

### Task 2: Update public speaker status data and programme claims

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Programme.tsx`

**Step 1: Implement minimal source data**

- Add a `speakers` object with the approved announcement sentence and two groups.
- Remove the “15 international keynote speakers” metric.
- Update the main-programme session titles to say “To be announced” for Keynote and Invited Speaker sessions rather than imply confirmed quantities, identities, or lecture allocation.

**Step 2: Add a restrained programme speaker panel**

- Present the two speaker groups as compact announcement cards.
- Use only typed content from `sci2027Content.speakers`.
- Preserve the Speaker Registration form unchanged.

**Step 3: Run the regression test**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Add the homepage speaker announcement section

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Render the source-of-truth status**

- Add a dedicated English-only section near the scientific-track content.
- Use a two-card design for Keynote Speakers and Invited Speakers.
- Show “To be announced” with no portraits, names, affiliations or placeholder biographies.
- Do not alter the existing Speaker Registration card or form URL.

### Task 4: Verify and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Complete release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Use a text check to prove obsolete speaker-count and lecture wording is absent from the SCI 2027 public sources.

**Step 2: Review desktop and mobile layouts**

Capture the homepage and programme page at desktop and mobile dimensions. Confirm the two announcement cards are clear, neither exposes unapproved speaker details, and Speaker Registration remains present.

**Step 3: Checkpoint**

Mark the tasks complete in `todo.md` and save a WebDev checkpoint after verification succeeds.
