# Conference Committees Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an English-only Conference Committees section immediately after Distinguished Patronage on the SCI 2027 homepage, showing the Scientific Committee as to be announced and linking the Organizing Committee to the existing Conference Organization Unit page without duplicating member names.

**Architecture:** Keep committee information in the existing homepage because both statements are short and presentation-only. Place a responsive two-card section between the patronage section and the venue section. Reuse the existing internal Wouter `Link` to `/conference-organization-unit`, which remains the canonical place for the Unit roster and responsibilities.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Wouter, Vitest.

---

### Task 1: Define the section contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write a failing test**

Add a single test requiring source evidence for:
- `id="conference-committees"`;
- the English-only `Scientific Committee`, `To be announced.`, `Organizing Committee`, and `Conference Organization Unit and its members.` statements;
- a Wouter link to `/conference-organization-unit` with the exact label `Meet the Conference Organization Unit`;
- source order after the patronage-card mapping and before the Venue & Halls section; and
- no member-list mapping within the homepage committee section.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the committee section has not yet been rendered.

### Task 2: Render the committee section

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Add the section**

Insert a responsive section directly after the Distinguished Patronage closing tag. Use a concise heading, a Scientific Committee card with only `To be announced.`, and an Organizing Committee card with the approved statement and internal page link. Use the existing `Sparkles` and `UsersRound` icons; do not add names, portraits, external links, or unconfirmed committee members.

**Step 2: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run full release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review responsiveness**

Verify desktop two-card layout and narrow-mobile stacking. Confirm the section follows Distinguished Patronage, the call-to-action reaches `/conference-organization-unit`, and no member roster is repeated on the homepage.

**Step 3: Checkpoint**

Mark the three tracked tasks complete and save a descriptive WebDev checkpoint.
