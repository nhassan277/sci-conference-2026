# SCI 2026 Archive Navigation Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the existing SCI 2026 Archive publicly discoverable from the SCI 2027 primary navigation, immediately after the SCI 2027 videos entry, while retaining its current footer access and archive content.

**Architecture:** Add one item to the shared `navigation` array in `Sci2027Header.tsx`. Desktop and mobile navigation are both generated from that same array, ensuring identical ordering without duplicated navigation markup. Reuse the existing public archive route; do not alter the SCI 2026 archive page, its content, or the footer link.

**Tech Stack:** React, TypeScript, Tailwind CSS, Wouter, Vitest.

---

### Task 1: Define the navigation contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Add a test requiring:
- the existing SCI 2026 archive route from `App.tsx`;
- a header navigation record with the exact label `SCI 2026 Archive` and that route;
- source order directly after `{ href: "/videos", label: "Videos" }`; and
- the shared `navigation.map` rendering for both desktop and mobile navigation.

**Step 2: Verify RED**

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the header has no SCI 2026 Archive item.

### Task 2: Add the shared header item

**Files:**
- Modify: `client/src/components/Sci2027Header.tsx`

**Step 1: Add the route item**

Insert `{ href: "<existing archive route>", label: "SCI 2026 Archive" }` directly after the existing Videos entry. Do not change the 2xl desktop breakpoint or mobile-map implementation, since the shared array automatically provides the item in both places.

**Step 2: Verify GREEN**

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

**Step 2: Review navigation**

At wide desktop width, verify the tab appears after Videos and navigates to the existing archive. At narrow mobile width, open the menu and verify the same tab and order; test the route destination.

**Step 3: Checkpoint**

Mark the tracked tasks complete and save a WebDev checkpoint.
