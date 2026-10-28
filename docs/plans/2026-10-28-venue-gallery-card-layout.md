# Venue Gallery Card Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Present the eight `Explore the Venue` photographs as full, captioned cards matching the two primary Venue & Halls cards.

**Architecture:** Keep all eight images in the existing central `identity.location.venueGallery` data source. Add concise visible captions to each record. Render every item as a full uncropped image in the same bordered, shadowed figure card used for `venueVisuals`, arranged as two cards per row from the small breakpoint upward and a single card on narrow mobile screens.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Define the card-data and layout regression contract

**Files:**
- Modify: `client/src/data/sci2027Content.test.ts`

**Step 1: Write the failing test**

Require all eight `venueGallery` records to include a meaningful `caption`, and require the homepage to render gallery captions in an `sm:grid-cols-2` card grid without the existing `lg:grid-cols-4` compact-thumbnail grid.

**Step 2: Run the focused test and confirm it fails**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: failure because gallery records lack captions and the eight cards use the compact four-column layout.

### Task 2: Implement the unified venue-card presentation

**Files:**
- Modify: `client/src/data/sci2027Content.ts`
- Modify: `client/src/pages/Sci2027Home.tsx`

**Step 1: Add concise gallery captions**

Add one English caption to every existing hosted gallery record. Do not change URLs, alternate text, image dimensions or source labels.

**Step 2: Apply the card layout**

Use the primary-card styling for each gallery figure:

```tsx
<figure className="self-start overflow-hidden border border-[#063760]/10 bg-[#f7f2e7] shadow-[0_20px_55px_rgba(6,55,96,0.16)]">
  <img ... className="block h-auto w-full" />
  <figcaption className="border-t border-[#063760]/10 bg-white px-5 py-4 text-xs font-semibold leading-5 text-[#617986]">{photo.caption}</figcaption>
</figure>
```

Render the cards in a `grid gap-5 sm:grid-cols-2`, preserving one card per row on narrow mobile screens, two per row on larger screens and original image proportions without any overlay or crop.

**Step 3: Run the focused test**

Run:

```bash
pnpm exec vitest run client/src/data/sci2027Content.test.ts
```

Expected: PASS.

### Task 3: Verify responsive behavior and checkpoint

**Files:**
- Modify: `todo.md`

**Step 1: Run full release verification**

```bash
pnpm test
pnpm check
pnpm build
git diff --check
```

**Step 2: Review the gallery visually**

Review desktop and mobile screenshots. Confirm that all eight photos are full cards with visible captions and no crop or text overlay.

**Step 3: Save a WebDev checkpoint**

Update the checklist and save a checkpoint after fresh verification.
