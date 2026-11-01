# Sponsorship Committee and Unit Roster Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Prof. Rasha El-Nashar from the public SCI 2027 Conference Organization Unit roster and acknowledge Dr. Hoda Abu Shady with Prof. Azza Shoukry in a distinct Sponsorship Committee on the Partnerships & Sponsorship page.

**Architecture:** Keep the roster and sponsorship committee information in `sci2027Content.ts` as the single source of truth. The existing Unit page will update automatically from the revised members array. Add a distinct responsive committee section immediately before the existing Student Sponsorship Assistants acknowledgement; Azza’s existing Unit role stays unchanged.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Wouter.

---

### Task 1: Define the approved roster and sponsorship-committee contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write failing tests**

Update the Unit roster expectation to contain eight approved members and no Prof. Rasha El-Nashar. Add an assertion requiring:

```ts
sci2027Content.sponsorship.sponsorshipCommittee
```

to equal:

```ts
{
  title: "Sponsorship Committee",
  members: ["Dr. Hoda Abu Shady", "Prof. Azza Shoukry"],
}
```

Also require the Sponsorship page to map the committee members before the Student Sponsorship Assistants block, and require Azza’s Unit role to remain `Registration & Operations Lead`.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the Unit still contains Rasha and no committee data/UI exists.

### Task 2: Apply the minimal data and UI updates

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Sponsorship.tsx`

**Step 1: Update the Unit roster**

Remove only the `Prof. Rasha El-Nashar` object from `conferenceOrganizationUnit.members`. Preserve Prof. Azza Shoukry’s department, role, and summary verbatim.

**Step 2: Add sponsorship committee data**

Create the exact `sponsorshipCommittee` record under `sponsorship`, containing the agreed English title and the two confirmed names only.

**Step 3: Render distinct committee section**

Render a responsive, English-only Sponsorship Committee section before the existing Student Sponsorship Assistants acknowledgement. Render the two names from the central record; do not add roles, departments, portraits, or membership to the Unit/Organizing Committee lists.

**Step 4: Verify GREEN**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Review and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Release checks**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Responsive review**

Review the Unit page to confirm it has eight members and no Prof. Rasha El-Nashar. Review the Sponsorship page at desktop and 390px wide to confirm the new committee appears before Student Sponsorship Assistants with both approved names.

**Step 3: Checkpoint**

Mark the three focused tasks complete and save a WebDev checkpoint.
