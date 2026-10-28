# SCI 2027 Conference Venue and Directions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the verified Conference Center - Cairo University venue details and a safe Google Maps directions action in the SCI 2027 hero and preliminary programme.

**Architecture:** Keep the venue name, short address, full footer address, Google Maps share link, and action label in `sci2027Content.ts` as the single source of truth. Render that source in the hero venue card and programme summary card, opening the map in a new tab with `rel="noreferrer"`; the existing footer continues to use the full English location string.

**Tech Stack:** React, TypeScript, Wouter, Tailwind CSS, Vitest, Lucide icons.

---

### Task 1: Specify and test the verified venue contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`
- Modify: `client/src/data/sci2027Content.ts`

**Step 1: Write the failing test**

Add a venue test that requires:

```ts
expect(sci2027Content.identity.location).toMatchObject({
  name: "Conference Center - Cairo University",
  shortAddress: "Beside Students City, Dr. Mikel Bakhoum Rd, Dokki, Giza",
  mapUrl: "https://share.google/pJzENeit3jQYXskJq",
  directionsLabel: "Get directions",
});
```

Require the hero and programme source to use the venue name and `mapUrl` in a new-tab, `noreferrer` link.

**Step 2: Run the focused test and confirm it fails**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: failure because the location source does not yet include the verified venue fields or directions rendering.

**Step 3: Add minimal central venue data**

Keep `identity.location.en` and `.ar` for existing footer compatibility. Add the verified English display name, short address, Google share link, and `Get directions` label.

**Step 4: Run the focused test and confirm it passes**

Run: `pnpm exec vitest run client/src/data/sci2027Content.test.ts`

Expected: pass.

### Task 2: Render venue and directions actions

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`
- Modify: `client/src/pages/Sci2027Programme.tsx`

**Step 1: Update the hero venue card**

Render `identity.location.name` and `shortAddress` in the existing card. Add a compact, text-safe `Get directions` action with the existing navy, gold and muted text system, opening Google Maps in a new tab.

**Step 2: Update the programme venue summary card**

Render the same venue name and compact `Get directions` action in the third programme hero card. Import only the needed Lucide external-link icon.

**Step 3: Verify responsive layout**

Review the hero and programme on desktop and 390px mobile widths. Confirm the address wraps cleanly and the directions action remains reachable.

### Task 3: Release verification and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run the complete release commands**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

Verify exact venue source data and public link target with `pnpm exec tsx`.

**Step 2: Save a WebDev checkpoint**

Save the verified venue and directions update only after the full suite and visual review complete.
