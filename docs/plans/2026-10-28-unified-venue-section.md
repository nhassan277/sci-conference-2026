# Unified Venue Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge the former Venue & Halls and Explore the Venue content into one concise venue section, while showing only the approved eight-photo, two-page 2×2 manual carousel.

**Architecture:** Retain the central venue data and the existing eight hosted gallery photographs. Simplify the homepage’s `#venue` markup into one text-led layout containing the existing venue heading, a single approved combined description, address and directions action, followed immediately by the existing interactive eight-photo carousel. Remove the two large primary-composite figures only from the homepage presentation; do not delete or modify their central records or hosted assets.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Define the unified-section regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Replace the primary-visual presentation test with assertions that the homepage:
- retains the venue section in its approved position after Distinguished Patronage;
- includes the title, address and safe directions action;
- uses the exact approved combined description;
- does not render the `venueVisuals` map or its two large-image captions; and
- does not render the duplicate Explore the Venue eyebrow, heading or explanatory text.

Preserve regression coverage that the central `venueVisuals` and the eight-photo carousel data records remain available and that the gallery stays in two manually controlled 2×2 pages.

**Step 2: Run the focused test and confirm it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: FAIL because the homepage still renders two large `venueVisuals` figures and the duplicate Explore the Venue content.

### Task 2: Implement the unified venue presentation

**Files:**
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Remove duplicate visual content from the homepage only**

Remove the two-primary-visual grid and all Explore the Venue title/description markup. Do not alter hosted images, uploads or the central source records.

**Step 2: Apply the approved unified content flow**

Render this exact English description below the existing heading:

> Explore the Conference Center - Cairo University, from its main auditorium and supporting meeting facilities to its entrance, shared spaces, corridors and atrium.

Keep the venue name, short address and safe directions action, then position the current eight-photo carousel immediately below.

**Step 3: Run the focused test**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify, document and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run the complete release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review visual hierarchy and interaction**

At desktop and 375 px mobile widths, confirm that the section has only one venue title/description flow, no two large primary figures, and the carousel still shows four images per group with manual arrows and dots.

**Step 3: Save a WebDev checkpoint**

Mark the tracked merge work complete only after fresh verification, then save a descriptive checkpoint.
